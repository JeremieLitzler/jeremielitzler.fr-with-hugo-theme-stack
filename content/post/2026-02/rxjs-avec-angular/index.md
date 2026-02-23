---
title: "RxJS avec Angular"
description: "RxJS est une bibliothèque utilitaire réactive JavaScript, qui gère des flux de données asynchrones à l'aide d'observables."
image: 2026-02-23-a-pair-of-vintage-binoculars.jpg
imageAlt: Une paire de jumelles anciennes
date: 2026-02-27
categories:
  - Web Development
tags:
  - Angular
  - RxJs
---

Suite au [cours sur Angular 18](../les-bases-avec-angular/index.md), j'ai décidé de me plonger plus profondément dans les concepts et l'utilisation de RxJs.

Grâce à [Sergio de SimpleTech](https://www.youtube.com/@SimpleTechProd), je comprends mieux les façons de l'utiliser.

Entrons dans le vif du sujet !

## Le commencement

### Qu'est-ce que RxJS ?

C'est l'abréviation de _Reactive Extensions for JavaScript_. Cette bibliothèque permet de traiter les événements asynchrones de manière réactive. Pour comprendre tout cela, vous devez comprendre 2 choses :

1. Qu'est-ce qu'un événement asynchrone ?
2. Qu'est-ce que la réactivité ?

On peut définir les événements asynchrones comme des événements qui peuvent se produire à tout moment, comme un clic sur un bouton, une réponse à une requête HTTP ou la saisie sur un clavier.

L'objectif est de créer des interfaces plus dynamiques et un code plus facile à comprendre et à maintenir. Nous avons tous connu l'enfer du callback, n'est-ce pas ?

Comment cela fonctionne-t-il avec RxJS ?

RxJS fournit une API appelée `Observable`. Elle correspond à une sorte d'enveloppe autour d'événements asynchrones, par exemple, une enveloppe autour d'un appel HTTP ou d'un clic .

Pour s'abonner à un observable, nous utiliserons la méthode `subscribe`, à laquelle nous passerons un observateur en paramètre.

Vous pouvez considérer un observateur comme une collection d'une ou plusieurs des méthodes suivantes :

- la méthode `next` qu'on utilise pour recevoir les événements en paramètres que notre observable va envoyer.
- la méthode `error` qui perment à l'observable d'envoyer l'erreur et de lui indiquer qu'il doit arrêter son exécution. La méthode `error` prend en paramètre l'objet error.
- la méthode `complete` indique à l'observable qu'il a fini de s'exécuter et qu'il n'émettra plus de valeur.

## L'exemple de code

Prenons l'exemple de code suivant, fortement commenté pour vous aider à comprendre :

```tsx
import { Component, OnDestroy } from "@angular/core";
import { Observable, Subscriber, Subscription } from "rxjs";

@Component({
  selector: "app-rx-js-demos",
  imports: [],
  templateUrl: "./rx-js-demos.component.html",
  styleUrl: "./rx-js-demos.component.css",
})
export class RxJsDemosComponent implements OnDestroy {
  // Cette variable contient l'objet Subscription renvoyé par
  // la méthode `subscribe()`.
  speakerSubscription: Subscription | null = null;

  letterSpoken = "";
  constructor() {
    // Initialisation de l'observable speaker$
    // L'observable est nommé avec un "$" final
    // comme convention de nommage avec RxJS
    const speaker$ = new Observable<string>(
      (subscriber: Subscriber<string>) => {
        const textToSend = "Hello RxJS";
        // Boucle sur les lettres de `textToSend`
        // et émet un événement avec la méthode suivante
        // toutes les 250 ms.
        for (let i = 0; i < textToSend.length; i++) {
          setTimeout(
            () => {
              subscriber.next(textToSend[i]);
            },
            (i + 1) * 250,
          );
        }
        // Une fois la boucle terminée, émettez l'événement qui
        // indique que l'observable est terminé et qu'il n'émettra pas
        // de nouvel événement.
        // PS : Vous devez commenter le timeout suivant,
        // déclenchant l'événement d'erreur, afin que l'événement complete puisse se déclencher.
        setTimeout(() => {
          subscriber.complete();
        }, textToSend.length * 1000);

        // Ce qui suit émet un événement `error`.
        setTimeout(
          () => subscriber.error(),
          Math.random() * textToSend.length * 1000,
        );
      },
    );

    // L'observateur « capture » les événements de l'observable.
    const speakerObserver = {
      // Sur `next`, nous concaténons la valeur, par exemple une
      // lettre de `textToSend`, à la variable `letters`.
      next: (value: string) => {
        this.letterSpoken = value;
      },
      // Sur `complete`, nous enregistrons que l'événement
      // complete a été déclenché.
      complete: () => {
        console.log("Speaker has finished!");
      },
      // Sur `error`, nous enregistrons que l'événement d'erreur
      // a été déclenché.
      error: () => {
        console.error("Speaker choked...");
      },
    };

    // Cela permet à l'Observable d'émettre ses événements
    // comme décrit ci-dessus.
    // Nous assignons `speakerSubscription` pour permettre la
    // désinscription lorsque le composant est détruit
    // (voir `ngOnDestroy`).
    this.speakerSubscription = speaker$.subscribe(speakerObserver);
  }

  ngOnDestroy(): void {
    // Cela permet d'éviter les fuites de mémoire. Oublier de se
    // désinscrire d'un Observable peut générer des bugs complexes
    // à résoudre.
    this.speakerSubscription?.unsubscribe();
  }
}
```

Si nous imprimons la `letterSpoken`, nous verrons toutes les lettres affichées une par une.

```html
<p>{{ letterSpoken }}</p>
```

Nous pouvons obtenir le même comportement avec un `AsyncPipe` de `@angular/common` :

```tsx
import { AsyncPipe } from "@angular/common";
import { Component } from "@angular/core";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { Observable, Subscriber, Subscription } from "rxjs";

@Component({
  selector: "app-rx-js-demos",
  imports: [AsyncPipe, ReactiveFormsModule],
  templateUrl: "./rx-js-demos.component.html",
  styleUrl: "./rx-js-demos.component.css",
})
export class RxJsDemosComponent {
  // Declare the Observable as null by default
  anotherSpeaker$: Observable<string> | null = null;

  constructor() {
    // Define the Observable behavior
    this.anotherSpeaker$ = new Observable<string>(
      (subscriber: Subscriber<string>) => {
        const textToSend = "Hello RxJS";
        for (let i = 0; i < textToSend.length; i++) {
          setTimeout(
            () => {
              subscriber.next(textToSend[i]);
            },
            (i + 1) * 250,
          );
        }
        setTimeout(() => {
          subscriber.complete();
        }, textToSend.length * 1000);
      },
    );
  }
}
```

Nous pouvons alors utiliser l'observable directement dans le code HTML :

```html
<!-- async  -->
<p>{{ anotherSpeaker$ | async }}</p>
```

Mais où sont les appels `subscribe` et `unsubsribe` ?

`AsyncPipe` s'en occupe pour nous :

1. Il prend en charge l'abonnement,
2. Il récupère les valeurs envoyées
3. Et lorsque le modèle n'est plus utilisé, il s'occupe même de la désinscription pour nous.

Maintenant, essayons ceci avec un formulaire et affichons le texte saisi en dessous.

Le TypeScript deviendrait :

```tsx
import { AsyncPipe } from "@angular/common";
import { Component } from "@angular/core";
import { FormControl, ReactiveFormsModule } from "@angular/forms";

@Component({
  selector: "app-rx-js-demos",
  imports: [AsyncPipe, ReactiveFormsModule],
  templateUrl: "./rx-js-demos.component.html",
  styleUrl: "./rx-js-demos.component.css",
})
export class RxJsDemosComponent {
  // Définit le champ de saisi
  textFormControl = new FormControl("");
  // Définit l'Observable, provenant de l'élément `valueChanges`
  textTyped$ = this.textFormControl.valueChanges;
}
```

Ensuite, dans le modèle, vous avez :

```html
<div><input [formControl]="textFormControl" /></div>
<p>{{ textTyped$ | async }}</p>
```

Au fur et à mesure que vous tapez dans le champ de saisi, `textTyped$` se met à jour. `async` de `AsyncPipe` gère l'abonnement et le désabonnement et remplit la balise `p` avec la valeur.

## Opérateurs RxJS

Nous pouvons utiliser une variété d'opérateurs comme les listes de son site web :

- [Opérateurs de création](https://rxjs.dev/guide/operators#creation-operators-1)
- [Opérateurs de création de jointures](https://rxjs.dev/guide/operators#join-creation-operators)
- [Opérateurs de transformation](https://rxjs.dev/guide/operators#transformation-operators)
- [Opérateurs de filtrage](https://rxjs.dev/guide/operators#filtering-operators)
- [Opérateurs de jointure](https://rxjs.dev/guide/operators#join-operators)
- [Opérateurs de multidiffusion](https://rxjs.dev/guide/operators#multicasting-operators)
- [Opérateurs de gestion des erreurs](https://rxjs.dev/guide/operators#error-handling-operators)
- [Opérateurs utilitaires](https://rxjs.dev/guide/operators#utility-operators)

### Exemple de départ qui ne fonctionne pas

Supposons que nous voulions construire un composant de recherche pour filtrer une liste de personnes.

Nous avons :

- ce code TypeScript :

  ```tsx
  import { Component, inject, OnDestroy } from "@angular/core";
  import {
    FormControl,
    FormsModule,
    ReactiveFormsModule,
  } from "@angular/forms";
  import { CommonModule } from "@angular/common";
  import { PersonService } from "../../services/person/person.service";
  import { Person } from "../../interfaces/person.interface";
  import { Subscription } from "rxjs";

  @Component({
    selector: "app-search-page",
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, FormsModule],
    templateUrl: "./search.component.html",
    styleUrls: ["./search.component.css"],
  })
  export class SearchPageComponent implements OnDestroy {
    private personService = inject(PersonService);

    searchTextFormControl = new FormControl<string>("");
    subscriptions: Subscription = new Subscription();
    searchResult: Person[] = [];

    constructor() {
      const textValueChangeSubscription =
        // Au fur et à mesure de la saisie de la recherche...
        this.searchTextFormControl.valueChanges.subscribe(
          (value: string | null) => {
            const searchTerm = value ? value : "";
            const searchSubscription = this.personService
              // nous appelons la méthode de recherche de PersonService ...
              .search(searchTerm)
              .subscribe((result: Person[]) => {
                // ... et met à jour la variable searchResult
                // qui met à jour l'interface utilisateur.
                this.searchResult = result;
              });
            this.subscriptions.add(searchSubscription);
          },
        );
      this.subscriptions.add(textValueChangeSubscription);
    }

    ngOnDestroy(): void {
      this.subscriptions.unsubscribe();
    }
  }
  ```

- ce code HTML :

  ```html
  <div>
    <input
      [formControl]="searchTextFormControl"
      placeholder="Recherche sur un nom ou un prénom..."
    />
    <div>Nombre de résultats : {{ searchResult.length }}</div>
    <ul>
      @for (person of searchResult; track person) {
      <li>
        {{ person.firstName }} {{ person.firstName }} - {{ person.birthDate |
        date: "shortDate" : "" : "fr-FR" }}
      </li>
      }
    </ul>
  </div>
  ```

- Un service permettant d'interroger des données statiques :

  ```tsx
  import { Injectable } from "@angular/core";
  import { Observable } from "rxjs";
  import { Person } from "../../interfaces/person.interface";

  @Injectable({
    providedIn: "root",
  })
  export class PersonService {
    private DATA: Person[] = [
      /* Détails omis pour des raisons de brièveté */
    ];

    search(term: string): Observable<Person[]> {
      // Le délai permet d'obtenir des résultats après un laps de
      // temps variable.
      const delay = Math.round(Math.random() * 400) + 100;
      const filteredData = this.DATA.filter(
        (item: Person) =>
          item.firstName.toLowerCase().includes(term.toLowerCase()) ||
          item.lastName.toLowerCase().includes(term.toLowerCase()),
      );
      return new Observable((observer) => {
        setTimeout(() => {
          observer.next(filteredData);
          observer.complete();
        }, delay);
      });
    }
  }
  ```

Mais lorsque nous l'utilisons, nous remarquons deux choses :

1. Rien n'est affiché par défaut. Cela ne devrait pas arriver.
2. Le résultat de la recherche pour `a` renvoie des valeurs qui ne devraient pas apparaître...

Pourquoi ?

La façon dont le code du composant est écrit, par exemple avec des `subscribe` imbriqués, ne garantit pas que le résultat contiendra le résultat attendu parce que les valeurs de l'exécution précédente entreront en collision avec les ensembles de résultats les plus récents.

### La meilleure implémentation

Les problèmes décrits précédemment nous donnent l'opportunité de comprendre la méthode `pipe`. Pour moi, c'est comme appeler `fetch` et être capable d'enchaîner plusieurs méthodes `then`, tant que vous retournez une Promise à la fin de chaque `then`.

Un `then` est équivalent à l'opérateur que vous utiliserez dans `pipe`.

Jetons un coup d'oeil au code refactoré :

```tsx
import { Component, inject } from "@angular/core";
import { FormControl, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CommonModule, AsyncPipe } from "@angular/common";
import { PersonService } from "../../services/person/person.service";
import { Person } from "../../interfaces/person.interface";
import { switchMap, Observable } from "rxjs";

@Component({
  selector: "app-search-page",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, AsyncPipe],
  templateUrl: "./search.component.html",
  styleUrls: ["./search.component.css"],
})
export class SearchPageComponent {
  private personService = inject(PersonService);

  searchTextFormControl = new FormControl<string>("");
  searchResult$: Observable<Person[]> =
    // `valueChanges` équivaut à `subscribe()`
    // ce qui permet d'utiliser `pipe()`
    this.searchTextFormControl.valueChanges.pipe(
      switchMap((searchTerm: string | null) => {
        return this.personService.search(searchTerm ?? "");
      }),
    );
}
```

L'opérateur `switchMap` prend les valeurs d'un Observable et retourne un nouvel Observable à partir de ces valeurs. Il se charge d'annuler tout Observable précédent.

Dans l'exemple, il retourne un Observable du `PersonService` en utilisant le terme de recherche actuel. Mais si vous tapez quelque chose de nouveau (deuxième recherche) avant que le premier appel à `PersonService` ne soit terminé, alors le premier appel est annulé.

Le code HTML devient alors :

```html
<!-- Nous devons utiliser `async` afin d'utiliser la valeur de `searchResult$` -->
@for (person of searchResult$ | async; track person) {
<li>
  {{ person.firstName }} {{ person.lastName }} - {{ person.birthDate | date:
  "shortDate" : "" : "fr-FR" }}
</li>
}
```

### Chaînage d'opérateurs

L'autre problème de l'exemple est que le point de départ n'affiche rien lorsque l'entrée est vide. Nous devrions avoir toutes les personnes affichées.

En utilisant l'opérateur `startWith`, nous pouvons résoudre ce problème. Cet opérateur permet d'émettre une valeur initiale :

```tsx
import { switchMap, Observable, startWith } from "rxjs";
export class SearchPageComponent {
  searchResult$: Observable<Person[]> =
    this.searchTextFormControl.valueChanges.pipe(
      startWith(""), // recherche vide
      switchMap((searchTerm: string | null) => {
        return this.personService.search(searchTerm ?? "");
      }),
    );
}
```

{{< blockcontainer jli-notice-warning "⚠️ L'ordre importe">}}

Placez les opérateurs dans l'ordre dans lequel votre logique métier doit s'exécuter !

{{< /blockcontainer >}}

Voyons deux derniers opérateurs qui donnent de l'air au `PersonService` et améliorent l'UX 🌟

```tsx
import { switchMap, Observable, startWith, debounceTime, tap } from 'rxjs';
export class SearchPageComponent {
  searchResult$: Observable<Person[]> =
  searchResult$: Observable<Person[]> =
    this.searchTextFormControl.valueChanges.pipe(
      // Attendre 500 ms avant de lancer une nouvelle recherche.
      // Évite d'appeler le service lorsque l'utilisateur
      // tape sa recherche.
      debounceTime(500),
      startWith(''),
      // UX : Démarrer la recherche, mais pas encore de résultat...
      tap(() => (this.loading = true)),
      switchMap((searchTerm: string | null) => {
        return this.personService.search(searchTerm ?? '');
      }),
      // UX : Le résultat de la recherche est disponible !
      tap(() => (this.loading = false)),
    );
}
```

Dans le code HTML, cela ressemble à ceci :

```html
<!-- afficher le "spinner"... -->
@if (loading) {
<p style="text-align: center">Loading...</p>
<!-- ... jusqu'à ce que les données soient disponibles -->
} @else {
<ul>
  @for (person of searchResult$ | async; track person) {
  <li>
    {{ person.firstName }} {{ person.lastName }} - {{ person.birthDate | date:
    "shortDate" : "" : "fr-FR" }}
  </li>
  }
</ul>
}
```

## Un observable dépendant d'un autre

Dans le composant, nous avons ajouté un compteur de résultats, mais il ne fonctionne pas après le premier refactor. C'est l'occasion de présenter un nouvel Observable dépendant de notre Observable existant :

```tsx
import { switchMap, Observable, startWith, debounceTime, tap, map } from "rxjs";
export class SearchPageComponent {
  searchResultCount$: Observable<number> = this.searchResult$.pipe(
    map((searchResult) => searchResult.length),
  );
}
```

Une fois que l'observable `searchResult$` est résolu, nous pouvons évaluer `searchResultCount$` et l'utiliser dans le HTML :

```html
<div>Nombre de résultats : {{ searchResultCount$ | async }}</div>
```

## Conclusion

Qu'avez-vous appris ? RxJs a du sens maintenant ? Grâce à Sergio, c'était le cas pour moi et j'ai hâte de mettre cela en pratique sur quelques projets.

Comme toujours...

{{< blockcontainer jli-notice-tip "Suivez-moi !">}}

Merci d’avoir lu cet article. Assurez-vous de [me suivre sur X](https://x.com/LitzlerJeremie), de [vous abonner à ma publication Substack](https://iamjeremie.substack.com/) et d’ajouter mon blog à vos favoris pour ne pas manquer les prochains articles.

{{< /blockcontainer >}}

Photo de [ClickerHappy](https://www.pexels.com/photo/black-binocular-on-round-device-63901/).
