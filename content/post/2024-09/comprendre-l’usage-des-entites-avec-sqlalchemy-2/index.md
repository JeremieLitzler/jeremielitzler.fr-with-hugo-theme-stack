---
title: "Comprendre l’usage des entités avec SQLAlchemy 2.0"
description: "J’ai rencontré un petit problème en essayant de diviser mes modèles de base de données en fichiers séparés sur une API REST en utilisant Python et SQLAlchemy. Passons en revue le problème et sa solution."
image: images/2024-07-30-a-green-bug.jpg
imageAlt: "Un insecte vert"
date: 2024-09-18
categories:
  - Développement Web
tags:
  - Python
---

## Le contexte

Il y a quelques mois, je travaillais sur une simple API REST pour acquérir les compétences de développement backend avec Python, Flask 3 et SQL Alchemy 2.

L’application que je construisais était un petit outil pour enregistrer le temps passé sur divers projets et tâches.

J’avais 3 modèles (sans compter le modèle de base) :

- le modèle `Project`
- le modèle `Task`
- le modèle `TimeRecord`

Lorsque j’ai commencé à coder l’API, j’ai défini les modèles dans un fichier unique `models.py` que j’importais dans un fichier `main.py` où j’avais ceci :

```python
import os
from sqlalchemy import create_engine
from dao.models import Model

def init_engine(base_dir: str):
    """Load the engine

    Args:
        base_dir (str): The base directory where the database is stored

    Returns:
        object: The engine
    """
    db_file_name = f"sqlite:///{base_dir}{os.sep}..{os.sep}db{os.sep}sqlalchemy.db"
    engine = create_engine(db_file_name, echo=True)
    return engine

def reset_database(base_dir: str):
    """Reset the database by dropping all tables

    Args:
        base_dir (str): The base directory where the database is stored
    """
    Model.metadata.drop_all(init_engine(base_dir))

def init_database(base_dir: str):
    """Initialize the database by creating the tables that needs to be created.
    It doesn't try to recreate what already exists.

    See https://docs.sqlalchemy.org/en/20/core/metadata.html#sqlalchemy.schema.MetaData.create_all

    Args:
        base_dir (str): _description_
    """
    Model.metadata.create_all(init_engine(base_dir))

```

Dans le `app.py`, j’ai défini une logique simple pour réinitialiser la base de données en développement lors du démarrage du serveur :

```python
import os

from flask import Flask
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, scoped_session
from dotenv import load_dotenv

from constants.environment_vars import EnvironmentVariable

# from dal.main import init_engine
from dal.main import init_database, reset_database, init_engine

load_dotenv()

env = os.getenv(EnvironmentVariable.ENVIRONMENT)

# Create the Flask application instance
app = Flask(__name__)
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Create the database engine (dependency injection)
app.config[EnvironmentVariable.DATABASE_ENGINE] = init_engine(BASE_DIR)
# Create a session maker using the injected engine
SessionLocal = scoped_session(
    sessionmaker(
        autocommit=False,
        autoflush=False,
        bind=app.config[EnvironmentVariable.DATABASE_ENGINE],
    )
)
app.config[EnvironmentVariable.SESSION_LOCAL] = SessionLocal

if env == "dev":
    print("Environment is dev")
    # TODO: drop the database
    print("drop database...")
    reset_database(BASE_DIR)
    print("dropped database!")
    # TODO: and recreate it
    print("create database...")
    init_database(BASE_DIR)
    print("created database!")

if env == "production":
    print("Environment is production")
    # TODO: create
    print("create database...")
    init_database(BASE_DIR)
    print("created database!")
```

## Le problème

Une fois que j’eus terminé les points de terminaison de l’API `Project` , je suis passé à ceux de l’API `Task` et j’ai voulu diviser les modèles en fichiers individuels.

```plaintext
|__ dao/models
    |__ base_model.py
    |__ project_model.py
    |__ task_model.py
    |__ time_record_model.py
```

Bien que cela n’ait pas empêché d’ajouter des projets après avoir mis à jour les importations, cela a cassé la réinitialisation de la base de données…

Lorsque j’exécutais la requête de création d’un projet juste après avoir redémarré le serveur, j’ai remarqué l’erreur concernant la contrainte unique du nom du projet.

Ensuite, j’ai remarqué qu’après le dernier redémarrage du serveur, le terminal ne traçait pas le code SQL habituel exécuté par SQLAlchemy lors de l’initialisation de la base de données après le redémarrage.

## Pourquoi

En Python, un fichier correspond à un module. Ainsi, l’import dans le code de `main.py` ci-dessus est devenu :

```python
from dao.models.base_model import Model
```

Sauf que seul `Model` est chargé et même en ajoutant les imports pour les entités `Project`, `Task` et `Timerecord`, `Model.metadata.drop_all()` n’exécutait rien…

## Comment utiliser des fichiers fractionnés et conserver les fonctionnalités ?

Ne le faites simplement pas.

Je pense que c’est une habitude de développer en .NET depuis 15 ans. Mais en programmation Python, et si vous utilisez l’ORM SQLAlchemy, gardez le schéma de la base de données dans un seul fichier appelé `database.py` ou `entities.py` ou ce que vous voulez.

De plus, une autre limitation au fractionnement des fichiers est que l’utilisation de la fonctionnalité ORM qui permet de récupérer des éléments liés dans une relation entre deux modèles vous remontera quelques problèmes.

Pour en savoir plus sur Python, [naviguer vers le tag](../../../tags/python).

{{< blockcontainer jli-notice-tip "Suivez-moi !">}}

Merci d’avoir lu cet article. Assurez-vous de [me suivre sur X](https://x.com/LitzlerJeremie), de [vous abonner à ma publication Substack](https://iamjeremie.substack.com/) et d’ajouter mon blog à vos favoris pour ne pas manquer les prochains articles.

{{< /blockcontainer >}}

Crédit : Photo par [Pixabay](https://www.pexels.com/photo/green-black-and-brown-insect-40875/).
