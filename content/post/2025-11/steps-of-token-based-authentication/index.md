---
title: "The Steps Of Token-based Authentication"
description: "Token-based authentication is a method of verifying users' identity through a token. Here’s a simple explanation."
image: 2025-06-25-a-person-signing-a-document.jpg
imageAlt: A person signing a document.
date: 2025-11-12
categories:
  - Développement web
tags:
  - Sécurité
  - OAuth 2.0
---

## Simple Steps Explanation

**On login (1),** the user sends their credentials (2), like username and password, to the server.

**The token issuance (3)** follows and the server verifies the credentials. If they’re correct, it generates a token, called the access token, and sends it back to the user.

**Using the access token**, sent back by the server, the user includes this token in the header of their requests (4) to access protected resources.

**The server checks** the access token (5) with each request. If the token is valid, the server processes the request (6). If not, the request is denied (HTTP 403) (7).

### Sequence Diagram:

```
User App                                Server
   |                                      |
   |--(1)--- Send credentials  ---------->|
   |                                      |
   |                           (2) Verify credentials
   |                                      |
   |<--(3)--- Return access token --------|
   |                                      |
   |--(4)--- Send request with ---------->|
   |           access token               |
   |                                      |
   |                          (5) Verify access token
   |                                      |
   |<--(6)--- Return resource ------------|
   |                or                    |
   |<--(7)--- Return HTTP 403 ------------|
   |                                      |
```

This way, the user doesn’t have to send their username and password with every request, just the token, making it more secure and efficient.

## Authorization Server vs. Resource Server

Separating the authorization server from the resource server is a key design decision in OAuth 2.0, allowing each component to be scaled independently for the following reasons:

- With **Enterprise/Large-scale applications**, we may have multiple resource servers (like Google’s services with dozens of resource servers) that share the same authorization server (see this [OAuth](https://www.oauth.com/oauth2-servers/the-resource-server/) documentation page on the topic).
- For **Scalability**, by building the authorization server as a standalone component, you can avoid sharing a database with the API servers, making it easier to scale API servers independently (see that other [OAuth](https://www.oauth.com/oauth2-servers/differences-between-oauth-1-2/separation-of-roles/) documentation page on the topic).
- To provide **Security & Isolation**, you want the auth server isolated to its own functional domain and code base, so changes made to an application don’t impact an auth server that other applications use (See [this thread on StackExchange](https://security.stackexchange.com/questions/128646/does-the-auth-server-have-to-be-separate-from-the-resource-server-when-using-oau) for more details).

Consequently, the sequence diagram would look like this:

```plaintext
User App                  Authorization Server          Resource Server
   |                              |                            |
   |--(1)--- Send credentials  -->|                            |
   |                              |                            |
   |                     (2) Verify credentials                |
   |                              |                            |
   |<--(3)--- Return access    ---|                            |
   |         token                |                            |
   |         + refresh token      |                            |
   |         if necessary         |                            |
   |                              |                            |
   |--(4)--- Send request with token ------------------------->|
   |                              |                            |
   |                              |                    (5) Validate token
   |                              |                    with auth server
   |                              |                            |
   |                              |<--(6)--- Verify token -----|
   |                              |                            |
   |                              |                     (7) Check token
   |                              |                            |
   |                              |---(8)--- Token valid? ---->|
   |                              |                            |
   |                              |                  (9) Authorize request
   |                              |                            |
   |<--(10)-- Return resource or HTTP 403 ---------------------|
   |                              |                            |
```

## What Are the Best Practices for Expiration in Token-based Authentication

Implementing expiration in token-based authentication is crucial for maintaining security. Here are some best practices:

### 1. **Set Appropriate Expiration Times**

One solution is to generate **Short-Lived Tokens.** Set tokens to expire in a short period (e.g., minutes to hours) to limit the window of opportunity for attackers if a token is compromised.

But the most used technique is **Refresh Tokens**. Refresh tokens have a longer expiration time (e.g., days to weeks) and can be used to obtain new short-lived tokens without requiring the user to re-authenticate. This will add a few steps to the sequence above. Usually, a specific endpoint is provided by the authorization server.

Here are the additional sequence steps:

```plaintext
User App                    Authorization Server          Resource Server
   |                                |                            |
   |<--(10)-- Return HTTP 401  -----|----------------------------|
   |           (token expired)      |                            |
   |                                |                            |
   |--(11)-- Send refresh token --->|                            |
   |                                |                            |
   |                     (12) Verify refresh token               |
   |                                |                            |
   |<--(13)-- Return new access ----|                            |
   |           token (+ optional    |                            |
   |           new refresh token)   |                            |
   |                                |                            |
   |----(14)-- Retry request with new token -------------------->|
   |                                |                            |
   |                                |                  (15) Validate new token
   |                                |                            |
   |<----(16)-- Return resource ----|----------------------------|
   |                                |                            |
```

On step 10, the Resource server could return HTTP 401 (Unauthorized) instead of 403 when the token is expired.

Steps 11 to 13 then follows: the user application requests a new access token from the Authorization Server using the refresh token.

And on steps 14–16, the user application retries the original request with a new access token (and optionally a new refresh token to extend the user session.

### 2. **Token Revocation**

Implementing a mechanism to revoke tokens before they expire is important for scenarios like password changes, account compromise, or user logout.

Also, maintaining a blacklist or using a token identifier that can be checked against a list of revoked tokens prevents token forgeries.

### 3. **Use Secure Storage**

Store tokens securely on the client side, typically in HTTP-only cookies or secure storage mechanisms provided by the platform (like Keychain for iOS or Keystore for Android).

Avoid storing tokens in local storage or session storage where they’re more vulnerable to XSS attacks.

### 4. **Rotate Secrets**

Periodically rotate the secret keys used to sign tokens. Implement a key rotation strategy to ensure tokens can be validated during and after the transition period.

### 5. **Use Strong Signing Algorithms**

Use strong cryptographic algorithms (e.g., RS256, HS256) to sign tokens to prevent tampering.

### 6. **Consider Audience and Scope Claims**

Include claims like `aud` (audience) and `scope` to restrict the token’s use to specific applications or operations.

### 7. **Implement Sliding Expiration**

Optionally, implement sliding expiration where the token’s lifetime is extended with each validated request. This keeps active sessions alive while minimizing the risk of token theft.

### 8. **Educate Users**

Finally, educate users on best practices for handling tokens, such as not sharing them and understanding the importance of logging out, especially on shared or public devices.

### Fianl Note About the Refresh Token

A refresh token is a long-lived token that is used to obtain a new short-lived access token when the current one expires.

Refresh tokens should be securely stored and protected, typically more carefully than access tokens, since they’re long-lived.

If the refresh token is expired, the client won’t be able to obtain a new access token using the refresh token. This situation typically requires the user to re-authenticate by providing their credentials again.

## Conclusion

We’ll go into more detail about the best practices listed above. For now, you should have a good understanding of the steps of Token-based authentication.

{{< blockcontainer jli-notice-tip "Follow me">}}

Thanks for reading this article. Make sure to [follow me on X](https://x.com/LitzlerJeremie), [subscribe to my Substack publication](https://iamjeremie.substack.com/) and bookmark my blog to read more in the future.

{{< /blockcontainer >}}
