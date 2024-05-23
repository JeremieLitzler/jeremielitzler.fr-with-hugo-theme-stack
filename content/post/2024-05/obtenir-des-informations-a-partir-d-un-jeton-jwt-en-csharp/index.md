---
title: "Obtenir des informations à partir d’un jeton JWT en C#"
description: "L’authentification JWT est un mécanisme d'authentification sans état basé sur un jeton. Il est couramment utilisé et il est généralement encodé et signé. Mais comment le décoder ? Voyons ce qu’il en est en C#."
image: images/2024-05-24-html-code-handling-the-failed-on-authentication.jpg
imageAlt: "Code HTML gérant une authentification qui a échoué"
date: 2024-05-24
categories:
  - Développement Web
tags:
  - Astuce Du Jour
  - Authentification
---

Ci-dessous, je décrirai une méthode simple pour lire l’en-tête `Authorization` contenant un jeton JWT pour en extraire une information.

## La logique

### Quels `usings`

```csharp
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Text;
using Microsoft.AspNetCore.Http;
using Microsoft.IdentityModel.Tokens;
```

### Extraire la valeur JWT de la requête

C’est la première étape. L’en-tête utilisé pour transmettre la valeur JWT est `Authorization` :

```csharp
public static string GetJwtTokenFromRequest(HttpContext context)
{
    var authHeader = context.Request.Headers["Authorization"].FirstOrDefault();

    if (string.IsNullOrEmpty(authHeader))
    {
      //no authorization header
      return null;
    }

    if (!authHeader.StartsWith("Bearer "))
    {
      //no bearer but authorization header returned
      return authHeader;
    }

    //bearer present, returning trimmed value
    return authHeader.Substring("Bearer ".Length).Trim();
}
```

Le code ci-dessus prend en compte la présence de `Bearer` dans la valeur de l’en-tête.

C’est la bonne pratique à suivre pour l’utiliser (au moins, je n’ai jamais vu le cas où l’on passait ou recevait le `Authorization` sans `Bearer`).

### Décoder la valeur JWT

Passons au décodage.

Le code ci-dessous valide uniquement la clé de signature (voir [ValidateIssuerSigningKey](https://learn.microsoft.com/en-us/dotnet/api/microsoft.identitymodel.tokens.tokenvalidationparameters.validateissuersigningkey?view=msal-web-dotnet-latest#microsoft-identitymodel-tokens-tokenvalidationparameters-validateissuersigningkey)).

Pour valider d’autres parties, [rendez-vous sur le site de Microsoft](https://learn.microsoft.com/en-us/dotnet/api/microsoft.identitymodel.tokens.tokenvalidationparameters?view=msal-web-dotnet-latest).

```csharp
public static string GetInformationFromToken(HttpContext context, string dataProp)
{
  var token = GetJwtTokenFromRequest(context);
  if (string.IsNullOrEmpty(token))
  {
    //le jeton est vide
    return null;
  }

  try
  {
    var tokenHandler = new JwtSecurityTokenHandler();
    tokenHandler.ValidateToken(token, new TokenValidationParameters
    {
      ValidateIssuerSigningKey = true,
      ValidateIssuer = false,
      ValidateAudience = false
    }, out SecurityToken validatedToken);

    var jwtToken = (JwtSecurityToken)validatedToken;
    //le JwtSecurityToken contient une propriété "Claims" dont vous extrayez une propriété de données que vous voulez lire
    var targetInfo = jwtToken.Claims.FirstOrDefault(c => c.Type == dataProp);

    if (targetInfo != null)
    {
      return targetInfo.Value;
    }

    return null;
  }
  catch (Exception e)
  {
    // Validation du Token a échoué
    return null;
  }
}
```

## L’usage

Ensuite, il suffit d’appeler `JwtTokenHelper` comme suit :

```csharp
var dataExtractedFromJwt =
    JwtTokenHelper.GetInformationFromToken(
        HttpContextAccessor.HttpContext,
        "some_data_in_jwt") ;
```

Crédit : Photo de [Markus Spiske](https://unsplash.com/@markusspiske?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash) sur [Unsplash](https://unsplash.com/photos/text-6pflEeSzGUo?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash).
