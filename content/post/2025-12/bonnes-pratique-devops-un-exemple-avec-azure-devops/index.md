---
title: "DevOps Best Practices: An Optimization Example With Azure DevOps"
description: "A step-by-step guide to the best practices of DevOps of automating pipeline triggers and workflows with an example."
image: 2025-12-22-devops-best-practices-a-example-with-azure-devops.jpg
imageAlt: DevOps Best Practices: A Example With Azure DevOps
date: 2025-12-26
categories:
  - Software Development
tags:
  - Azure DevOps
---

Last February, I encountered a problem. I noticed that my *Pull Request (PR) Validation* pipeline had significantly increased in execution time, nearing 10 minutes.

In addition, I had an occurrence when the Docker image build wasn’t taking into account the latest dependencies and consequently, with new code and related tests, the build would fail.

I noticed that the step `Install dependencies` was guilty.

Let’s see how I resolved the issue with the guidance of a colleague and expert in DevOps work.

## The Cause

I didn't find the root cause in my *Pull Request (PR) Validation* pipeline, but rather where I built the Docker image.

The guilty step in the second pipeline consisted of the following script:

```yaml
  - script: |
      python -m pip install --upgrade pip
      pip install -r requirements.txt
    displayName: 'Install dependencies'
```

This wouldn’t run on the PR trigger. It’d only run once I'd merge the code into `develop` when the pipeline building the new Docker image would be executed.

Another issue existed in the python version of my *Pull Request (PR) Validation* pipeline:

```yaml
  - task: UsePythonVersion@0
    inputs:
      versionSpec: '>=3.11'
      addToPath: true
```

So, if we had python `3.13` available, the build could run against a different python version over time, always equal or higher than `3.11`.

On the pipeline *Build Image For Deployment*, we strictly used python 3.11 so that it couldn't cause issues between my code and dependency incompatibilities.

That brings me to the better DevOps best practices.

## Which Best Practices

To guarantee consitent behavior on the development environments (your PC, mine, a VDI, production, etc.), the validation environments (e.g. the VM where Azure DevOps runs its agent to execute the unit tests, which is the present use case of this article) or in the deployment environments (e.g. QA, Production), we need a consistent baseline.

So first, in the problematic steps above, the *PR Validation* pipeline and the *Build Image For Deployment* pipeline used a different python version and would generate headaches, especially in tests.

Also, anytime I'd add a new package, the *PR Validation* pipeline would fail because the new code referenced the new package and it would throw an execution error. In fact, the Docker image used in that pipeline didn't yet contain the new package.

So let’s normalize the docker images.

## Creating the “Build Image For CI Purposes” Pipeline

The goal was to run the pipeline on triggers that would take into account file modification indicating that a new Docker image was needed.

### The `Dockerfile`

First, we needed a seperate `Dockerfile` from the `Dockerfile` used to build the application image. Just to avoid breaking the existing pipeline. However, we kept the almost some of the same content.

```yaml
# This docker file is used to optimize the CI process
# It uses the base that we use on the "Build Image For Deployment" pipeline

# This makes the python consitent.
FROM python:3.11-slim

# Install timezone data first
RUN apt-get update && apt-get install -y tzdata && rm -rf /var/lib/apt/lists/*

# Then set timezone
ENV TZ=Europe/Zurich
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

#set work directory early so remaining paths can be relative
WORKDIR /project-container

# Adding requirements file to current directory, e.g. /app
# just this file first to cache the pip install step when code changes
COPY requirements.txt .

# Install deps
RUN pip install -r requirements.txt
```

If you read [my initial article on deploying a Python application](../2024-07/deploy-a-rest-api-python-to-azure/), you’ll notice I simply removed all the code specific to the application we deploy.

### Build The New Pipeline

We then add the new pipeline definition under `.azure-pipelines` folder. I’ll explain the YAML code additions I made step-by-step. I took the *Build Image For Deployment* as a starting point. For the rest, please read my article quoted above.

The goal was to build an image not only for QA or production, but also when we had dependency changes in the application so that we could run new unit tests with the latest dependencies.

Here are the details.

First, we trigger the pipeline only if the `requirements.txt`, or `/docker/Dockerfile.ci` or `’/.azure-pipelines/ap-build-ci-container.yml'’ file changes. In fact, the image only changes when I add a dependency or modify the pipeline or the `Dockerfile`.

```yaml
name: Build_Image_For_CI_Purposes
trigger:
  paths:
    include:
      # The following are absolute paths to files
      # at the root of the project
      - 'requirements.txt'
      - '/docker/Dockerfile.ci'
      - '/.azure-pipelines/ap-build-ci-container.yml'
```

Next, let’s update the `imageRepository` variable to a distinct name. This is where we’ll store the images used for CI purposes.

```yaml
variables
  - name: imageRepository
    value: 'myapp-ci'
```

Next, we need to specify to use the new `Dockerfile`.

```yaml
variables:
  - name: dockerfilePath
    value: '$(Build.SourcesDirectory)/docker/Dockerfile.ci'
```

I removed the `semantic-version` variable, since we don’t need it the Docker image we’re setting up.

In the *Build and push stage* stage, we find the biggest changes.

First, we remove the semantic release version, not needed here, but we keep it for the other pipeline that takes care of creating the image we deploy to QA or production. 

Therefore, the task `Set version and image tags` is renamed `Set image tags` and the code executed becomes:

```yaml
            displayName: Set image tags
            inputs:
              targetType: 'inline'
              script: |
                if [ "$(Build.SourceBranch)" = "refs/heads/develop" ]; then
                  # Update build number for develop branch
                  echo "##vso[task.setvariable variable=build;isOutput=true]$(Build.BuildId)"
                  echo "##vso[task.setvariable variable=imageTags]ready-qa"
                  echo "imageTag is <ready-qa>"
                elif [ "$(Build.SourceBranch)" = "refs/heads/main" ]; then
                  echo "##vso[task.setvariable variable=imageTags]$(Build.BuildId),latest"
                  echo "imageTag is <latest>"
                else
                  echo "Build.SourceBranchName = <$(Build.SourceBranchName)>"
                  echo "Build.SourceBranch = <$(Build.SourceBranch)>"
                  # IMPORTANT:
                  # If branch naming convention changes, make sure to update ap-validate-pr-with-custom-image.yml too
                  echo "##vso[task.setvariable variable=imageTags]branch-$(echo "$(Build.SourceBranch)" | tr '/#' '-')"
                  echo "imageTag is <branch-$(Build.SourceBranch)>" 
                fi
            name: setImageTagsStep
```

Basically,

- If the `$(Build.SourceBranch)` is `develop`, then the image tag is `ready-qa`.
- If the `$(Build.SourceBranch)` is `main`, then the image tag is `latest`.
- Otherwise, we’re on a development branch and therefore the image tag is `branch-[branch name]`.

Remember: the pipeline runs **ONLY** if the trigger has a match. A new feature not triggering the pipeline when you push the related branch to the remote repository won’t trigger an update of the image when you merge the feature to `develop` or `main`.

The last change appears in the build task, where we remove the arguments passed to the build command containing the semantic version value.

```yaml
              arguments: --build-arg VERSION=$(setVersionStep.fullVersion)
```

Finally, we keep the *Push image to container registry* task as it is.

## Test the New Pipeline

First, you may need to merge into `develop` and `main` to add the pipeline to Azure DevOps. And, if it isn’t automatically picked up by Azure DevOps, follow those steps:

- Select *Pipelines* blade twice and click *New pipeline*.
- Select *Azure Repos Git*
- Select the repository that contains your YAML file
- Select *Existing Azure Pipelines YAML file*
- Select the file from `develop` branch
- Save to finish.

Then, to test it, you need to push a new branch to the repository with a change to `requirements.txt` (an extra space or comment will suffice). This should trigger the new pipeline.

Once the build ran successfully, you should see a new repository `myapp-ci` in the *Azure Container Registry (ACR)* with an image tagged `branch-[your branch name]`.

## Update the “PR Validation” Pipeline

Now that we have a Docker image, we can update the *PR Validation* pipeline to use the appropriate image from the `myapp-ci` ACR’s repository.

Again, I’ll explain the updates below.

### New Variables

First, add new variables that help pull the target image:

```yaml
  - name: dockerRegistryServiceConnection
    value: '[uid of dockerRegistryServiceConnection in DevOps]'
```

becomes:

```yaml
  # ARM = Azure Resource Manager type of service connection
  - name: armAppRegistration
    # Azure DevOps identifier, not a Azure Resource identifier
    value: '[app registration Id]' 
```

This is required in the first stage of the update *PR Validation* pipeline. This is due to the fact that there is extra step to read the ACR registry through the Azure CLI.

### New Stage

We need a new stage containing a step of type “`AzureCLI` script” that will help us save the image tag to use.

The script is just a bash script parsing the output of querying the Azure CLI.

```yaml
stages:
  - stage: PreTestsSteps
    displayName: Pre-Tests Steps
    jobs:
      - job: SetContainerTag
        displayName: Set the container tag to use in unit tests
        pool:
          vmImage: 'ubuntu-latest'
        steps:
          - task: AzureCLI@2
            inputs:
              azureSubscription: '$(armAppRegistration)'
              scriptType: 'bash'
              scriptLocation: 'inlineScript'
              inlineScript: |
                #!/bin/bash
                echo "System.PullRequest.SourceBranch = <$(System.PullRequest.SourceBranch)>"
                echo "Normalize the TAG_NAME..."
                # IMPORTANT:
                # If branch naming convention changes, make sure to update ap-build-ci-container.yml as well
                TAG_NAME="branch-$(echo "$(System.PullRequest.SourceBranch)" | tr '/#' '-')"
                echo $TAG_NAME
                REGISTRY_NAME="$(containerRegistry)"
                REPOSITORY_NAME="$(imageRepository)"
                
                if az acr repository show-tags --name $REGISTRY_NAME --repository $REPOSITORY_NAME --output tsv | grep -q "^$TAG_NAME$"; then
                  echo "Tag $TAG_NAME exists in repository $REPOSITORY_NAME"
                  echo "##vso[task.setvariable variable=imageTag;isOutput=true]$TAG_NAME"
                else
                  echo "Tag $TAG_NAME does not exist in repository $REPOSITORY_NAME"
                  echo "##vso[task.setvariable variable=imageTag;isOutput=true]ready-qa"              
                fi
            name: setImageTag
            displayName: 'Set image tag'
            condition: always() # Continue even if it fails
```

Then, we use the `imageTag` variable in the next stage:

```yaml
    jobs:
      - job: ExecuteUnitTests
        displayName: Execute Unit Tests
        pool:
          vmImage: 'ubuntu-latest'
        # Initialize the container to use in the job from previous stage.
        container:
          image: "$(containerRegistry)/$(imageRepository):$(imageTag)"
          endpoint: mycontainerregistry.azurecr.io
        # Then run the job's steps (nothing changes beyond this point)
        steps:
        # ...
```

## Test the Updated Pipeline

To test, you might need to merge to `develop` first and test that the appropriate image is successfully pulled and the unit tests are run without any issue.

Try with and without a change to the three files marked as trigger to validate the whole process.

## Conclusion

Now, your pull request workflow handles both developments that change the dependencies or CI or none.

With that, you don’t need to worry about ever having to run unit tests against an outdated Docker image nor think about having the image ready before that.

As a bonus, you only create new up-to-date Docker images when *it’s needed*. A logical next step would be to [update the automation account](../../2024-10/build-your-own-acr-retention-policy/index.md) that cleans up the repository of obsolete images. Can you do it?

{{< blockcontainer jli-notice-tip "Follow me">}}

Thanks for reading this article. Make sure to [follow me on X](https://x.com/LitzlerJeremie), [subscribe to my Substack publication](https://iamjeremie.substack.com/) and bookmark my blog to read more in the future.

{{< /blockcontainer >}}
