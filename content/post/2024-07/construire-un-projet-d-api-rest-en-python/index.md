---
title: "Construire un projet d'API REST en Python"
description: "Dans ce guide, je vais vous détailler les étapes pour démarrer avec Python et Flask afin de construire une API REST de type hello world. C'était ma première expérience."
image: images/2024-07-15-someone-holding-a-post-it-with-python-written-on-it.jpg
imageAlt: "Quelqu'un tenant un post-it avec Python écrit dessus"
date: 2024-07-15
categories:
  - Développement Web
tags:
  - Python
draft: true
---

Je n'avais aucune expérience de l'utilisation de Python auparavant. J'ai donc utilisé Gemini AI pour m'aider à démarrer.

{{< blockcontainer jli-notice-warning "About using AI">}}

Bien que cela ait été utile, il est bon de vérifier les faits et de demander la validation d'un développeur plus expérimenté.

{{< /blockcontainer >}}

## Prérequis

Vous devez comprendre ce qu'est une API REST.

Tout d'abord, **REST, ou Representational State Transfer, est un** style d'architecture logicielle permettant de créer des services web faciles à développer et à intégrer.

Ensuite, une API REST **expose des ressources** qui représentent des données ou des fonctionnalités (par exemple, des utilisateurs, des produits, des commandes).

Elle utilise généralement plusieurs **méthodes HTTP** pour définir les actions sur les ressources (GET, POST, PUT, DELETE pour récupérer, créer, mettre à jour et supprimer des données).

En 2024, le format de données le plus couramment utilisé pour l'échange de données entre les clients et les serveurs est JSON, bien que vous puissiez encore trouver XML dans les services web hérités ou dans des intégrations spécifiques avec des tiers qui attendent toujours XML.

## Choisir un cadre Web

Flask fournit tous les outils nécessaires pour commencer, car il est décrit comme léger et flexible, idéal pour les petits projets.

Vous pouvez également utiliser Django, mais nous l'utilisons généralement pour construire des applications Web MVC, avec le frontend inclus.

Enfin, vous pouvez utiliser FastAPI si vous avez besoin de hautes performances, d'une validation automatique des données et de principes de conception modernes.

Lorsque vous faites votre choix, prenez en compte des facteurs tels que la taille du projet, sa complexité et votre familiarité avec chaque framework.

J'ai choisi :

- `advanced-new-file` : pour utiliser `CTRL+ALT+N` pour créer un nouveau fichier rapidement sans aller dans la _Vue d'exploration_.
- `Python Extension Pack` : pour installer un ensemble d'extensions recommandées.
  - Désinstallez `IntelliCode`, `Dlango` et `Jinja` car vous n'en avez pas besoin.
- `Python Debugger` : pour déboguer facilement vos applications Python.
- `REST Client` : pour tester vos points de terminaison en utilisant un simple fichier `.http` ou `.rest`.
- `Todo Tree` : pour garder une trace des sections de code qui ont besoin d'être travaillées.
- `Black Formatter` : pour formater votre code.

  - Activez-le en utilisant `CTRL+SHIFT+P`
  - Tapez _Configure Language Specific Settings_ pour filtrer et sélectionnez _Python_.
  - Dans l'onglet ouvert, filtrez les paramètres avec _format_,
  - Assurez-vous

    - de sélectionner le `formateur par défaut` comme _formateur noir_ pour Python
    - de cocher _Format on save_ dans les paramètres.
    - Sinon, copiez et collez ce qui suit dans votre fichier `settings.json` :

      ```json
        "[python]" : {
          "editor.defaultFormatter" : "ms-python.black-formatter",
          "editor.formatOnSave" : true
        }
      ```

{{< blockcontainer jli-notice-note "About PyCharm">}}

Cette note a été ajoutée 2 mois après que j'ai écrit le contenu original de cet article.

J'ai une nouvelle opportunité de coder une API Web avec Python avec un collègue et cette fois, il m'a encouragé à utiliser PyCharm ([disponible comme portable à travers Scoop.sh](https://scoop.sh/#/apps?q=pycharm)).

Je trouve qu'il est beaucoup plus rapide de commencer à développer. J'ai quand même dû configurer les key maps pour qu'elles correspondent à Visual Studio Code (je n'ai pas le temps de réapprendre tous les raccourcis...) et comprendre quelques trucs dans le nouvel IDE.

{{< /blockcontainer >}}

## Créer un nouveau dépôt

La première étape pour initialiser un projet Flask est de **créer un nouveau projet.**

Commençons par créer un nouveau dépôt Git sur GitHub ou sur votre système de contrôle de version préféré.

Assurez-vous de sélectionner `Python` pour le modèle `.gitignore`.

Ouvrez Visual et clonez votre dépôt.

## Créer un environnement virtuel

Ensuite, avant de coder quoi que ce soit, vous devez créer un environnement virtuel.

Un environnement virtuel permet d'isoler les dépendances du projet et d'éviter les conflits avec d'autres installations ou bibliothèques Python sur votre système. C'est une bonne pratique d'utiliser des environnements virtuels pour gérer les dépendances dans les projets Flask.

Si vous exécutez la commande suivante, vous obtiendrez l'environnement du système et la version de Python installée sur votre système :

``bash
which python

```

Dans mon cas, puisque j'utilise [Scoop.sh](http://Scoop.sh), la commande affiche le résultat :

``bash
/c/Users/jlitzler/scoop/apps/python/current/python
```

Voici comment en créer un (choisissez la méthode qui vous convient) :

```bash
# Remplacez "venv" par le nom de l'environnement virtuel souhaité.
python3 -m venv venv
# Activer l'environnement virtuel
source venv/Scripts/activate
```

Maintenant, la version de python provient de l'environnement propre à votre projet :

```bash
which python
# Vous donne : /c/Git/<your-project-name>/venv/Scripts/python
```

## Installer Flask

Exécutez la commande dans votre terminal :

``bash
pip install Flask

```

Vous devrez _freeze_ vos dépendances en utilisant la commande _pip_ et exporter le résultat dans `requirements.txt` :

``bash
pip freeze > requirements.txt
```

Lorsque vous clonerez une nouvelle copie de votre référentiel, vous lancerez simplement la commande install en utilisant le contenu de `requirements.txt` pour installer les dépendances :

``bash
pip install -r requirements.txt

```

{{< blockcontainer jli-notice-warning "">}}}

⚠️ Assurez-vous de lancer la commande freeze pour sauvegarder les nouvelles dépendances que vous installez.

{{< /blockcontainer >}}

## Créer une API de base

J'ai utilisé la structure de fichier suivante :

- créer un fichier `app.py`
- créer un fichier `api.py`
- créer un fichier `controllers/api-hello-world.py`

### Dans `app.py`

Parce que nous organisons souvent notre code API dans des contrôleurs, nous allons créer l'instance de l'application Flask dans un fichier qui ne fait rien d'autre. Cela évitera les instances Flask multiples et les bugs.

``python
from flask import Flask
app = Flask(__name__)
```

### Dans `contrôleurs/api_hello_world.py`

```python
from flask import request, jsonify
from app import app

import json

@app.route("/api/v1.0/hello/<string:gretting>", methods=["GET"])
def api_hello_say_something(greeting):
    return jsonify({"message": f"Hello {message}", "method": f"{request.method}"})

@app.route("/api/v1.0/hello", methods=["POST"])
def api_hello_say_something():
		data = data = request.get_json()
    return jsonify({"message": f"Hello {data.get('greeting')}", "method": f"{request.method}"})
```

### Dans `api.py`

```python
from app import app
# importer et enregistrer les routes du contrôleur
from controllers.api_hello_world import *

if __name__ == '__main__':
    app.run(debug=True)
```

## Testez votre API _hello world_.

Vous n'avez pas besoin d'un Postman : en utilisant l'extension `REST Client`, vous lancez une requête pour chaque endpoint de l'API :

- créez un fichier `request-api-hello-world.rest` et collez ce qui suit :

```rest
###
GET http://127.0.0.1:5000/api/v1.0/hello/Jeremie HTTP/1.1
content-type: application/json

###
POST http://127.0.0.1:5000/api/v1.0/hello HTTP/1.1
Content-Type: application/json

{
  "greeting": "Jeremie"
}
```

- Ouvrez `api.py` et sélectionnez `Start debugging` dans le menu `Run` ou pressez `F5`.
- Exécutez chaque requête dans le fichier `request-api-hello-world.rest` en cliquant sur _Send Request_ qui apparaît sous le `###`. Vous devriez obtenir un `HTTP 200` avec les données JSON attendues.

Je poursuivrai bientôt cette série avec l'implémentation d'une API REST plus complexe. Elle montrera comment utiliser une bibliothèque de type ORM appelée _SQLAlchemy_ et Swagger pour la documentation de l'API.

A suivre !

Crédit : Photo de [Hitesh Choudhary](https://unsplash.com/@hiteshchoudhary?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash) sur [Unsplash](https://unsplash.com/photos/person-holding-sticky-note-D9Zow2REm8U?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash).
.
