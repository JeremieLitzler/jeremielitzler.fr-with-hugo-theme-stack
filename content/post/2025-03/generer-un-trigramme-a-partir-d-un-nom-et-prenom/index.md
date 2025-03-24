---
title: "Générer un trigramme à partir d’un nom et prénom"
description: "Il s'agissait d'un défi de codage intéressant pour un projet de l'année dernière. Comment évaluer le trigramme d'une personne à partir de son nom et prénom ?"
image: 2025-03-24-demonstration-of-a-trigram.jpg
imageAlt: Démonstration d'un trigramme
date: 2025-03-28
categories:
  - Développement logiciel
tags:
  - Python
---

Supposons que vous souhaitiez construire un trigramme à partir du nom et du prénom d’une personne.

Le trigramme peut être égal à la première lettre du prénom et aux deux premières lettres du nom de famille de la personne.

Les caractères du trigramme sont généralement en majuscules.

Par exemple :

- « Jéremie Litzler » donne « JLI »
- « John Doe » donne »JDO »
- Maxime Fèvre » donne »MFE »
- Carlos Di Montis » donne « CDI ».

Examinons le code en Python pour cela.

## Première tentative avec une IA

Aujourd’hui, je vais partager la façon dont l’IA peut accélérer (et où elle montre ses limites) le processus de codage à partir des spécifications ci-dessus.

Il m’a fourni ceci (j’ai édité les commentaires) :

```python
def generate_trigram(full_name):
    # Diviser le nom complet en plusieurs parties
    name_parts = full_name.split()

    # Obtenir la première lettre du prénom
    # `[0]` signifie prendre le premier élément du tableau `name_parts`.
    # `[0]` signifie prendre les premiers caractères de la chaîne de caractères
    firstname_letter = name_parts[0][0]

    # Obtenir les deux premières lettres du nom de famille
    # `[-1]` signifie prendre la dernière partie du tableau `name_parts`.
    # `[:2]` signifie prendre les deux premiers caractères de la chaîne de caractères
    lastname_letters = name_parts[-1][:2]

    # Combiner et capitaliser
    trigram = (firstname_letter + lastname_letters).upper()

    return trigram
```

## Testons ce premier jet

```python
import unittest
from typing import Tuple, List

from app.services.trigram_service import GetTrigramService
from tests.services.common_tests import OnCallAppTestsBase

class TestGetTrigramService(OnCallAppTestsBase):

    def setUp(self):
        super().setUp()

    def test_evaluate_returns_correct_value(self):
        # Le tuple définit :
        # 1- le nom complet à convertir en trigramme
        # 2- le trigramme attendu
        full_names: List[Tuple[str, str]] = [
            ("Jéremie Litzler", "JLI"),
            ("John Doe", "JDO"),
            ("Carlos Di Montis", "CDI"),
            ("Maxime Fèvre", "MFE")
        ]

        for full_name, expected_trigram in full_names:
            trigram = GetTrigramService.evaluate(full_name)
            self.assertTrue(
                trigram == expected_trigram,
                f'actual=<{trigram}> ; expected=<{expected_trigram}>'
            )


if __name__ == "__main__":
    unittest.main()
```

Avez-vous réussi les tests ? Pas moi ! Le code réussit 2 tests sur 4, mais échoue sur « Carlos Di Montis ».

Ne blâmons pas complètement l’IA. La spécification ne mentionnait pas que le prénom vient en premier et que ce qui suit le **premier espace** représente le nom de famille, quel que soit le nombre de parties qu’il contient.

## Qu’est-ce qui ne va pas

Tout d’abord, avec `full_name.split()`, vous obtenez un tableau de 3 chaînes : « Carlos », « Di », « Montis ».

Ensuite, pourquoi prendre le dernier élément du tableau comme nom de famille réel ?

Bien sûr, j’aurais pu écrire des spécifications plus claires, mais c’est ce qu’on appelle de la programmation itérative !

## Corrigeons la spécification et le code

Premièrement, notre nouveau besoin est de prendre les 2 premiers caractères du nom de famille qui peut contenir des espaces. Il faut donc découper le nom complet à partir du premier espace au lieu de « à chaque espace ».

Mais comment résoudre le problème du fractionnement ?

`split` dans Python peut prendre deux arguments : le premier est le délimiteur et le second indique après combien d’occurrences il faut s’arrêter.

Le délimiteur est un espace et nous devons nous arrêter après une occurrence (en supposant que le nom complet exclut les prénoms multiples, bien sûr).

Nous mettons donc à jour la ligne :

```python
name_parts = full_name.split()
```

pour avoir :

```python
name_parts = full_name.split(' ', 1)
# Ci-dessous, nous déstructurons le tableau `name_parts` en variables de chaînes individuelles
first_name, last_name = name_parts
```

Exécutons le test. Et encore une fois, il échoue…

## Quel est le problème suivant ?

Le code n’évalue pas « Maxime Fèvre » en « MFE » mais en « MFV ». Pourquoi ?

L’accent, bien sûr ! Pourquoi ? L’accent a été ignoré, car il s’agit d’un caractère spécial et Python a agit comme s’il n’était pas présent.

Heureusement, il existe une solution à ce problème : nous l’appelons « la normalisation Unicode » et nous disposons de 4 formes. Pour plus de détails, vous pouvez [lire cet article détaillé](https://towardsdatascience.com/difference-between-nfd-nfc-nfkd-and-nfkc-explained-with-python-code-e2631f96ae6c).

Dans notre _Maxime Fèvre_, nous trouvons un accent dans le nom de famille.

Pour l’enlever et garder le « e » non accentué, nous allons utiliser la forme de normalisation _NFKD_ dans le code suivant :

```python
import unicodedata

@staticmethod
def remove_accents(input_str):
  nfkd_form = unicodedata.normalize('NFKD', input_str)
  return ''.join([character for character in nfkd_form if not unicodedata.combining(character)])
```

Cette fonction utilise le module `unicodedata` pour gérer les caractères Unicode. Voici comment elle fonctionne :

1. `unicodedata.normalize('NFKD', input_str)` :
   - Nous utilisons la fonction `normalize` pour convertir la chaîne de caractères en une forme normalisée.
   - « NFKD » signifie « Normalization Form Compatibility Decomposition » (décomposition de la compatibilité de la forme de normalisation).
   - Cette décomposition sépare les caractères de base de leurs marques diacritiques (accents).
   - Par exemple, elle décompose « è » en « e » et la marque d’accentuation.
2. `[character for character in nfkd_form if not unicodedata.combining(character)]` :
   - Il s’agit d’une compréhension de liste qui parcourt chaque caractère de la forme normalisée.
   - `unicodedata.combining(character)` retourne `True` pour les caractères qui sont des marques de combinaison (comme les accents).
   - Le `not` inverse cela, de sorte que nous ne gardons que les caractères qui ne sont pas des marques de combinaison.
3. `''.join([...])` :
   - Cela permet de réunir tous les caractères conservés dans une chaîne de caractères.

En terme non technique, la fonction s’exécute ainsi :

1. Diviser chaque caractère dans sa forme de base, suivi de son accent éventuel.
2. Conserver les caractères de base et exclure le reste.
3. Réunir les caractères restants en une chaîne de caractères.

Par exemple, avec le nom de famille « Fèvre » :

1. Il est normalisé à quelque chose comme `['F', 'e', '`«, « v », « r », « e »]`
2. L'accent « ` » est supprimé, car il s’agit d’un caractère de combinaison.
3. Les caractères restants sont à nouveau réunis en une chaîne de caractères, ce qui donne « Fevre »

Cette méthode est particulièrement efficace, car elle fonctionne pour de nombreux caractères accentués et autres signes diacritiques dans de nombreuses langues, et pas seulement pour les accents français.

Vous pouvez maintenant l’utiliser dans la méthode évaluée :

```python
first_letter = GetTrigramService.remove_accents(first_name[0])
last_name_letters = GetTrigramService.remove_accents(last_name[:2])
```

Hourra ! Le test est réussi. 🎇

## Solution finale (Ne trichez pas en cliquant sur la table des matières pour aller plus vite !)

Alors, mettons cela dans un service:

```css
class GetTrigramService:
    @staticmethod
    def evaluate(full_name) -> str:
        # Split the full name into parts
        name_parts = full_name.split(" ", 1)

        # If there's only one part (i.e., no space in the name), return None or handle as needed
        if len(name_parts) < 2:
            return None  # or handle this case as appropriate for your use case

        first_name, last_name = name_parts

        # Get the first letter of the first name
        first_letter = GetTrigramService.remove_accents(first_name[0])

        # Get the first two letters of the last name
        last_name_letters = GetTrigramService.remove_accents(last_name[:2])

        # Combine and capitalize
        trigram = (first_letter + last_name_letters).upper()

        return trigram

    @staticmethod
    def remove_accents(input_str):
        nfkd_form = unicodedata.normalize('NFKD', input_str)
        return ''.join([character for character in nfkd_form if not unicodedata.combining(character)])
```

## Conclusion

OK, j’ai des leçons à partager :

- Premièrement : ne faites pas confiance à l’IA du premier coup. Il faut toujours revoir le code ou votre spécification.
- Deuxièmement : testez toujours le code et trouvez les cas limites **vous-mêmes** 😊.

Oui, vous devrez réfléchir pour coder une solution complète. L’IA n’a pas deviné la subtilité sur le nom de famille ou la question des accents.

Vous pouvez le faire parce que vous choisissez de bons ensembles de tests et, en fin de compte, de bons tests fourniront une solution complète. Qui a dit que l’IA remplacerait les ingénieurs en informatique ? 😋

Et attention aux accents en général !

{{< blockcontainer jli-notice-tip "Suivez-moi !">}}

Merci d’avoir lu cet article. Assurez-vous de [me suivre sur X](https://x.com/LitzlerJeremie), de [vous abonner à ma publication Substack](https://iamjeremie.substack.com/) et d’ajouter mon blog à vos favoris pour ne pas manquer les prochains articles.

{{< /blockcontainer >}}
