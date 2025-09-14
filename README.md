### ***Majorily overcomplicated, and overly sophisticated...***
#### Personal portfolio website with an "on-board" **bash** shell emulator written in plain **JS*

---



>The main idea was that the "bash terminal" would serve
>as the main interface that the user would interact with...
>
>But then I thought to myself, *`Wouldn't it be cool if it would accually work like a terminal?`* </br>
>...and that's how we got here.
>
>The whole environment is in "read-only" mode, meaning any action that would result in changes on the system, </br> 
>file tree or the environment itself will always return permission denied...
>
>Never the less, i tried to keep this illusion as close to the real thing as possible.

*`*Make note that not all features listed below may be implemented when you're seeing this.`*

---

### Preview for the index page im working on can be found under this link
https://olszewski.ink/indexv3-1.html


## This project features:
- A poor man's markdown parser written in TypeScript
- A file system represented via a JSON object with support for:
  - Permissions
  - Last mod time
  - Hidden flag
  - Symlinks
  - User & Group ownership
    
- A seperate tool written in C# to parse said JSON object from physical folders on the system
- Laughably small set of commands where half of them don't do shit because the environment is in "read-only" mode
- Hellishly overcomplicated input method *'because i wanted nice animation'*
- Extravagantly retarded plain css stylesheet

---

## List of the available commands:
(more information about their use with -h)

- cd
- ls
- echo
- touch
- mkdir
- pwd
- exit
- cp
- mv
- rmdir
- cat
- dir
- less
- chmod
- chown
- rm
- help
- return
- clear
- su
- reboot
---

 ![Favicon of the website](/favico.png)


