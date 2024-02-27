---
title: "Making a unused method argument compliant with TypeScript and ESLint"
description: "Handling the HTTP 404 errors is important. Showing a page that is user friendly is a must in terms of UX. Without it, you may loose a customer."
image: images/2024-02-16-typescript-code-sample.png
imageAlt: TypeScript code sample
date: 2024-02-16
categories:
  - Web Development
tags:
  - TypeScript
  - Tip Of The Day
relcanonical: https://www.linkedin.com/pulse/making-unused-method-argument-compliant-typescript-eslint-litzler-uiktf/
---

I am pretty new to TypeScript, as I am going through the [VueSchool curiculum](https://vueschool.io/courses).

I like what TypeScript brings to the code and how it makes you think more how to write your code.

As I progressed, I wondered about something: how would you solve the TypeScript linting error when an argument in a method is not used?

Fun fact: I quickly came across this usecase:

![Code example failing to comply with ESLint and TypeScript](images/code-example.png)

How did I fix it? Simple: listen to what ESLint has to say. Sometimes, it provides a quick fix.

In my case, it suggested me to mark the unused argument with a underscore and tada, ESLint became happy.
