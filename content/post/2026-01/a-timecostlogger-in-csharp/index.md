---
title: "Un enregistreur de temps passé en C#"
description: "Savoir combien de temps prend l'exécution de votre code est la première information à recueillir lorsqu'un processus semble sous-performant."
image: 2026-01-26-a-stopwatch.jpg
imageAlt: Un chronomètre
date: 2026-01-30
categories:
  - Développement logiciel
tags:
  - Csharp
---

Votre application fonctionne correctement en développement, passe tous les tests, puis, soudainement, les utilisateurs commencent à se plaindre de sa lenteur en production.

Vous vérifiez les journaux et parcourez les métriques dont vous disposez, mais vous ne parvenez pas à identifier précisément où se situe le goulot d’étranglement.

S’agit-il de la requête de base de données, non optimisée pour le volume de données en production ? Du traitement des fichiers ? D’un appel API tiers que vous avez ajouté le mois dernier pour une nouvelle fonctionnalité ?

Voici une façon d’identifier le code responsable des lenteurs.

## Mesurer le temps passé à exécuter du code

C’est exactement là qu’un `TimeCostLogger` devient indispensable. Au lieu de deviner ou de mettre en place des outils de profilage élaborés, vous pouvez encapsuler les blocs de code suspects et laisser les chiffres parler d’eux-mêmes.

Placez-le autour de vos opérations de base de données, de vos boucles de calcul lourdes ou de ces appels de services externes. Par exemple :

```csharp
using (new TimeCostLogger("MailService.Send"))
{
  _mailService.Send(mail, null);
}
```

Lorsque les traces seront écrites, vous verrez exactement quelles parties du code consomment ces précieuses secondes.

## Comment le mettre en œuvre

Comme je l’ai dit, vous n’avez pas besoin d’installer de logiciel de profilage, d’apprendre à utiliser de nouveaux outils ou de modifier votre processus de déploiement.

Il s’agit simplement d’une instruction `using` que vous pouvez ajouter pendant l’investigation d’un bug et laisser en place pour la surveillance en production. Lorsque les performances ne semblent pas optimales, vous disposerez de données historiques sur les temps d’exécution qui vous indiqueront exactement quand et où les choses ralentissent.

Cela est particulièrement utile lorsque vous avez affaire à des processus complexes comportant plusieurs étapes. Peut-être que l’ensemble de votre processus prend cinq secondes, mais vous ne savez pas si cela est dû à la lenteur de la première étape ou à la cinquième étape.

Vous pouvez encapsuler chaque étape individuellement. Cette série d’appels à différents services que vous pensiez être le problème ? Elle a pris quelques centaines de millisecondes. Le client de messagerie qui envoie des e-mails ? C’est là que se trouve votre goulot d’étranglement de vingt secondes.

Cela m’est arrivé il y a quelques mois.

Bien sûr, il existe des outils de profilage plus sophistiqués, mais parfois, vous avez juste besoin de réponses rapides sans frais supplémentaires ou intégration complexe à mettre en œuvre.

## Le code

Le `TimeCostLogger` ci-dessous vous offre cette visibilité ciblée là où vous en avez besoin, avec l’infrastructure de journalisation que vous avez déjà en place sur votre projet.

````csharp
      /// Usage: wrap the code to measure
      ///
      /// - with a suffixed-custom-block-name appended to the log
      /// ```
      /// using (new TimeCostLogger("Custom block name"))
      /// {
      ///   // Code to time…
      /// }
      /// ```
      ///
      /// or wrap a whole class and method:
      ///
      /// ```
      /// using (new TimeCostLogger())
      /// {
      ///   // Code to time…
      /// }
      /// ```
      /// </summary>
      public class TimeCostLogger : IDisposable
      {
            private readonly Stopwatch _stopwatch;
            private readonly string _className;
            private readonly string _methodName;
            private readonly string _blockName;

            public TimeCostLogger([CallerMemberName] string methodName = "", [CallerFilePath] string filePath = "")
            {
                  _className = GetClassNameFromFilePath(filePath);
                  _methodName = methodName;
                  _blockName = null;
                  _stopwatch = Stopwatch.StartNew();
            }

            public TimeCostLogger(string blockName, [CallerMemberName] string methodName = "", [CallerFilePath] string filePath = "")
            {
                  _className = GetClassNameFromFilePath(filePath);
                  _methodName = methodName;
                  _blockName = blockName;
                  _stopwatch = Stopwatch.StartNew();
            }

            private string GetClassNameFromFilePath(string filePath)
            {
                  if (string.IsNullOrEmpty(filePath))
                        return "Unknown";

                  var fileName = System.IO.Path.GetFileNameWithoutExtension(filePath);
                  return fileName;
            }

            public void Dispose()
            {
                  _stopwatch.Stop();

                  var timeElapsedInMs = _stopwatch.ElapsedMilliseconds;
                  var location = string.IsNullOrEmpty(_blockName)
                        ? $"{_className}.{_methodName}"
                        : $"{_className}.{_methodName} - {_blockName}";
                  var message = $"Time elapsed for {location} in ms : {timeElapsedInMs}";

                  LogHelper.LogInfo(LoggedInUser.Instance.AppCode, message, null);
            }
      }

```’

## Conclusion

Et vous, comment vous y prendriez-vous ?

Pour moi, cela m’a aidé à de nombreuses reprises à cerner le problème. Il y a quelques mois, le serveur SMTP, configuré avec un dossier de dépôt utilisant un chemin CNC, était la source des lenteurs. Si vous effectuiez plusieurs appels rapides à l’API, qui appelait l’envoi d’e-mails, l’exécution suivant le premier appel prenait 20 secondes.

La fonctionnalité sous-jacente n’était pas critique et le client l’utilisait très rarement, nous avons donc réduit la priorité, mais j’écrirai un article sur la raison dès que le problème redeviendra prioritaire.

{{< blockcontainer jli-notice-tip "Suivez-moi !">}}

Merci d’avoir lu cet article. Assurez-vous de [me suivre sur X](https://x.com/LitzlerJeremie), de [vous abonner à ma publication Substack](https://iamjeremie.substack.com/) et d’ajouter mon blog à vos favoris pour ne pas manquer les prochains articles.

{{< /blockcontainer >}}


Photo de [William Warby](https://www.pexels.com/photo/close-up-of-a-heuer-mechanical-stopwatch-19730401/).
````
