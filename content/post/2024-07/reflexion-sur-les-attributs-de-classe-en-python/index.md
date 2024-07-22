---
title: "Réflexion sur les attributs de classe en Python"
description: "Je dois admettre qu'au moment où j'écris ces lignes, je commence tout juste à coder avec Python. Pourtant, je voulais appliquer un code propre tel que je l'ai appris."
image: images/2024-07-31-3d-python-programming-book.jpg
imageAlt: "Livre de programmation Python"
date: 2024-07-31
categories:
  - Développement Web
tags:
  - Python
---

## Le projet

Je voulais me familiariser avec Python et construire une API simple pour enregistreur le temps passé sur les divers projets que je traite personnellement.

L'application est organisée en projets. Les projets définissent des tâches et chaque fois que je travaille sur une tâche, j'enregistre le temps passé.

C'est simple, n'est-ce pas ?

## Mon cas d'utilisation

Je vais sauter au moment où je voulais sauvegarder un projet dans une base de données SQL Lite et lire un projet par son identifiant ou la liste des projets dans la base de données.

J'ai utilisé Gemini jusqu'au bout pour coder le squelette de l'API.

{{< blockcontainer jli-notice-note "A propos de l'IA pour apprendre à coder...">}}

L'IA ne fait pas tout à votre place et je trouve qu'elle ne trouvera ni ne codera la solution pour vous dans 100 % des cas.

Bien qu'elle soit très utile, vous aurez besoin de compétences comme les bases du langage de programmation.

Si vous commencez par des questions fondamentales, vous comprendrez mieux comment formuler les questions plus complexes par la suite.

{{< /blockcontainer >}}

When it was time to implement the `get_project` method, the AI gave this:

```python
def get_project(project_id: str) -> ProjectData | None:
  conn = sqlite3.connect(f'db{os.sep}database_sqllite3.db')
  cursor = conn.cursor()

  cursor.execute('''SELECT id, name, color, isArchived FROM projects WHERE id = ?''', (project_id,))
  project_data = cursor.fetchone()

  conn.close()

  if project_data:
    return ProjectData(project_data[1], project_data[2], bool(project_data[3]))  # Convert retrieved data to ProjectData object
  else:
    return None
```

I didn’t like the index-based parsing of the `project_data` record.

So I asked how to make the code be more generic so it uses the DTO class attributes to build the response.

The AI suggested two approaches:

**1. Using namedtuples:** it explained “This approach provides a more readable way to access the data by using named fields instead of numerical indexes.”

**2. Using dictionary comprehension:** it explained “This approach offers a more concise way to convert the data into a dictionary, especially if you need to handle dynamic column names.”

I went for the namedtuples way and the code looked like this:

```python
from collections import namedtuple

ProjectRecord = namedtuple('ProjectRecord', ['id', 'name', 'color', 'isArchived'])

def get_project(project_id: str) -> Optional[ProjectRecord]:
  # ... (same connection and cursor logic)

  cursor.execute('''SELECT id, name, color, isArchived FROM projects WHERE id = ?''', (project_id,))
  project_data = cursor.fetchone()

  conn.close()

  if project_data:
    return ProjectRecord(*project_data)  # Unpack data using * operator
  else:
    return None

```

Though it read the database fine and return the data, the API responded an array of value instead of an object:

```json
["6964ba78-8dc4-4f23-b525-a0d9fbab865c", "New Project", "#000000", 0]
```

I needed the output to be:

```json
{
  "id": "6964ba78-8dc4-4f23-b525-a0d9fbab865c",
  "name": "New Project",
  "color": "#000000",
  "isArchived": false
}
```

After a few prompts, the AI gave me the `_asdict` method that is provided by namedtuples. It creates a dictionary with keys matching the named fields.

So the final code on the API controller looked like this:

```python
@app.route('/api/v1.0/project/<string:id>', methods=['GET'])
def api_project_get(id: int):
  project = get_project(id)
  if project:
    return jsonify(project._asdict())
  else:
    return jsonify({'error': 'Project not found'}), 404
```

## More reusability

I wanted to go further into reusability.

The AI gave the following as the starting code:

```python
def get_namedtuple_from_type(cls):
  """
  Creates a namedtuple type based on the public attributes of a class.

  Args:
      cls (class): The class to use for generating the namedtuple type.

  Returns:
      namedtuple: A namedtuple type with fields matching the class's public attributes.
  """
  field_names = [attr for attr, value in getmembers(cls) if not callable(value)]
  tuple = namedtuple(cls.__name__, field_names)
  return tuple
```

PS: I renamed the method name and returned value to be more generic.

Unfortunately, it didn’t work and even if I tried a few other prompts, the AI couldn’t get me a working solution.

So I went to a Google search and I realized something.

In the scaffolding stage of the API, the AI suggested me to use a class to define a project.

The AI gave me this:

```python
class ProjectData:
  def __init__(self, name: str, color: str, isArchived: bool = False):
    self.id = None  # This will be assigned during project creation
    self.name = name
    self.color = color
    self.isArchived = isArchived

```

At that moment, I realized that the attributes of `ProjectDto` weren’t `id`, `name`, `color` and `isArchived`... So I couldn’t get `['id', 'name', 'color', 'isArchived']`...

So I added the class attributes:

```python
class ProjectData:
  id: str | None
  name: str
  color: str
  isArchived: bool
```

With a bit of debugging, I saw that to get the attributes, I had to do the following:

```python
def get_tuple_from_type(cls):
  # The line below instantiate a dummy object to filter out all the default members
  # of an object instance.
  boring = dir(type('dummy', (object,), {}))
  cls_extract = [item
            for item in getmembers(cls)
            if item[0] not in boring]
  # I was left with one item in cls_extract = ['__annotations__']
  # There is no reason that I don't get at least one item in cls_extract
  if cls_extract.__len__ == 0:
    raise TypeError('(Lvl1) The class has no attribute defined. Cannot use "get_tuple_from_type".')
  if cls_extract[0].__len__ == 0:
    raise TypeError('(Lvl2) The class has no attribute defined since "__annotations__" wasn´t found. Cannot use "get_tuple_from_type".')
  # This makes sure I get a runtime error in case the Dto class doesn't declare attributes
  if cls_extract[0][0] != '__annotations__':
    raise TypeError('The class has no attribute defined since "__annotations__" wasn´t found. Cannot use "get_tuple_from_type".')

  # The first element of cls_extract is an array itself where:
  #   - index=0 equals to ""
  #   - index=1 equlas to an object with the cls type's attributes
  # So below, I retrieve the keys from the object
  raw_field_names = cls_extract[0][1].keys()
  # and finally convert it to an array of strings.
  field_names = list(raw_field_names)
  # At last, we have the namedtuple!
  return namedtuple(cls.__name__, field_names)

```

So, my `get_project` method became the following:

```python
from dto.ProjectData import ProjectDto

def get_project(project_id: str) -> ProjectDto:
  try:
    conn = sqlite3.connect(f'db{os.sep}database_sqllite3.db')
    cursor = conn.cursor()
    cursor.execute('''SELECT id, name, color, isArchived FROM projects WHERE id = ?''', (project_id,))
    project_data = cursor.fetchone()
    ProjectRecord = get_tuple_from_type(ProjectDto)  # Get namedtuple type dynamically

    if project_data:
      return ProjectRecord(*project_data)  # Unpack data using * operator
    else:
      return None

  finally:
    conn.close()

```

Thanks to that approach, the `get_projects` was very simple to write. I could therefore reuse `get_tuple_from_type` and return the list of projects:

```python
def get_projects() -> list[ProjectDto]:
  try:
    conn = sqlite3.connect(f'db{os.sep}database_sqllite3.db')
    cursor = conn.cursor()

    cursor.execute('''SELECT id, name, color, isArchived FROM projects''')
    project_data = cursor.fetchall()

    ProjectRecord = get_tuple_from_type(ProjectDto)  # Get namedtuple type dynamically

    projects = []
    for row in project_data:
      projects.append(ProjectRecord(*row))  # Unpack data using * operator for each row
    return projects
  finally:
    conn.close()
```

Though the AI helped me scaffold the API, you still need to think and research yourself!

{{< blockcontainer jli-notice-note "About the solution I coded and shared here.">}}

I’m still learning Python and since I wrote the above, a more experienced colleague told me that using `__len__` or `__name__` isn’t safe.

All, the DTO classes should be data classes (using the `@dataclasse` decorator).

Finally, there is an [automapper package](https://pypi.org/project/py-automapper/) that could perform the job in Python. I may look into this later on.

{{< /blockcontainer >}}

I hope you learn a few things here. I know I did.

Feel free to [contact me](../../../page/contact-me/index.md) if you see any error as I’m at the very early stage of my Python journey.

Credit: Photo by [Christina Morillo](https://www.pexels.com/photo/python-book-1181671/).
