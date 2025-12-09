---
title: "How to Efficiently Update Scoop’s Apps"
description: "It helps to stay up-to-date and we can achieve it using a PowerShell script."
image: 2025-12-08-a-man-and-a-woman-scooping-into-a-watermelon.jpg
imageAlt: A man and a woman scooping into a watermelon
date: 2025-12-08
categories:
  - Tools
tags:
  - PowerShell
---

I love [Scoop.sh](https://scoop.sh/)! It provides almost all the applications I need.

But updating them isn’t super friendly. Let’s see together how I managed to update all the outdated apps in (almost) one command line.

## Scoop `update` and Scoop `status`

Before we start, the prerequisite is to make sure Scoop is up itself up-to-date using the `update` command:

```powershell
scoop update
```

Then, to know which applications need an update, the following command lists them for us:

```powershell
scoop status
```

The typical output would be:

```plaintext
Name      Installed Version        Latest Version         Missing Dependencies Info
----      -----------------        --------------         -------------------- ----
find-java 17                       19
nodejs    23.6.0                   23.7.0
picpick   7.2.9                    7.3.0
pycharm   2024.3.1.1-243.22562.220 2024.3.2-243.23654.177
python312 3.12.7                   3.12.8
signal    7.37.0                   7.40.1
supabase  2.6.8                    2.9.6
terraform 1.10.4                   1.10.5
vscode    1.96.3                   1.96.4
```

## Create the Starting Point

Let’s create a PowerShell file called `scoop-auto-update-apps.ps1`.

The first lines are:

```powershell
    # Always run scoop update to refresh the database
    Write-Host "Refreshing Scoop database..." -ForegroundColor Cyan
    scoop update

    # Get the status output and parse it
    Write-Host "Checking for outdated apps..." -ForegroundColor Cyan
    $statusOutput = scoop status
```

What does `$statusOutput’ contain?

```plaintext
@{Name=find-java; Installed Version=17; Latest Version=19; Missing Dependencies=; Info=} @{Name=nodejs; Installed Version=23.6.0; Latest Version=23.7.0; Missing Dependencies=; Info=} @{Name=picpick; Installed Version=7.2.9; Latest Version=7.3.1; Missing Dependencies=; Info=} @{Name=pycharm; Installed Version=2024.3.1.1-243.22562.220; Latest Version=2024.3.2-243.23654.177; Missing Dependencies=; Info=} @{Name=python312; Installed Version=3.12.7; Latest Version=3.12.8; Missing Dependencies=; Info=} @{Name=signal; Installed Version=7.37.0; Latest Version=7.40.1; Missing Dependencies=; Info=} @{Name=supabase; Installed Version=2.6.8; Latest Version=2.9.6; Missing Dependencies=; Info=} @{Name=terraform; Installed Version=1.10.4; Latest Version=1.10.5; Missing Dependencies=; Info=} @{Name=vscode; Installed Version=1.96.3; Latest Version=1.96.4; Missing Dependencies=; Info=}
```

It corresponds to a list of objects of the applications to update. Let’s see one example:

```
@{Name=find-java; Installed Version=17; Latest Version=19; Missing Dependencies=; Info=}
```

## Extract the Application Name

To extract the application name, we’ll use a regular expression:

```powershell
# Extract app names using regex
    $updatableApps = $statusOutput | ForEach-Object {
        if ($_ -match 'Name=([^;]+)') {
            $matches[1]
        }
    }
```

Note: `$_` equals to the current object of the list being parsed.

We’re checking the pattern `Name=([^;]+)` against the entire object string, and the regular expression captures just the value after `Name=` and before the semicolon, which gives us the app name we want.

Then, the `$matches` is an automatic variable in PowerShell that gets populated when using the `-match` operator with regular expression groups (marked by parentheses in the pattern).

When using the pattern `Name=([^;]+)`:

- `$matches` contains the entire matched string (e.g., `Name=find-java`)
- `$matches` contains what was captured in the first group `()` (e.g., `find-java`)

Here’s an example to illustrate:

```powershell
$text = "@{Name=find-java; Installed Version=17; Latest Version=19; Missing Dependencies=; Info=}"
if ($text -match 'Name=([^;]+)') {
    Write-Host "Full match: $($matches[0])"     # Output: Name=find-java
    Write-Host "Group 1: $($matches[1])"        # Output: find-java
}

```

We use `$matches` because we want just the app name without the `Name=` prefix.

## Checking That We Have No Application To Update

Next, let’s just check the `scoop status` output parsing results in a list of applications.

If not, let’s end the execution:

```powershell
# Check if there are apps to update
if ($updatableApps.Count -eq 0) {
    Write-Host "No apps need updating." -ForegroundColor Green
    return
}
```

## Print Out the List of Applications to Update

For the sake of giving feedback to the user, let’s print the list:

```powershell
Write-Host "The following apps will be updated:" -ForegroundColor Yellow
$updatableApps | ForEach-Object { Write-Host "- $_" }
```

## Run the Update Command per Application

Now, we’re ready to update the outdated applications. Let’s loop over the `$updatableApps` and run `scoop update $app`:

```powershell
Write-Host "`nUpdating apps..." -ForegroundColor Cyan
foreach ($app in $updatableApps) {
    Write-Host "Updating $app..." -ForegroundColor Yellow
    scoop update $app
}
```

## Adding a `--dry-run` option

OK, now, I always like to execute any script with a `--dry-run` to check what will happen before it’s really executed.

Let’s wrap the code so far in a function:

```powershell
function Update-ScoopApps {
    param (
        [switch]$DryRun
    )
	# The rest of the code so far...
}
```

And add at the bottom of the script a function call that handles the dry run option:

```powershell
# Call the function with optional --dry-run parameter
if ($args -contains "--dry-run") {
    Update-ScoopApps -DryRun
} else {
    Update-ScoopApps
}
```

Next, in the function body, let’s add the dry run check just before the last loop that calls `scoop update $app`:

```powershell
    if ($DryRun) {
        Write-Host "`DRY RUN: Updates would be performed for the above apps" -ForegroundColor Yellow
        return
    }

    Write-Host "`Updating apps..." -ForegroundColor Cyan

```

## What Isn’t Included

Sometimes, Scoop tells you you need to run a registry command for contextual menus or co. This script doesn’t yet handle that.

You’ll need to copy those commands and run them individually.

Also, the script doesn’t allow skipping an application update if you need to keep the current installed version enabled. I’d say that we’d need a `--skip "app1 app2 ..."` option for that.

## Conclusion

There you have it! You can update your Scoop applications with a single command:

```powershell
.\scoop-auto-update-apps.ps1
```

The full script is available [in this GitHub gist](https://gist.github.com/JeremieLitzler/d0d66e25ee843697855f1509b6770ed9). Enjoy!

{{< blockcontainer jli-notice-tip "Follow me">}}

Thanks for reading this article. Make sure to [follow me on X](https://x.com/LitzlerJeremie), [subscribe to my Substack publication](https://iamjeremie.substack.com/) and bookmark my blog to read more in the future.

{{< /blockcontainer >}}

Photo by [Yan Krukau](https://www.pexels.com/photo/a-couple-scooping-fresh-watermelon-with-spoons-5216257/).
