---
title: "Réflexion sur les attributs de classe en Python"
description: "Je dois admettre qu’au moment où j’écris ces lignes, je commence tout juste à coder avec Python. Pourtant, je voulais appliquer un code propre tel que je l’ai appris."
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

L’application est organisée en projets. Les projets définissent des tâches et chaque fois que je travaille sur une tâche, j’enregistre le temps passé.

C’est simple, n’est-ce pas ?

## Mon cas d’utilisation

Je vais sauter au moment où je voulais sauvegarder un projet dans une base de données SQL Lite et lire un projet par son identifiant ou la liste des projets dans la base de données.

J’ai utilisé Gemini jusqu’au bout pour coder le squelette de l’API.

{{< blockcontainer jli-notice-note "A propos de l'IA pour apprendre à coder...">}}

L’IA se révèle utile et peut vous aider, mais à la fin, la solution finale est votre responsabilité.

Aussi, vous aurez besoin de connaitre les bases du langage de programmation.

Si vous commencez par des questions fondamentales, vous comprendrez mieux comment formuler les questions plus complexes par la suite.

{{< /blockcontainer >}}

Lorsque j’ai dû implémenter la méthode `get_project`, l’IA a donné ceci :

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

Je n’aimais pas l’extraction des données de l’enregistrement `project_data` basée sur l’index du `dict`.

J’ai donc demandé comment rendre le code plus générique afin qu’il utilise les attributs de la classe DTO pour construire la réponse.

L’IA m’a suggéré deux approches :

**1. Utilisation de `namedtuples`:** il a expliqué que « Cette approche permet d’accéder aux données de manière plus lisible en utilisant des champs nommés au lieu d’index numériques ».

**2. Utilisation d’un dictionnaire de compréhension:** il a expliqué que « Cette approche offre une manière plus concise de convertir les données en un dictionnaire, en particulier si vous devez gérer des noms de colonnes dynamiques. » »

J’ai opté pour la méthode des namedtuples et le code ressemblait à ceci :

```python
from collections import namedtuple

ProjectRecord = namedtuple('ProjectRecord', ['id', 'name', 'color', 'isArchived'])

def get_project(project_id: str) -> Optional[ProjectRecord]:
  # ... (même connexion et logique de curseur)

  cursor.execute('''SELECT id, name, color, isArchived FROM projects WHERE id = ?''', (project_id,))
  project_data = cursor.fetchone()

  conn.close()

  if project_data:
    return ProjectRecord(*project_data)  # Déstruturer les données en utilisant l'opérateur *
  else:
    return None

```

Bien qu’elle ait lu correctement la base de données et ait renvoyé les données, l’API a répondu un tableau de valeurs au lieu d’un objet :

```json
["6964ba78-8dc4-4f23-b525-a0d9fbab865c", "New Project", "#000000", 0]
```

J’avais besoin que le résultat soit :

```json
{
  "id": "6964ba78-8dc4-4f23-b525-a0d9fbab865c",
  "name": "New Project",
  "color": "#000000",
  "isArchived": false
}
```

Après quelques affinements, l’IA m’a donné la méthode `_asdict` disponible pour des namedtuples. Elle crée un dictionnaire dont les clés correspondent aux champs nommés.

Le code final du contrôleur de l’API ressemblait donc à ceci :

```python
@app.route('/api/v1.0/project/<string:id>', methods=['GET'])
def api_project_get(id: int):
  project = get_project(id)
  if project:
    return jsonify(project._asdict())
  else:
    return jsonify({'error': 'Project not found'}), 404
```

## Plus de réutilisation

J’ai voulu aller plus loin dans la réutilisation.

L’IA a donné le code suivant comme point de départ :

```python
def get_namedtuple_from_type(cls):
  """
  Crée un type de namedtuple basé sur les attributs publics d'une classe.

  Args:
      cls (class): La classe à utiliser pour générer le type namedtuple.

  Returns:
      namedtuple: Un type namedtuple dont les champs correspondent aux attributs publics de la classe.
  """
  field_names = [attr for attr, value in getmembers(cls) if not callable(value)]
  tuple = namedtuple(cls.__name__, field_names)
  return tuple
```

PS : j’ai renommé le nom de la méthode et la valeur retournée pour qu’ils soient plus génériques.

Malheureusement, cela n’a pas fonctionné. Même si j’ai essayé quelques autres suggestions, l’IA n’a pas réussi à me donner une solution qui fonctionne.

J’ai donc effectué une recherche sur Google et j’ai compris quelque chose.

Lors de l’étape d’initialisation de l’API, l’IA m’a suggéré d’utiliser une classe pour définir un projet.

L’IA m’a donné ceci :

```python
class ProjectData:
  def __init__(self, name: str, color: str, isArchived: bool = False):
    self.id = None  # `id` sera attribué lors de la création du projet
    self.name = name
    self.color = color
    self.isArchived = isArchived

```

A ce moment, j’ai réalisé que les attributs de `ProjectDto` n’étaient pas `id`, `name`, `color` et `isArchived`... Je ne pouvais donc pas obtenir `['id', 'name', 'color', 'isArchived']`...

J’ai donc ajouté les attributs de classe en amont du constructeur :

```python
class ProjectData:
  id: str | None
  name: str
  color: str
  isArchived: bool
```

Avec un peu de débogage, j’ai vu que pour obtenir les attributs, je devais faire ce qui suit :

```python
def get_tuple_from_type(cls):
  # La ligne ci-dessous instancie un objet factice pour filtrer tous les membres par défaut d'une instance d'objet.
  boring = dir(type('dummy', (object,), {}))
  cls_extract = [item
            for item in getmembers(cls)
            if item[0] not in boring]
  # Il ne me restait qu'un élément dans cls_extract = ['__annotations__'].
  # Il n'y a pas de raison que je n'obtienne pas au moins un élément dans cls_extract
  if cls_extract.__len__ == 0:
    raise TypeError('(Lvl1) The class has no attribute defined. Cannot use "get_tuple_from_type".')
  if cls_extract[0].__len__ == 0:
    raise TypeError('(Lvl2) The class has no attribute defined since "__annotations__" wasn´t found. Cannot use "get_tuple_from_type".')
  # Cela permet de s'assurer que j'obtiens une erreur d'exécution au cas où la classe Dto ne déclarerait pas d'attributs.
  if cls_extract[0][0] != '__annotations__':
    raise TypeError('The class has no attribute defined since "__annotations__" wasn´t found. Cannot use "get_tuple_from_type".')

  # Le premier élément de cls_extract est un tableau lui-même où :
  # - index=0 équivaut à un tableau
  # - index=1 équivaut à un objet avec les attributs du type cls
  # Ainsi, ci-dessous, je récupère les clés de l'objet
  raw_field_names = cls_extract[0][1].keys()
  # puis le convertir en un tableau de chaînes de caractères.
  field_names = list(raw_field_names)
  # Enfin, nous avons le namedtuple !
  return namedtuple(cls.__name__, field_names)

```

Ainsi, ma méthode `get_project` est devenue la suivante :

```python
from dto.ProjectData import ProjectDto

def get_project(project_id: str) -> ProjectDto:
  try:
    conn = sqlite3.connect(f'db{os.sep}database_sqllite3.db')
    cursor = conn.cursor()
    cursor.execute('''SELECT id, name, color, isArchived FROM projects WHERE id = ?''', (project_id,))
    project_data = cursor.fetchone()
    ProjectRecord = get_tuple_from_type(ProjectDto)  # Obtenir dynamiquement le type de namedtuple

    if project_data:
      return ProjectRecord(*project_data)
    else:
      return None

  finally:
    conn.close()

```

Grâce à cette approche, le `get_projects` était très simple à écrire. Je pouvais donc réutiliser `get_tuple_from_type` et retourner la liste des projets :

```python
def get_projects() -> list[ProjectDto]:
  try:
    conn = sqlite3.connect(f'db{os.sep}database_sqllite3.db')
    cursor = conn.cursor()

    cursor.execute('''SELECT id, name, color, isArchived FROM projects''')
    project_data = cursor.fetchall()

    ProjectRecord = get_tuple_from_type(ProjectDto)

    projects = []
    for row in project_data:
      projects.append(ProjectRecord(*row))
    return projects
  finally:
    conn.close()
```

## Conclusion

Bien que l’IA m’ait aidé à structurer l’API, vous devez toujours penser par vous-mêmes et faire vos recherches !

{{< blockcontainer jli-notice-note "A propos de la solution que j'ai codée et partagée ici." >}}

J’apprends encore Python et depuis que j’ai écrit ce qui précède, un collègue plus expérimenté m’a dit que l’utilisation des méthodes et membres privés, comme `_asdict()` `__len__` ou `__name__`, n’est pas recommandé.

Toutes les classes DTO devraient être des classes de données (en utilisant le décorateur `@dataclasse`).

Enfin, il existe un package [`py-automapper`] (https://pypi.org/project/py-automapper/) qui pourrait faire le travail en Python. J’y jetterai peut-être un coup d’œil plus tard.

{{< /blockcontainer >}}

J’espère que vous avez appris des choses ici. Je sais que cela a été le cas pour moi.

N’hésitez pas à me [contacter](../../../page/contactez-moi/index.md) si vous voyez une erreur, car je n’en suis qu’au tout début de mon parcours en Python.

Crédit : Photo par [Christina Morillo](https://www.pexels.com/photo/python-book-1181671/).
