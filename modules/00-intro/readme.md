**Git Setup (First Time)**

**Prerequisite** - Hope the Git tool is installed on your system, *if not please download & install platform specific from* [git-scm](https://git-scm.com/downloads).

After the `git` has been installed bunch of things that you need to do

Let’s set up the Git environment

First set your identity, your name and email address - Every git commit uses this information 
```bash
"FirstName, LastName <Author Email Address>"

(or)

"LastName, FirstName <Author Email Address>"
```

Open a ***Terminal/Shell/Command Prompt/WSL2 Terminal/PowerShell/Git Bash*** & type:

**System Level - Setup (Global)**

```bash
git config --global user.name "John Doe"
git config --global user.email john.doe@test.com
```

**Optional - User Level - Setup (System)**

```bash
git config --system user.name "John Doe"
git config --system user.email john.doe@test.com
```