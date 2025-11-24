---
title: "Transmission de données dans les modèles HTML avec Flask"
description: "Dans une application web, vous disposez toujours d'une mise en page qui définit des vues partielles pour des éléments de base (en-tête, navigation, contenu principal et pied de page). Dans cet article, nous allons voir comment transmettre entre ces vues des données dynamiques."
image: 2025-11-24-two-persons-exchanging-a-document.jpg
imageAlt: Deux personnes échangeant un document
date: 2025-11-28
categories:
  - Développement web
tags:
  - Python
  - Flask
  - Jinja2
---

## Cas d’utilisation

Supposons que vous développez une application web qui utilise l’authentification et que vous deviez transmettre certaines propriétés de l’objet utilisateur à une vue partielle représentant la navigation afin de l’afficher lorsqu’il est connecté.

Vous avez probablement placé la référence vers cette vue « navigation » dans le fichier `layout.html` (ou `base.html`, selon les cas).

Supposons maintenant que les informations utilisateur soient stockées dans la session, par exemple dans `session[“user”]`.

Comment les afficher dans la navigation ?

## Solution

Flask 3 est livré avec un décorateur spécial : `context_processor`.

```python
@frontend.context_processor
def inject_user():
    user = session.get('user', None)
    if user:
        username = user.get('name', 'User')  # Par défaut, `userbname vaut `User` si la clé `name` n'est pas trouvé dans la session.
    else:
        username = None
    return dict(username=username)
```

Remarque : dans l’exemple ci-dessous, j’utilise des modules pour organiser mon application Flask. Ainsi, `@frontend` signifie que je me trouve dans `app/modules/frontend`. Comme je n’en ai besoin que pour les pages présentées à l’utilisateur, je vais le placer en haut de mon fichier `routes.py` à l’intérieur de ce module.

Maintenant, dans le fichier `layout.html`, il suffit d’utiliser une condition pour afficher le nom de l’utilisateur lorsqu’il est disponible :

```html
<nav class="theme-color">
  <div class="custom-nav-wrapper container">
    <a href="{{ url_for('frontend.index') }}">My Awesome App</a>
    <ul>
      {% if username %}
      <li class="username">Hello, <strong>{{ username }}</strong>!</li>
      {% endif %}
      <!-- La suite de la vue partielle -->
    </ul>
  </div>
</nav>
```

## Autre utilisation

Maintenant que vous disposez de ce contexte, vous pouvez y accéder partout dans les modèles.

Par exemple, dans une autre page où vous enregistrez des commentaires, l’auteur du commentaire ne devrait pas avoir à saisir son nom.

Vous pouvez désormais utiliser la même logique que ci-dessus.

## Attribut `disabled` vs. `readonly`

J’ai une deuxième astuce pour cet article. Dans mon second cas d’utilisation, j’avais défini le champ comme obligatoire et l’utilisateur devait le remplir.

Lorsque j’ai implémenté cela, j’ai pensé que j’allais définir l’attribut `disabled` sur l’entrée. Non ! Cela n’enverra pas la valeur à Flask, si vous soumettez le formulaire à l’ancienne (oui, c’est que je faisais 😊).

J’ai rarement utilisé l’attribut `readonly`, mais, dans ce cas précis, il me permettait de rendre la saisie impossible tout en permettant de passer la valeur.

L’entrée ressemble donc à ceci :

```html
<label for="note_author">Author</label>
<input
  type="text"
  class="form-control"
  id="note_author"
  name="note_author"
  value="{% if username %}{{ username }}{% endif %}"
  readonly
/>
```

Et un peu de CSS fournissent une bonne expérience à l’utilisateur final :

```css
input[readonly] {
  background-color: #ccc;
}
```

## Conclusion

Avez-vous appris quelque chose ?

{{< blockcontainer jli-notice-tip "Suivez-moi !">}}

Merci d’avoir lu cet article. Assurez-vous de [me suivre sur X](https://x.com/LitzlerJeremie), de [vous abonner à ma publication Substack](https://iamjeremie.substack.com/) et d’ajouter mon blog à vos favoris pour ne pas manquer les prochains articles.

{{< /blockcontainer >}}

Crédit : Photo de [Sora Shimazaki](https://www.pexels.com/photo/crop-black-job-candidate-passing-resume-to-hr-employee-5673502/)
