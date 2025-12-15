---
title: "Lecture de fichiers en Python contenant des caractères non ASCII"
description: "L'encodage est important pour l'utilisateur final. En tant que francophone, j'aime voir les accents correctement affichés sur une page."
image: 2025-12-15-a-man-with-a-magnifying-glass-decyphering-symbols.jpg
imageAlt: Un homme avec une loupe déchiffrant des symboles
date: 2025-12-19
categories:
  - Développement logiciel
tags:
  - Python
---

Le rendu des caractères non ASCII est crucial lorsque le contenu textuel d’un fichier contient des caractères non ASCII. En français, on trouve souvent des caractères accentués comme « é », « è » ou « à ». Mais ce n’est pas toute la liste.

Voyons comment lire le contenu d’un fichier UTF-8 et afficher correctement les accents dans un modèle Jinja.

## Lecture du fichier

Prenons un fichier JSON encodé en UTF-8.

En Python, vous lisez le fichier de la manière suivante :

```python
    def fetch_data(self) -> Optional[List[Dict]]:
        try:
            with open(self.file_path, 'r') as file:
                data = json.load(file)
                return data
        except FileNotFoundError:
            raise FileNotFoundError(f"File not found: {self.file_path}")
        except json.JSONDecodeError:
            raise ValueError(f"Error decoding JSON from file: {self.file_path}")

```

Lorsque le contenu est lu, s’il contient des caractères non ASCII, tels que « é », « è » ou « à », vous devriez voir des caractères mal encodés.

## Comment résoudre le problème

Il suffit d’ajouter un paramètre à la méthode `open` :

```python
with open(self.file_path, 'r', encoding='utf-8') as file:
```

Avec le paramètre `encoding`, Python lit le contenu avec le codage approprié.

**Remarque** : si le fichier JSON comporte une marque d’ordre des octets (BOM), vous devrez peut-être utiliser `encoding='utf-8-sig'` pour le lire correctement. Cependant, si vous devez vraiment modifier le fichier, utilisez un éditeur capable de produire un contenu UTF-8 valide.

## À propos du modèle Jinja

Les modèles Jinja2 attendent des chaînes Unicode. Si les données transmises au modèle contiennent des chaînes d’octets ou des chaînes mal encodées, les caractères spéciaux risquent de ne pas s’afficher correctement.

Grâce à la correction ci-dessus, le contenu affiché s’affiche correctement pour l’utilisateur.

## À propos de l’écriture dans le fichier

Le module `json` de Python, par défaut, définit `ensure_ascii=True` lors de la sérialisation des données, ce qui signifie que tous les caractères non ASCII sont échappés. Cela peut entraîner des problèmes lors du rendu de ces caractères dans des modèles HTML ou Jinja.

La solution : lors de la sérialisation des données JSON, vous pouvez définir **`ensure_ascii=False`** pour conserver les caractères Unicode d’origine :

```python
json.dumps(data, ensure_ascii=False)
```

**Remarque** : ce paramètre n’affecte pas **`json.load`**, mais n’est pertinent que lorsque vous réécrivez des données JSON dans un fichier ou que vous les transmettez à un modèle.

## Avez-vous appris quelque chose ?

Si oui…

{{< blockcontainer jli-notice-tip "Suivez-moi !">}}

Merci d’avoir lu cet article. Assurez-vous de [me suivre sur X](https://x.com/LitzlerJeremie), de [vous abonner à ma publication Substack](https://iamjeremie.substack.com/) et d’ajouter mon blog à vos favoris pour ne pas manquer les prochains articles.

{{< /blockcontainer >}}

Photo de [cottonbro studio](https://www.pexels.com/photo/photo-of-person-taking-down-notes-7319070/).
