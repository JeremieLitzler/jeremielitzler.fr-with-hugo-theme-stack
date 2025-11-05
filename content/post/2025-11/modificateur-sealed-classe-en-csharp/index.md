---
title: "Concevoir une classe fermée en C#"
description: "Pour empêcher une classe d’être derivée par une autre classe en C#, vous pouvez utiliser un mot-clé. Voyons lequel, comment l’utiliser et pourquoi."
image: 2025-09-15-sealed-keyword-in-dotnet-and-csharp.jpg
imageAlt: "Image avec ‘Modificateur Sealed en .NET et C#’"
date: 2025-11-05
categories:
  - Développement web
tags:
  - Csharp
  - Programmation orientée objet
---

## Comment

Pour empêcher une classe d’être sous-classée en C#, vous pouvez utiliser le mot-clé ``sealed`. Lorsqu’une classe est marquée comme `sealed`, elle ne peut être héritée par aucune autre classe. Cela est utile lorsque vous souhaitez vous assurer que l’implémentation de votre classe reste inchangée et qu’aucune autre sous-classe n’est créée pour modifier son comportement.

Voici un exemple de conception d’une classe afin d’empêcher l’héritage :

```csharp
public sealed class SealedClass
{
    // Class members go here

    public void DoAwesome()
    {
        // Method implementation
    }
}

```

Dans cet exemple, `SealedClass` est marquée comme `sealed`, donc aucune autre classe ne peut en hériter. Si vous essayez de créer une sous-classe héritant de `SealedClass`, le compilateur C# générera une erreur.

Voici un exemple illustrant l’erreur du compilateur :

```csharp
public class DerivedClass : SealedClass
{
    // Cela provoquera une erreur de compilation car SealedClass est scellé.
}

```

Tenter de compiler le code ci-dessus entraînera une erreur de compilation similaire à celle-ci :

```
error CS0509: 'DerivedClass': cannot derive from sealed type 'SealedClass'
```

L’utilisation du mot-clé `sealed` est un moyen simple et efficace de garantir qu’une classe ne peut pas être dérivée en C#.

## Pourquoi

L’utilisation du mot-clé `sealed` en C# pour empêcher l’héritage d’une classe peut s’avérer particulièrement utile dans plusieurs scénarios. Voici quelques cas d’utilisation courants :

### 1. **Garantir la sécurité et l’intégrité**

Lorsqu’une classe traite des données sensibles ou des opérations critiques pour la sécurité, utiliser `sealed` de la classe permet d’empêcher des modifications accidentelles susceptibles de compromettre la sécurité du système.

Par exemple, une classe qui gère des clés de chiffrement ou effectue des vérifications d’authentification entre dans cette catégorie.

N’hésitez pas à consulter la [documentation Microsoft sur les directives de codage sécurisé](https://docs.microsoft.com/en-us/dotnet/standard/security/secure-coding-guidelines) pour approfondir le sujet.

### 2. **Préserver les invariants de classe**

Si une classe possède une logique interne complexe et des invariants qui doivent toujours être conservés, utiliser `sealed` garantit que les classes dérivées ne rompent pas involontairement ces invariants.

Par exemple, une classe qui gère un processus de transaction financière complexe peut tirer parti du mécanisme.

La documentation Microsoft sur [les directives de conception des classes](https://docs.microsoft.com/en-us/dotnet/standard/design-guidelines/class-design) peut vous aider à approfondir ce concept.

### 3. **Optimisation des performances**

Utiliser `sealed` peut entraîner des optimisations de performances, car le runtime peut émettre certaines hypothèses sur la classe, comme éviter la surcharge liée à la distribution des méthodes virtuelles.

Par exemple, les classes utilitaires fréquemment utilisées ou les structures de données pour lesquelles les performances sont essentielles tirent profit du scellement des classes.

Pour en savoir plus sur les impacts détaillés, consultez la [documentation Microsoft sur les considérations relatives aux performances](https://docs.microsoft.com/en-us/dotnet/framework/performance/performance-tips).

### 4. **Stabilité de la conception des API**

Lors de la conception d’API publiques, utiliser `sealed` peut aider à garantir que le comportement de la classe reste stable et prévisible, évitant ainsi les problèmes pouvant découler d’un héritage incorrect ou involontaire.

Les classes de framework largement utilisées par d’autres développeurs rentrent dans cette catégorie.

[La documentation Microsoft sur la conception d’API](https://docs.microsoft.com/en-us/dotnet/standard/design-guidelines/) explique en détail pourquoi.

### 5. **Prévention des utilisations abusives**

Enfin, utiliser `sealed` peut empêcher les utilisateurs d’hériter et d’utiliser la classe de manière abusive, contrairement à l’intention initiale de la conception.

C’est le cas des classes utilitaires non statiques qui fournissent des méthodes statiques pour lesquelles l’héritage n’a pas de sens.

Vous pouvez lire « [Classes scellées .NET — Exemple 2 : classes utilitaires](https://www.compilenrun.com/docs/framework/dotnet/net-object-oriented-programming/net-sealed-classes/) » pour vérifier cela.

## Exemple de scénario

Prenons l’exemple d’une classe `CorePaymentProcessor` qui gère les transactions financières. Cette classe peut impliquer une logique complexe pour garantir l’intégrité et la sécurité des transactions. Afin d’empêcher toute sous-classe de compromettre ces aspects, la classe peut être scellée :

```csharp
public sealed class CorePaymentProcessor
{
    // Membres et méthodes pour traiter les paiements en toute  sécurité

    public void ProcessPayment(decimal amount)
    {
        // Logique de traitement des paiements
    }
}
```

Si quelqu’un tente de créer une sous-classe de `CorePaymentProcessor`, il rencontrera une erreur de compilation :

```csharp
public class OtherPaymentProcessor : CorePaymentProcessor
{
    // Cela provoquera une erreur de compilation car CorePaymentProcessor est scellé.
}
```

## Conclusion

Et voilà ! Utilisez-vous déjà le mot-clé `sealed` ? Vous devrez peut-être vérifier votre code afin d’évaluer si certaines parties ne tombent pas dans un cas d’usage décrit plus haut.

{{< blockcontainer jli-notice-tip "Suivez-moi !">}}

Merci d'avoir lu cet article. Assurez-vous de [me suivre sur X](https://x.com/LitzlerJeremie), de [vous abonner à ma publication Substack](https://iamjeremie.substack.com/) et d'ajouter mon blog à vos favoris pour ne pas manquer les prochains articles.

{{< /blockcontainer >}}
