---
title: "Passing Data to Inherited Flask Templates"
description: "In a webapp, you always have a layout that declares the base element (header, nav, main and footer). In this article, we’ll look at how to pass dynamic data to it."
image: 2025-11-24-two-persons-exchanging-a-document.jpg
imageAlt: Two persons exchanging a document
date: 2025-11-28
categories:
  - Web Development
tags:
  - Python
  - Flask
  - Jinja2
---

## Use Case

Let’s say you have a web application that uses authentication and you need to pass on some properties of the user object to the navigation element to display it when he’s connected.

You probably put this navigation in the `layout.html` (or `base.html` as you may encounter).

Now, let’s say the user information is stored in the session, for example in `session['user']`.

How do you display it in the navigation?

## Solution

With Flask 3 comes a special decorator: `context_processor`.

```python
@frontend.context_processor
def inject_user():
    user = session.get('user', None)
    if user:
        username = user.get('name', 'User')  # Default to 'User' if name is not found
    else:
        username = None
    return dict(username=username)
```

Note: in the example below, I’m using modules to organize my Flask application. So the `@frontend` means I’m in the `app/modules/frontend` and since I need this only for frontend pages, I’ll put it at the top of my `routes.py` inside this module.

Now, in the `layout.html`, you simply use a condition to display the user’s name when it’s available:

```html
<nav class="theme-color">
  <div class="custom-nav-wrapper container">
    <a href="{{ url_for('frontend.index') }}">My Awesome App</a>
    <ul>
      {% if username %}
      <li class="username">Hello, <strong>{{ username }}</strong>!</li>
      {% endif %}
      <!-- The rest of your navigation -->
    </ul>
  </div>
</nav>
```

## Other Usage

Now that you have this context available, you can access it everywhere in the templates.

For example, in another page where you would record comments, the author of the comment shouldn’t have to input his name.

Now, you can use the same logic as above.

I have a second tip for this article. In my scenario, I had set the input to be required and the user had to type it.

When I implemented that, I thought I’ll set the `disabled` attribute on the input. Nope! That’ll not send the value to Flask, if you submit the form the old fashion way (Yes, I do 😊).

I rarely used the attribute `readonly` that does the job.

So the input looks like that:

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

And a bit of CSS provides good feedback to the end user :

```css
input[readonly] {
  background-color: #ccc;
}
```

## Conclusion

Did you learn something?

{{< blockcontainer jli-notice-tip "Follow me">}}

Thanks for reading this article. Make sure to [follow me on X](https://x.com/LitzlerJeremie), [subscribe to my Substack publication](https://iamjeremie.substack.com/) and bookmark my blog to read more in the future.

{{< /blockcontainer >}}

Credit: Photo by [Sora Shimazaki](https://www.pexels.com/photo/crop-black-job-candidate-passing-resume-to-hr-employee-5673502/)
