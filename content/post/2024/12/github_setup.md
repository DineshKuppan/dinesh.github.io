---
title: "Git Setup: First Time Configuration Guide"
date: 2024-12-22T01:53:00+05:30
description: "A comprehensive guide to setting up Git for the first time, including user configuration and essential setup steps for developers."
tags: [git, setup, development, guide]
categories: ["setup", "git", "productivity", "development"]
---

## Git Setup (First Time)

**Prerequisite** - Hope the Git tool is installed on your system, *if not please download & install platform specific from* [git-scm](https://git-scm.com/downloads).

After the `git` has been installed bunch of things that you need to do

## Setting Up Your Git Environment

First set your identity, your name and email address - Every git commit uses this information 
```bash
"FirstName, LastName <Author Email Address>"

(or)

"LastName, FirstName <Author Email Address>"
```

Open a ***Terminal/Shell/Command Prompt/WSL2 Terminal/PowerShell/Git Bash*** & type:

## System Level - Setup (Global)

```bash
git config --global user.name "John Doe"
git config --global user.email john.doe@test.com
```

## Optional - User Level - Setup (System)

```bash
git config --system user.name "John Doe"
git config --system user.email john.doe@test.com
```

## Verification

After setting up your Git configuration, you can verify your settings by running:

```bash
git config --list
```

This will display all your Git configuration settings, including the user name and email you just configured.

## Next Steps

With Git properly configured, you're ready to start using version control for your projects. You can now:

- Initialize new repositories with `git init`
- Clone existing repositories with `git clone`
- Start tracking changes in your code

For more advanced Git usage and workflows, check out the official [Git documentation](https://git-scm.com/doc).