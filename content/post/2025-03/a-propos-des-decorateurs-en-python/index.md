---
title: "A propos des décorateurs en Python"
description: "Les décorateurs en Python sont équivalents aux attributs personnalisés en C#. Découvrons comment ils fonctionnent."
image: 2025-03-03-4-colored-brushes.jpg
imageAlt: 4 pinceaux de couleurs différentes
date: 2025-03-07
categories:
  - Développement Web
tags:
  - Python
---

Les décorateurs en Python permettent de modifier ou d’améliorer des fonctions ou des classes sans modifier directement leur code source.

Ils utilisent le concept des fermetures (`closure` en anglais) et des fonctions d’ordre supérieur pour envelopper la fonction ou la classe d’origine, en ajoutant des fonctionnalités avant ou après l’exécution du code enveloppé.

Cela ressemble aux intercepteurs de navigation de Vue Router ou aux attributs personnalisés ou _middlewares_ en C#.

Voyons étape par étape comment les coder et les utiliser.

## Exemple de base

Commençons par les bases. Vous définissez un décorateur Python comme suit :

```python
def my_decorator(original_function):
    def wrapper_function(*args, **kwargs):
        # Code à exécuter avant la `original_function`
        result = original_function(*args, **kwargs)
        # Code à exécuter après la `original_function`
        return result
    return wrapper_function
```

Examinons maintenant des cas d’utilisation spécifiques.

## Décorateur sans contribution de l’appelant

C’est la forme la plus simple d’un décorateur. Il n’a pas d’autres arguments que la fonction qu’il décore. Entre les deux, il affiche `Dans le décorateur avant d'appeler {nom de la fonction}` et `Fonction {nom de la fonction} appelée. Compléter la logique du décorateur...`.

```python
def log_function_call(func):
    def wrapper(*args, **kwargs):
        print(f"In decorator before calling <{func.__name__}>")
        result = func(*args, **kwargs)
        print(f"Function <{func.__name__}> called. Completing decorator logic...")
        return result
    return wrapper

@log_function_call
def greet(name):
    print(f"Hello, {name}!")

greet("Alice")
# Trace :
# "In decorator before calling <greet>
# "Function <greet> called. Completing decorator logic...
```

Dans cet exemple, le décorateur `log_function_call` ajoute la journalisation avant et après l’appel de la fonction sans avoir besoin de l’intervention de l’appelant.

## Décorateur avec entrée de l’appelant

Lorsque vous avez besoin de passer des arguments au décorateur lui-même, vous devez ajouter une autre couche de fonctions :

```python
def repeat(times):
    def decorator(func):
        def wrapper(*args, **kwargs):
            for _ in range(times):
                result = func(*args, **kwargs)
            return result
        return wrapper
    return decorator

@repeat(times=3)
def greet(name):
    print(f"Hello, {name}!")

greet("Bob")

```

Dans ce cas, le décorateur `repeat` accepte un argument `times` qui détermine combien de fois la fonction décorée `greet` doit être appelée.

Voici comment cela fonctionne :

1. `repeat(times)` est appelé avec l’argument, retournant la fonction `decorator`.
2. La fonction `décorateur` enveloppe alors la fonction originale (`greet` dans ce cas).
3. Lorsque `greet` est appelée, elle appelle en fait la fonction `wrapper`, qui exécute la fonction `greet` originale `fois` un certain nombre de fois.

## L’ordre est important

Vous pouvez aussi combiner plusieurs décorateurs :

```python
@decorator1
@decorator2(arg)
def my_function():
    pass

```

Cela équivaut à :

```python
my_function = decorator1(decorator2(arg)(my_function))

```

L’ordre des décorateurs est crucial et dépend de votre logique métier.

### Exemple pratique

Supposons que nous ayons ce point de terminaison qui intercepte un appel entrant (webhook) :

```python
from twilio.twiml.voice_response import VoiceResponse

from app.modules.call import call
from app.commons.decorators import need_xml_output, log_headers, validate_twilio_request

@call.route('/incoming', methods=['POST'])
@validate_twilio_request
@log_headers
@need_xml_output()
def redirecting_call() -> VoiceResponse:
  # find whom to redirect the call to...
```

Les décorateurs que nous voulons examiner sont `log_headers` et `validate_twilio_request`.

Ils ressemblent à ceci :

```python
def log_headers(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        try:
            current_app.logger.info(f"Request Headers: {dict(request.headers)}")
            return f(*args, **kwargs)
        except Exception as e:
            current_app.logger.error(f"Exception in decorator <log_headers>: {e}")

    return decorated_function

def validate_twilio_request(f):
    print("Decorator validate_twilio_request called")

    @wraps(f)
    def decorated_function(*args, **kwargs):
        try:
            # List all the data that make a signature
            current_app.logger.debug("Inside decorated function")
            auth_token = current_app.config['TWILIO_AUTH_TOKEN']
            url = _get_url()
            post_data = request.form
            # The X-Twilio-Signature header
            twilio_signature = request.headers.get('X-Twilio-Signature', '')

            current_app.logger.debug(f"AUTH_TOKEN={auth_token}")
            current_app.logger.debug(f"url={url}")
            current_app.logger.debug(f"post_data={post_data}")
            current_app.logger.debug(f"twilio_signature={twilio_signature}")

            # Create a RequestValidator object
            validator = RequestValidator(auth_token)

            # Validate the request
            if not validator.validate(url, post_data, twilio_signature):
                # If the request is not valid, return a 403 Forbidden error
                abort(403)

            # If the request is valid, call the decorated function
            return f(*args, **kwargs)
        except Exception as e:
            current_app.logger.error(f"Exception in decorator <validate_twilio_request>: {e}")
            abort(500)

    return decorated_function
```

Maintenant, un problème peut survenir avec le décorateur `log_headers` qui n’exécute pas et ne trace pas les en-têtes. Pourquoi ?

En Python, les décorateurs sont appliqués de bas en haut. Dans notre cas d’utilisation, nous aurions l’équivalent de ceci :

```python
# ORDER OF EXECUTION
result = need_xml_output(log_headers(validate_twilio_request(call.route(args)))(redirecting_call))
```

Le décorateur `validate_twilio_request` échoue si la signature dans l’en-tête `X-Twilio-Signature` est incorrecte et donc le décorateur `log_headers` ne s’exécutera pas du tout à cause de l’erreur soulevée :

```python
if not validator.validate(url, post_data, twilio_signature):
    abort(403)
```

Pour déboguer l’échec du décorateur `validate_twilio_request`, c'est dommage de ne pas tracer les en-têtes.

La solution est simple : placez `log_headers` en premier et le fichier de traces contiendra tous les en-têtes reçus lors de la requête.

{{< blockcontainer jli-notice-tip "Suivez-moi !">}}

Merci d’avoir lu cet article. Assurez-vous de [me suivre sur X](https://x.com/LitzlerJeremie), de [vous abonner à ma publication Substack](https://iamjeremie.substack.com/) et d’ajouter mon blog à vos favoris pour ne pas manquer les prochains articles.

{{< /blockcontainer >}}

Crédit: Photo de [Nataliya Vaitkevich](https://www.pexels.com/photo/blue-and-white-paint-brush-5642113/).
