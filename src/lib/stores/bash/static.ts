import { Bash, ExitCode, type Group, type User } from './bash';
import { Type, type TreeNode } from './fs';

export type CommandArg = `-${string}`;

export interface ICommand {
	method: (this: Bash, ...args: any[]) => ExitCode;
	args: CommandArg[] | string[] | null;
	help: string;
	root: boolean;
}

export const GROUP: Group[] = [
	{
		groupname: 'sudo',
		gid: 69,
		members: ['root', 'admin']
	},
	{
		groupname: 'users',
		gid: 1000,
		members: ['admin', 'user']
	}
];

export const PASSWD: User[] = [
	{
		username: 'root',
		passwd: '123',
		uid: 0,
		gid: 0,
		home: '/',
		history: [] //TODO: Delete this and declare a new history array when logging the user in.
	},
	{
		username: 'admin',
		passwd: '456',
		uid: 1001,
		gid: 1000,
		home: '/home/admin',
		history: [] //TODO: Delete this and declare a new history array when logging the user in.
	},
	{
		username: 'user',
		passwd: '789',
		uid: 1002,
		gid: 1000,
		home: '/home/user',
		history: [] //TODO: Delete this and declare a new history array when logging the user in.
	}
];

export const HELP_ARGS: CommandArg[] = ['-h', '--help'];

export const cmd_return = function (this: Bash, ...args: string[]): ExitCode {
	return 0;
};

export const cmd_cd = function (this: Bash, ...args: string[]): ExitCode {
	const path = args[0];
	let targetNode: TreeNode;

	if (args.length > 1) return ExitCode.ERROR; // Too many args

	// if no args cd into home dir

	if (args.length === 0) {
		this.getFs().cwd = this.getFs().home;
		return ExitCode.SUCCESS;
	}

	// if the arg is - cd make your current dir the prev dir and vice versa

	if (args[0] === '-') {
		[this.getFs().cwd, this.getFs().pwd] = [this.getFs().pwd, this.getFs().cwd];
		return ExitCode.SUCCESS;
	}

	// Change the input STRING path from relative to absolute by replacing ~ with the home directory path

	//TODO: Change that to a global function inside fs class to parse all possible path formats????? already exists, need to verify

	let resolvedPath = path.startsWith('~')
		? path.replace('~', this.getFs().pathArrayToString(this.getFs().home))
		: path;

	this.getFs().pwd = this.getFs().cwd;
	targetNode = this.getFs()._getNodeByPathArray(this.getFs().resolvePath(resolvedPath)); // Conversion from STRING path to ARRAY

	if (!targetNode) return ExitCode.ERROR;
	if (targetNode.type !== Type.Directory) return ExitCode.ERROR;
	//if () return ExitCode.ERROR; // Check for read permissions on node and user

	this.getFs().cwd = this.getFs().resolvePath(resolvedPath); // CD was successfull, change current dir to the verified target dir
	return ExitCode.SUCCESS;
};

export const COMMANDS = {
	return: {
		method: cmd_return,
		args: [] as CommandArg[],
		help: 'PATH TO HELP.MD',
		root: false
	},
	cd: {
		method: cmd_cd,
		args: [] as string[],
		help: 'PATH TO HELP.MD',
		root: false
	}
} satisfies Record<string, ICommand>;

/* //export const commands {
    return: {
        method: this.cmd_return,
        flags: [],
        help: "Help about this command",
      },
      ls: {
        method: this.cmd_ls,
        flags: [],
        help: "./help/ls.md",
      },
      echo: {
        method: this.cmd_echo,
        flags: [],
        help: "",
      },
      touch: {
        method: this.cmd_touch,
        flags: [],
        help: "",
      },
      mkdir: {
        method: this.cmd_mkdir,
        flags: [],
        help: "",
      },
      pwd: {
        method: this.cmd_pwd,
        flags: [],
        help: "",
      },
      cd: {
        method: this.cmd_cd,
        flags: [],
        help: "",
      },
      exit: {
        method: this.cmd_exit,
        flags: [],
        help: "",
      },
      cp: {
        method: this.cmd_cp,
        flags: [],
        help: "",
      },
      mv: {
        method: this.cmd_mv,
        flags: [],
        help: "",
      },
      rmdir: {
        method: this.cmd_rmdir,
        flags: [],
        help: "",
      },
      cat: {
        method: this.cmd_cat,
        flags: [],
        help: "",
      },
      dir: {
        method: this.cmd_dir,
        flags: [],
        help: "",
      },
      less: {
        method: this.cmd_less,
        flags: [],
        help: "",
      },
      chown: {
        method: this.cmd_chown,
        flags: [],
        help: "",
      },
      chmod: {
        method: this.cmd_chmod,
        flags: [],
        help: "",
      },
      reboot: {
        method: this.cmd_reboot,
        flags: [],
        help: "",
      },
      help: {
        method: this.cmd_help,
        flags: [],
        help: "",
      },
      whoami: {
        method: this.cmd_whoami,
        flags: [],
        help: "",
      },
      rm: {
        method: this.cmd_rm,
        flags: [],
        help: "",
      },
      sudo: {
        method: this.cmd_sudo,
        flags: [],
        help: "",
      },
      su: {
        method: this.cmd_su,
        flags: [],
        help: "",
      },
      clear: {
        method: this.cmd_clear,
        flags: [],
        help: "",
      }
} */
