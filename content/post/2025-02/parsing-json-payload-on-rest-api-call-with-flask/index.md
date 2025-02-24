---
title: "Analyse des données JSON sur un appel à une API REST avec Flask"
description: "Il s’agit d’un besoin fondamental et relativement simple. Mais est-il possible de le maintenir ?"
image: 2024-07-15-someone-holding-a-post-it-with-python-written-on-it.jpg
imageAlt: "Une personne tenant un post-it avec “Python” écrit dessus"
date: 2025-02-28
categories:
  - Développement Web
tags:
  - Python
  - Flask
---

En juillet 2024, j’ai commencé à apprendre la programmation Python à travers un projet concret.

L’objectif était de construire une API REST et le cas d’utilisation le plus courant est de construire une fonctionnalité CRUD avec un échange JSON.

Comment une application Python utilisant Flask gère-t-elle les requêtes avec des données JSON et comment les analyser ?

C’est l’objectif de cet article.

## Analyse des données d’entrée d’une requête avec Flask

Pour lire le contenu d’une requête `POST` dans Flask (la version 3 s’applique dans l’exemple ci-dessous), vous pouvez utiliser la méthode `request.get_json()`. Voici un exemple de base :

```python
from flask import Flask, request

app = Flask(__name__)

@app.route('/endpoint', methods=['POST'])
def handle_post():
    data = request.get_json()
    return {"message": "Data received", "data": data}

if __name__ == '__main__':
    app.run(debug=True)

```

Le code effectue les opérations suivantes:

1. Il importe les modules nécessaires.
2. Il crée une application Flask.
3. Il définit une route qui accepte les requêtes POST.
4. Il utilise `request.get_json()` pour analyser la charge utile JSON.
5. Il renvoyer une réponse avec les données reçues.

Quelques points importants :

- Assurez-vous que le client envoie les données avec le bon en-tête `Content-Type` (généralement `application/json`).
- Si les données ne sont pas au format JSON, vous devrez peut-être utiliser `request.data` ou `request.form` en fonction du type de contenu.
- Pour les données de formulaire, utilisez `request.form` pour accéder aux champs de formulaire.
- Pour les données brutes, utilisez `request.data` pour obtenir la chaîne d’octets.

## Le type de données renvoyé par `get_json()`

La méthode `request.get_json()` de Flask renvoie un dictionnaire Python (ou liste de paires clé/valeur) contenant les données JSON analysées dans le corps de la requête. Voici quelques points clés de son fonctionnement :

1. Si la requête contient des données JSON valides, elle renvoie l’objet Python analysé.
2. Si vous fournissez un corps de requête vide, il retourne `None` par défaut.
3. Si vous fournissez des données JSON invalides, il lève une exception `werkzeug.exceptions.BadRequest`.
4. Il peut gérer des structures imbriquées, convertissant les objets JSON en dictionnaires Python et les tableaux JSON en listes Python.
5. La méthode a des paramètres optionnels :
   - `force` : Si elle vaut `True`, elle essaiera d’analyser les données en tant que JSON même si le `mime-type` n’est pas `application/json`.
   - `silent` : Si `True`, il retournera `None` au lieu de lever une exception pour JSON invalide.

Voici un exemple simple pour illustrer :

```python
@app.route('/example', methods=['POST'])
def example():
    data = request.get_json()
    if data is None:
        return "No JSON received", 400
    return f"Received: {data}", 200

```

Dans cet exemple, si vous envoyez une requête POST avec le JSON suivant `{"name" : "Alice", "age" : 30}`, la variable `data` contiendra le dictionnaire Python `{'name' : 'Alice', 'age' : 30}`.

## Comment analyser la charge utile JSON vers une classe DTO

Il existe plusieurs méthodes :

### Avec une bibliothèque

Pour analyser la charge utile JSON en une classe DTO (« Data Transfer Object ») dans Flask, vous pouvez utiliser une bibliothèque comme Pydantic ou Marshmallow. Je vais vous montrer comment le faire en utilisant Pydantic, qui convient particulièrement à cette tâche en raison de sa simplicité et de son intégration avec les indices de type.

Voici un exemple étape par étape :

1. Tout d’abord, installez Pydantic :

   ```bash
   pip install pydantic
   ```

2. Définissez votre classe DTO en utilisant Pydantic :

   ```python
   from pydantic import BaseModel

   class UserDTO(BaseModel):
       name: str
       age: int
       email: str | None = None  # champ optionnel

   ```

3. Utilisez ce DTO dans votre route Flask :

```python
from flask import Flask, request
from pydantic import ValidationError

app = Flask(__name__)

@app.route('/user', methods=['POST'])
def create_user():
    try:
        user_data = request.get_json()
        user = UserDTO(**user_data)
        # Maintenant vous pouvez utiliser user.name, user.age, user.email
        return {"message": "User created", "user": user.model_dump()}, 201
    except ValidationError as e:
        return {"errors": e.errors()}, 400

if __name__ == '__main__':
    app.run(debug=True)

```

Ce code permet d’effectuer les opérations suivantes :

1. Il définit une classe `UserDTO` qui hérite du `BaseModel` de Pydantic.
2. Il récupère les données JSON en utilisant `request.get_json()`.
3. Il crée une instance `UserDTO` en analysant les données JSON dans le constructeur.
4. Si les données sont valides, il renvoie un message de succès avec les données de l’utilisateur.
5. Si les données ne sont pas valides (par exemple, champs obligatoires manquants ou mauvais types), il attrape le `ValidationError` et renvoie les erreurs de validation.

Vous pouvez également ajouter une validation plus complexe ou des valeurs par défaut à votre DTO :

```python
from pydantic import BaseModel, EmailStr, Field

class UserDTO(BaseModel):
    # The "..." is used to omit unwritten code
    name: str = Field(..., min_length=2, max_length=50)
    age: int = Field(..., ge=0, le=120)
    email: EmailStr | None = None
```

Cette méthode ajoute la validation de la longueur du nom, la validation de l’intervalle de l’âge, et utilise `EmailStr` pour la validation de l’email.

Je peux vous dire que c’est attrayant quand vous verrez la méthode suivante et que vous pensez à la maintenabilité de votre code…

### Sans bibliothèque

Vous pouvez analyser des données JSON dans une classe DTO en utilisant les fonctionnalités intégrées de Python. Voici comment procéder :

1. Tout d’abord, définissez votre classe DTO :

   ```python
   class UserDTO:
       def __init__(self, name: str, age: int, email: str | None = None):
           self.name = name
           self.age = age
           self.email = email

       # Lit les données JSON et assigne les propriétés de la classe
       @classmethod
       def from_dict(cls, data: dict):
           return cls(
               name=data.get('name'),
               age=data.get('age'),
               email=data.get('email')
           )

       # Transforme une instance de la classe en dictionnaire avec la structure JSON appropriée
       def to_dict(self):
           return {
               'name': self.name,
               'age': self.age,
               'email': self.email
           }

   ```

2. Maintenant, utilisez ce DTO dans votre route Flask :

   ```python
   from flask import Flask, request, jsonify

   app = Flask(__name__)

   @app.route('/user', methods=['POST'])
   def create_user():
       user_data = request.get_json()

       if not user_data:
           return jsonify({"error": "No data provided"}), 400

       try:
           user = UserDTO.from_dict(user_data)

           # Exécutons une validation simple
           if not user.name or not isinstance(user.name, str):
               raise ValueError("Invalid name")
           if not isinstance(user.age, int) or user.age < 0:
               raise ValueError("Invalid age")
           if user.email is not None and not isinstance(user.email, str):
               raise ValueError("Invalid email")

           # Sauvegardons les données...

           # Retournons la réponse
           return jsonify({"message": "User created", "user": user.to_dict()}), 201

       except ValueError as e:
           return jsonify({"error": str(e)}), 400

   if __name__ == '__main__':
       app.run(debug=True)
   ```

Voici l’explication, étape par étape, du code ci-dessus :

1. Il définit une classe `UserDTO` avec un constructeur et des méthodes pour créer une instance à partir d’un dictionnaire (`from_dict`) et pour convertir une instance en dictionnaire (`to_dict`).
2. Il obtient les données JSON en utilisant `request.get_json()`.
3. Il crée une instance `UserDTO` en utilisant la méthode de la classe `from_dict`.
4. Il effectue une validation de base plutôt manuelle. Vous pouvez ajouter une validation plus complexe si nécessaire.
5. Si les données sont valides, il renvoie un message de succès avec les données de l’utilisateur.
6. Si les données ne sont pas valides, il attrape le `ValueError` et renvoie un message d’erreur.

Cette méthode nécessite plus de codage manuel que l’utilisation de Pydantic, en particulier pour la validation.

Cependant, elle vous donne un contrôle total sur le processus et ne nécessite pas de bibliothèques supplémentaires.

## Conclusion

Gardez à l’esprit que cette introduction rapide ne couvre pas tous les cas de figure, mais c’est ainsi que j’ai commencé à coder mon API REST avec Python l’année dernière. Pour un environnement de production, vous voudrez peut-être ajouter une gestion des erreurs et une validation plus robustes.

Est-ce que cela peut être maintenu sur de grandes applications ? Peut-être pas… J’en reparlerai au fur et à mesure que j’avancerai dans la programmation Python.

En attendant, pour en savoir plus sur Python, utilisez le tag en bas de page pour lire mes autres articles ⬇️

{{< blockcontainer jli-notice-tip "Suivez-moi !">}}

Merci d’avoir lu cet article. Assurez-vous de [me suivre sur X](https://x.com/LitzlerJeremie), de [vous abonner à ma publication Substack](https://iamjeremie.substack.com/) et d’ajouter mon blog à vos favoris pour ne pas manquer les prochains articles.

{{< /blockcontainer >}}

<!-- more -->
