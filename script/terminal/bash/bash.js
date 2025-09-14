class Bash {
    constructor() {
        
        // Object.entries(bash.commands)[0][0] // Get command name string where -> [0][] is the command index
    
        this.vfs = new VirtualFS({ user: 'kamil' });
        this.history = [];
        this.helpArgs = ['-h', '-help', '--help'];

        this.commands = {
            return: {
              method: this.cmd_return,
              flags: [],
              help: 'Help about this command',
            },
            ls: {
              method: this.cmd_ls,
              flags: [],
              help: './help/ls.md',
            },
            echo: {
              method: this.cmd_echo,
              flags: [],
              help: '',
            },
            touch: {
              method: this.cmd_touch,
              flags: [],
              help: '',
            },
            mkdir: {
              method: this.cmd_mkdir,
              flags: [],
              help: '',
            },
            pwd: {
              method: this.cmd_pwd,
              flags: [],
              help: '',
            },
            cd: {
              method: this.cmd_cd,
              flags: [],
              help: '',
            },
            exit: {
              method: this.cmd_exit,
              flags: [],
              help: '',
            },
            cp: {
              method: this.cmd_cp,
              flags: [],
              help: '',
            },
            mv: {
              method: this.cmd_mv,
              flags: [],
              help: '',
            },
            rmdir: {
              method: this.cmd_rmdir,
              flags: [],
              help: '',
            },
            cat: {
              method: this.cmd_cat,
              flags: [],
              help: '',
            },
            dir: {
              method: this.cmd_dir,
              flags: [],
              help: '',
            },
            less: {
              method: this.cmd_less,
              flags: [],
              help: '',
            },
            chown: {
              method: this.cmd_chown,
              flags: [],
              help: '',
            },
            chmod: {
              method: this.cmd_chmod,
              flags: [],
              help: '',
            },
            reboot: {
              method: this.cmd_reboot,
              flags: [],
              help: '',
            },
            help: {
              method: this.cmd_help,
              flags: [],
              help: '',
            },
            rm: {
              method: this.cmd_rm,
              flags: [],
              help: '',
            },
            sudo: {
              method: this.cmd_sudo,
              flags: [],
              help: '',
            },
            su: {
              method: this.cmd_su,
              flags: [],
              help: '',
            },
            clear: {
              method: this.cmd_clear,
              flags: [],
              help: '',
            },
        };   
    }

    appendNewPointerResult(path, input, output) {
        const newInput = document.createElement('p');
        const newResult = document.createElement('div');
        const target = document.querySelector('.inner-content');
        const parser = new DOMParser();
        const doc = parser.parseFromString(output, 'text/html');
        const out = doc.body.firstElementChild; //grab first and only parsed dom content element that got parsed from text

        newResult.classList.add('pointer-result');
        newInput.innerHTML = path + '<br>$ ' +  this.history[0];
        newInput.classList.add('command');
        out.classList.add('output');

        newResult.appendChild(newInput);
        newResult.appendChild(out);

        target.insertBefore(newResult, target.children[target.children.length - 2]);
        if(target.children.length > 7)
        target.removeChild(target.children[0]);
    }

    clearTerminal(){ 
        const target = document.querySelector('.inner-content');
        if(target.children.length > 2) [...target.children].slice(0, target.children.length - 2).forEach(child => target.removeChild(child));
        else return;
    }

    fetchHelpData = command => (this.commands[command].help ? this.commands[command].help : '404');

    async printCommandHelp(command, args) {
        const div = document.createElement('div');
        let path = this.fetchHelpData(command);
        if(path !== '404') {
            let something = await this.parseMarkdown(path);
            div.innerHTML = something;
        }
        else div.innerHTML = '<p>No help for this command</p>';
        console.log(div.outerHTML);
        this.appendNewPointerResult(this.vfs.formatPath(this.vfs.pathArrayToString(this.vfs.cwd)), command + ' ' + args, div.outerHTML);
    }

    async parseMarkdown(filepath) {
        const { Parser } = await import('../parser/parser.js');
        const parser = new Parser();
        const out = await parser.parseFile(filepath);
        console.log(out);
        return out;
    }

    updateCurrentPath = () => 
        (document.getElementById('cwd').innerText = this.vfs.formatPath(this.vfs.pathArrayToString(this.vfs.cwd)),
            document.querySelector('.terminal-title').innerText = 'kamil@terminal: ' + this.vfs.formatPath(this.vfs.pathArrayToString(this.vfs.cwd))
        );

    parseInput(input) {
        const result = [];
        let current = '';
        let inQuotes = false;
        let quoteChar = '';
        input = input.toLowerCase();
        for(let i = 0; i < input.length; i++) {
            const char = input[i];

            if ((char === '"' || char === "'") && !inQuotes) {
                inQuotes = true;
                quoteChar = char;
                continue;
            } else if (char === quoteChar && inQuotes) {
                inQuotes = false;
                quoteChar = '';
                continue;
            }

            if (char === ' ' && !inQuotes) {
                if (current !== '') {
                    result.push(current);
                    current = '';
                }
            }
            else {
                current += char;
            }
            
        }
        if (current !== '') result.push(current);
            return result;
    }

    runCommand(input) {
        if (this.history.length = 16) {
            this.history.unshift(...this.history.splice(-1));
            this.history[0] = input;
        } else {
            this.history.push(input);
            this.history.unshift(...this.history.splice(-1));
        }
        const parts = this.parseInput(input);
        if (parts.length === 0) return;

        const command = parts[0];
        const args = parts.slice(1);


        if (!this.commands[command]) {
            this.throwError('none', command, args);
            return;
        }
        const cmdFunc = this.commands[command].method;
        cmdFunc.call(this, args, command);
    }

    throwError(errorType, command, args) {
        switch(errorType) {
            case 'readonly':
                var p = document.createElement('p');
                if(command === 'touch') p.innerText = `${command}: cannot touch '${args}': Permission denied`;
                if(command === 'mv') p.innerText = `${command}: cannot stat '${args}': Permission denied`;
                else p.innerText = `${command} ${args}: Permission denied`;
                this.appendNewPointerResult(this.vfs.formatPath(this.vfs.pathArrayToString(this.vfs.cwd)), command + (args ? ` ${args}` : null), p.outerHTML);
                break;
            case 'nofileordir':
                var p = document.createElement('p');
                p.innerText = `${command}: ${args}: No such file or directory`;
                this.appendNewPointerResult(this.vfs.formatPath(this.vfs.pathArrayToString(this.vfs.cwd)), command + (args ? ` ${args}` : null), p.outerHTML);
                break;
            case 'notadir':
                var p = document.createElement('p');
                p.innerText = `${command}: ${args}: Not a directory`;
                this.appendNewPointerResult(this.vfs.formatPath(this.vfs.pathArrayToString(this.vfs.cwd)), command + (args ? ` ${args}` : null), p.outerHTML);
                break;
            case 'toomanyargs':
                var p = document.createElement('p');
                p.innerText = `${command}: Too many arguments`;
                this.appendNewPointerResult(this.vfs.formatPath(this.vfs.pathArrayToString(this.vfs.cwd)), command + (args ? ` ${args}` : null), p.outerHTML);
                break;
            case 'notafile':
                break;
            case 'noarg':
                var p = document.createElement('p');
                p.innerHTML = `${command}: missing file operand<br> Try '${command} --help' for more information.`;
                this.appendNewPointerResult(this.vfs.formatPath(this.vfs.pathArrayToString(this.vfs.cwd)), command + (args ? ` ${args}` : ""), p.outerHTML);
                break;
            case 'badarg':
                var p = document.createElement('p');
                p.innerHTML = `${command}: invalid option -- '${args.toString().replaceAll('-', '')}'<br> Try '${command} --help' for more information.`;
                this.appendNewPointerResult(this.vfs.formatPath(this.vfs.pathArrayToString(this.vfs.cwd)), command + (args ? ` ${args}` : ""), p.outerHTML);
                break;
            case 'nosource':
                var p = document.createElement('p');
                p.innerHTML = `${command}: cannot stat '${args[0]}': No such file or directory`
                console.log(args.toString());
                this.appendNewPointerResult(this.vfs.formatPath(this.vfs.pathArrayToString(this.vfs.cwd)), command + (args ? ` ${args}` : ""), p.outerHTML);
                break;
            case 'noargafter':
                var p = document.createElement('p');
                p.innerHTML = `${command}: missing destination file operand after '${args[0]}'<br> Try '${command} --help' for more information.`;
                this.appendNewPointerResult(this.vfs.formatPath(this.vfs.pathArrayToString(this.vfs.cwd)), command + (args ? ` ${args}` : ""), p.outerHTML);
                break;
            default: 
            var p = document.createElement('p');
            p.innerHTML = `bash: ${command}: command not found`
            this.appendNewPointerResult(this.vfs.formatPath(this.vfs.pathArrayToString(this.vfs.cwd)), command + (args ? ` ${args}` : ""), p.outerHTML);
            break;
        }
    }

//#region Command Methods

    cmd_cd(args, command) {
        const path = args[0];
        let targetNode;
        
        if (args.length === 0) {
            this.vfs.cwd = this.vfs.home;
            return;
        }
        
        if (args[0] === '-') {
            const temp = this.vfs.cwd;
            this.vfs.cwd = this.vfs.prevDir;
            this.vfs.prevDir = temp;
            this.updateCurrentPath();
            var p = document.createElement('p');
            this.appendNewPointerResult(this.vfs.formatPath(this.vfs.pathArrayToString(temp)), command + ` ${args}`, p.outerHTML);
            return;
        }
        
        let resolvedPath = path.startsWith("~")
        ? path.replace("~", this.vfs.pathArrayToString(this.vfs.home))
        : path;

        this.vfs.prevDir = this.vfs.cwd;
        targetNode = this.vfs._getNodeByPathArray(this.vfs.resolvePath(resolvedPath));
        if(!targetNode) {
            this.throwError('nofileordir', command, args);
            return;
        }
        if(targetNode.type !== 'dir') {
            this.throwError('notadir', command, args);
            return;
        }
        if(targetNode.readonly) {
            this.throwError('readonly', command, args);
            return;
        }
        if(args.length > 1) {
            this.throwError('toomanyargs', command, args);
            return;
        }

        var p = document.createElement('p');
        this.appendNewPointerResult(this.vfs.formatPath(this.vfs.pathArrayToString(this.vfs.cwd)), command + ` ${args}`, p.outerHTML);
        this.vfs.cwd = this.vfs.resolvePath(resolvedPath);
        this.updateCurrentPath();
    }
    cmd_ls(args, command) {
        const flags = ['a', 'l', 'h', '--help']
        const paths = [];
        const options = {
            all: false, // -a
            long: false, // -l
            help: false
        };

        for (let i = 0; i < args.length; i++) {
            const arg = args[i];
            if(arg.startsWith('--') && arg.length > 2) {
                options.help = true;
                break;
            }
            if(arg.startsWith('-') && arg.length > 1) {
                for(let j = 1; j < arg.length; j++) {
                    const flag = arg[j];
                    if(!flags.includes(flag)) {
                        this.throwError('badarg', command, arg);
                        return;
                    }
                    if(arg.includes('a')) options.all = true;
                    if(arg.includes('l')) options.long = true;
                    if(arg.includes('h')) options.help = true;
                }
            } else {
                paths.push(arg);
            }
        }

        if (options.help) {
            this.printCommandHelp(command, args);
            return;
        }   

        if (paths.length > 1) {
            this.throwError('toomanyargs', command, args.join(' '));
            return;
        }

        const pathArg = paths.length === 0 ? this.vfs.cwd : paths[0];
        let targetNode;

        try { 
            targetNode = this.vfs._getNodeByPathArray(pathArg);
        } catch {
            this.throwError('nofileordir', command, pathArg);
            return;
        }

        if(targetNode.type === 'file') {
            this.appendNewPointerResult(this.vfs.formatPath(this.vfs.pathArrayToString(this.vfs.cwd)), command + ' ' + args.join(' '), targetNode.name);
            return;
        }

        let entries = Object.entries(targetNode.entries || {}).map(([name, node]) => {
            return { name, ...node }
        });

        if(!options.all) {
            entries = entries.filter(e => !e.name.startsWith('.'));
        }

        entries.sort((a, b) => a.name.localeCompare(b.name));
        
        if(options.long) {
            const wrapper = document.createElement('div');
            wrapper.classList.add('dirs');
            const ul = document.createElement('ul');
            const pTotal = document.createElement('p');
            pTotal.classList.add('total');

            //pTotal.innerText = 'total ' + Object.keys(this.vfs._getNodeByPathArray(this.vfs.cwd).entries).length;  
            pTotal.innerText = 'total ' + (options.all ? 
                Object.keys(this.vfs._getNodeByPathArray(this.vfs.cwd).entries).length :
                    Object.keys(this.vfs._getNodeByPathArray(this.vfs.cwd).entries).filter(([key]) => !key.startsWith('.')).length);

            wrapper.appendChild(pTotal);

            if(options.all) {
                const li = document.createElement('li');
                li.classList.add('folders');

                const perm = document.createElement('p');
                perm.classList.add('permission');
                perm.innerText = 'drwx--r--r ';
                li.appendChild(perm);

                const size = document.createElement('p');
                size.classList.add('folder-contents');
                size.innerText = Object.keys(this.vfs._getNodeByPathArray(this.vfs.cwd).entries).length;
                li.appendChild(size);

                const userPerm = document.createElement('p');
                userPerm.classList.add('user-permission');
                userPerm.innerText = 'kamil users  ';
                li.appendChild(userPerm);

                const a = document.createElement('a');
                a.classList.add('project-name', 'folder-type');

                a.innerText = '.';
                li.appendChild(a);

                const li2 = document.createElement('li');
                li2.classList.add('folders');

                const perm2 = document.createElement('p');
                perm2.classList.add('permission');
                perm2.innerText = 'drwx--r--r ';
                li2.appendChild(perm2);

                const size2 = document.createElement('p');
                size2.classList.add('folder-contents');
                size2.innerText = Object.keys(this.vfs._getNodeByPathArray(this.vfs.cwd.slice(0, -1)).entries).length;
                li2.appendChild(size2);

                const userPerm2 = document.createElement('p');
                userPerm2.classList.add('user-permission');
                userPerm2.innerText = 'kamil users  ';
                li2.appendChild(userPerm2);

                const a2 = document.createElement('a');
                a2.classList.add('project-name', 'folder-type');

                a2.innerText = '..';
                li2.appendChild(a2);
                ul.appendChild(li);
                ul.appendChild(li2);   
            }

            entries.forEach(e => {
                
                const li = document.createElement('li');
                li.classList.add('folders');
                
                const perm = document.createElement('p');
                perm.classList.add('permission');
                perm.innerText = (e.permission ? e.permission : (e.type === 'dir' ? 'd' : '-') + 'rwx--r--r' + (() => {
                    const sizeNum = e.size ?? Object.keys(this.vfs._getNodeByPathArray(this.vfs.cwd).entries).length;
                    return (sizeNum.toString().length === 1 ? ' ' : '');
                })());
                li.appendChild(perm);

                const size = document.createElement('p');
                size.classList.add('folder-contents');
                size.innerText = (e.size ? e.size : (e.type === 'dir' ? (e.size ? e.size : Object.keys(this.vfs._getNodeByPathArray(this.vfs.cwd).entries).length)  : '1'));
                li.appendChild(size);

                const userPerm = document.createElement('p');
                userPerm.classList.add('user-permission');
                userPerm.innerText = (e.userpermission ? e.userpermission : 'kamil users  ');
                li.appendChild(userPerm);

                if(e.interactible || false) {
                    const a = document.createElement('a');
                    a.classList.add('project-name', ...(e.type === 'dir' ? ['folder-type'] : []));
                    a.innerText = e.name;
                    a.href = e.href ? e.href : '';
                    li.appendChild(a);
                } else {
                    const p = document.createElement('p');
                    p.classList.add('project-name', ...(e.type === 'dir' ? ['folder-type'] : []));
                    p.innerText = e.name;
                    li.appendChild(p);
                }
                ul.appendChild(li);
            });
            wrapper.appendChild(ul);
            this.appendNewPointerResult(this.vfs.formatPath(this.vfs.pathArrayToString(this.vfs.cwd)), command + ' ' + args.join(' '), wrapper.outerHTML);
        } else {
            let output = '';
            entries.forEach(e => {
                output += e.name + ' ';
            });
            const p = document.createElement('p');
            p.innerText = output.trim();
            this.appendNewPointerResult(this.vfs.formatPath(this.vfs.pathArrayToString(this.vfs.cwd)), command + ' ' + args.join(' '), p.outerHTML)
        }
    }
    cmd_echo(args, command) {
        const parts = [];
        const inQuotes = false;
        const options = {
            newlines: true, //process newlines
            escapes: false //process escapes
        };
        args.forEach(arg => {
            if(arg.startsWith('-')) {
                if(arg.includes('n')) options.newlines = false;
                if(arg.includes('e')) options.escapes = true;
            } 
        });




    }
    cmd_touch(args, command) {
        const options = {
            help: false
        }

        if(args.length === 0) {
            this.throwError('noarg', command, args);
            return;
        }

        for(let i = 0; i < args.length; i++) {
            const arg = args[i];
            if(arg.startsWith('-')) {
                if(this.helpArgs.includes(arg)) options.help = true;
                else {
                    this.throwError('badarg', command, args);
                    return;
                }
            }
        }

        if(options.help) {
            this.printCommandHelp(command, args);
            return;
        }

        this.throwError('readonly', command, args);
    }
    cmd_mkdir(args, command) {
        const options = {
            help: false
        }

        if(args.length === 0) {
            this.throwError('noarg', command, args);
            return;
        }

        for(let i = 0; i < args.length; i++) {
            const arg = args[i];
            if(arg.startsWith('-')) {
                if(this.helpArgs.includes(arg)) options.help = true;
                else {
                    this.throwError('badarg', command, args);
                    return;
                }
            }
        }

        if(options.help) {
            this.printCommandHelp(command, args);
            return;
        }

        this.throwError('readonly', command, args);

    }
    cmd_pwd(args, command) {
        if(args.length > 0) {
            this.throwError('toomanyargs', command, args);
            return;
        }
        const path = this.vfs.pathArrayToString(this.vfs.cwd);
        console.log(path);
        const p = document.createElement('p');
        p.innerHTML = this.vfs.formatPath(path);
        this.appendNewPointerResult(this.vfs.formatPath(this.vfs.pathArrayToString(this.vfs.cwd)), command, p.outerHTML);
    }
    cmd_exit(args, command) {
        const options = {
            help: false
        }

        for(let i = 0; i < args.length; i++) {
            const arg = args[i];
            if(arg.startsWith('-')) {
                if(this.helpArgs.includes(arg)) options.help = true;
                else {
                    break;
                }
            }
        }

        if(options.help) {
            this.printCommandHelp(command, args);
            return;
        }

        window.location.href = 'https://google.com';

    }
    cmd_cp(args, command) {
        let sourceNode;
        const options = {
            help: false
        }

        if(args.length === 0) {
            this.throwError('noarg', command, args);
            return;
        }

        for(let i = 0; i < args.length; i++) {
            const arg = args[i];
            if(arg.startsWith('-')) {
                if(this.helpArgs.includes(arg)) options.help = true;
                else {
                    this.throwError('badarg', command, args);
                    return;
                }
            }
        }

        if(options.help) {
            this.printCommandHelp(command, args);
            return;
        }

        if(args.length === 1) {
            this.throwError('noargafter', command, args);
            return;
        } else if(args.length > 2) {
            this.throwError('toomanyargs', command, args);
            return;
        }

        let resolvedSource = args[0].startsWith("~")
        ? args[0].replace("~", this.vfs.pathArrayToString(this.vfs.home))
        : args[0];

        sourceNode = this.vfs._getNodeByPathArray(this.vfs.resolvePath(resolvedSource));
        if(!sourceNode) {
            this.throwError('nosource', command, args);
            return;
        }

        this.throwError('readonly', command, args);
        return;
    }
    cmd_mv(args, command) {
        let sourceNode;
        const options = {
            help: false
        }

        if(args.length === 0) {
            this.throwError('noarg', command, args);
            return;
        }

        for(let i = 0; i < args.length; i++) {
            const arg = args[i];
            if(arg.startsWith('-')) {
                if(this.helpArgs.includes(arg)) options.help = true;
                else {
                    this.throwError('badarg', command, args);
                    return;
                }
            }
        }

        if(options.help) {
            this.printCommandHelp(command, args);
            return;
        }

        if(args.length === 1) {
            this.throwError('noargafter', command, args);
            return;
        } else if(args.length > 2) {
            this.throwError('toomanyargs', command, args);
            return;
        }

        let resolvedSource = args[0].startsWith("~")
        ? args[0].replace("~", this.vfs.pathArrayToString(this.vfs.home))
        : args[0];

        sourceNode = this.vfs._getNodeByPathArray(this.vfs.resolvePath(resolvedSource));
        if(!sourceNode) {
            this.throwError('nosource', command, args);
            return;
        }

        this.throwError('readonly', command, args);
        return;
    }
    cmd_rmdir(args, command) {
        let targetNode;
        const options = {
            help: false
        }

        if(args.length === 0) {
            this.throwError('noarg', command, args);
            return;
        }

        for(let i = 0; i < args.length; i++) {
            let arg = args[i];
            if(arg.startsWith('-')) {
                if(this.helpArgs.includes(arg)) options.help = true;
                else {
                    this.throwError('badarg', command, args);
                    return;
                } 
            }
        }

        if(options.help) {
            this.printCommandHelp(command, args);
            return;
        }

        let resolvedTarget = args[0].startsWith("~")
        ? args[0].replace("~", this.vfs.pathArrayToString(this.vfs.home))
        : args[0];

        targetNode = this.vfs._getNodeByPathArray(this.vfs.resolvePath(resolvedTarget));
        if(!targetNode || targetNode.type !== 'dir') {
            this.throwError('nofileordir', command, args);
            return;
        }

        this.throwError('readonly', command, args);
        return;

    }
    cmd_cat(args, command) {
        let targetNode;
        const options = {
            help: false
        } 

        if (args.length === 0) {
            this.errorType('noarg', command, args);
            return;
        }

        for(let i = 0; i < args.length; i++) {
            arg = args[i];
            if(arg.startsWith('-')) {
                if(this.helpArgs.includes(arg)) options.help = true;
                
            }
        }
    }
    cmd_dir() {
        
    }
    cmd_less() {
        
    }
    cmd_chmod() {
        
    }
    cmd_chown() {
        
    }
    cmd_rm() {

    }
    cmd_help() {

    }
    cmd_return() {

    }
    cmd_clear = this.clearTerminal;
    cmd_sudo() {

    }
    cmd_su() {

    }
    cmd_reboot() {
        TerminalReboot();
    }

//#endregion

}

class VirtualFS {
    constructor(options) {
        options = options || {};
        const user = options.user || 'kamil';

        try {
            const response = fetch('/script/terminal/fs.json');
            this.rootDir = response.json();
            
        } catch (error) {
            throw new Error('There was an error', { cause: error })
        }

        this.cwd = ['/', 'home', user];
        this.home = ['/', 'home', user];
        this.prevDir = this.cwd;

        this._ensureDirectoryPath(this.home);
    }

    _splitPathString(pathString) {
        if (pathString === '/') return ['/'];
        const raw = pathString.split('/');
        const parts = [];
        for(let i = 0; i < raw.length; i++) {
            if (raw[i].length > 0) parts.push(raw[i]);
        }
        return parts;
    }

    _isAbsolutePath(pathString) {
        return typeof pathString === 'string' && pathString.startsWith('/');
    }

    pathArrayToString(pathArray) {
        if(!Array.isArray(pathArray)) return '/';
        if (pathArray.length === 1 && pathArray[0] === '/') return '/';
        return '/' + pathArray.slice(1).join('/');
    }

    formatPath = pathString => 
        (prefix => pathString.startsWith(prefix) ? pathString.replace(prefix, '~') : pathString)(this.pathArrayToString(this.home));

    resolvePath(pathString) {
        if (pathString === '' || pathString === undefined || pathString === null) {
            return this.cwd.slice();
        }

        if(pathString.startsWith('/') && pathString.length === 1) {
            return ['/'];
        }

        if (pathString.startsWith('~')) {
            const trail = pathString === '~' ? '' : pathString.slice(1);
            const homeStr = this.pathArrayToString(this.home);
            pathString = homeStr + (trail ? (trail.startsWith('/') ? '' : '/') + trail : '');
        }

        const start = this._isAbsolutePath(pathString) ? ['/'] : this.cwd.slice();
        const parts = this._splitPathString(pathString);

        for (let i = 0; i < parts.length; i++) {
            const seg = parts[i];
            if (seg === '.' || seg === '') {
                continue;
            }
            if (seg === '..') {
                if (start.length > 1) start.pop();
                continue;
            }
            start.push(seg);
        }
        
        if (start.length === 0) return ['/'];
        return start;
    }

    _getNodeByPathArray(pathArray, options) {
        options = options || {};
        const parent = !!options.parent;

        if (pathArray.length === 1 && pathArray[0] === '/') {
            if (parent) return { parentNode: null, name: '/'};
            return this.rootDir
        }

        let node = this.rootDir;
        const parts = pathArray.slice(pathArray[0] === '/' ? 1 : 0);

        for (let i = 0; i < parts.length; i++) {
            const seg = parts[i];
            if (parent && i === parts.length - 1) {
                return { parentNode: Node, name: seg };
            }

            if (!node || node.type !== 'dir') {
                return null;
            }

            node = node.entries[seg];
            if (!node) return null;
        }
        return node;
    }

    _ensureDirectoryPath(pathArray) {
        let node = this.rootDir;
        const parts = pathArray.slice(pathArray[0] === '/' ? 1 : 0);

        for (let i = 0; i < parts.length; i++) {
            const seg = parts[i];
            if (!node.entries[seg]) {
                node.entries[seg] = { type: 'dir', entries: {} };
            }
            node = node.entries[seg];
            if (node.type !== 'dir') {
                throw new Error('Path conficts with non-directory: ' + seg);
            }
        }
        return node;
    }

    readdir(pathString) {
        const arr = this.resolvePath(pathString || '.');
        const node = this._getNodeByPathArray(arr);
        if (!node) throw new Error('No such directory: ' + this.pathArrayToString(arr));
        if (node.type !== 'dir') throw new Error('Not a directory: ' + this.pathArrayToString(arr));
        return Object.keys(node.entries)
        .filter(name => showHidden || !name.startsWith('.'))
        .sort();
    }

    readFile(pathString) {
        const arr = this.resolvePath(pathString);
        const node = this._getNodeByPathArray(arr);
        if (!node) throw new Error('No such file: ' + this.pathArrayToString(arr));
        if (node.type !== 'file') throw new Error('Not a file: ' + this.pathArrayToString(arr));
        return node.content;
    }

    exists(pathString) {
        const arr = this.resolvePath(pathString);
        const node = this._getNodeByPathArray(arr);
        return !!node;
    }

    changeCwd(pathString) {
        const arr = this.resolvePath(pathString);
        const node = this._getNodeByPathArray(arr);
        if (!node) throw new Error('No such directory: ' + this.pathArrayToString(arr));
        if (node.type !== 'dir') throw new Error('Not a directory: ' + this.pathArrayToString(arr));
        this.cwd = arr;
        return this.cwd;
    }
}
