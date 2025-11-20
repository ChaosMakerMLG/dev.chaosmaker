import { Bash, ExitCode, type Group, type User } from './bash';
import { Type, type TreeNode } from './fs';
import type { Char } from '../char';
import { ls } from './commands/ls';

export type ICommand = {
	method: (this: Bash, args: CommandArgs) => Result;
	flags: string[];
	help: string;
	root: boolean;
};

export type CommandArgs = {
	flags: string[];
	args: string[];
};

export type resultData = {
	cmd: string; //the string that contains the shorthand for the command that was executed - used in a switch statement in parseResult
	data: any; //the data that the commmand may have returned like TreeNodes[] from ls
	args?: CommandArgs;
};

export type Result = {
	exitCode: ExitCode;
	data?: resultData;
};

export const GROUP: Group[] = [
	{
		groupname: 'sudo',
		gid: 69,
		members: [0, 1001]
	},
	{
		groupname: 'users',
		gid: 1000,
		members: [1001, 1002]
	}
] as const;

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

export const cmd_return = function (this: Bash, args: CommandArgs): Result {
	let result: Result = { exitCode: ExitCode.ERROR };
	return result;
};

export const cmd_cd = function (this: Bash, args: CommandArgs): Result {
	let result: Result = { exitCode: ExitCode.ERROR };
	const path = args.args[0];
	let targetNode: TreeNode | null;

	if (args.args.length > 1) return result; // Too many args

	// if no args cd into home dir

	if (args.args.length === 0) {
		this.getFs().cwd = this.getFs().home;
		result.exitCode = ExitCode.SUCCESS;
		return result;
	}

	// if the arg is - cd make your current dir the prev dir and vice versa

	if (args.args[0] === '-') {
		[this.getFs().cwd, this.getFs().pwd] = [this.getFs().pwd, this.getFs().cwd];
		result.exitCode = ExitCode.SUCCESS;
		return result;
	}

	// Change the input STRING path from relative to absolute by replacing ~ with the home directory path

	//TODO: Change that to a global function inside fs class to parse all possible path formats????? already exists, need to verify

	let resolvedPath = path.startsWith('~')
		? path.replace('~', this.getFs().pathArrayToString(this.getFs().home))
		: path;

	this.getFs().pwd = this.getFs().cwd;
	targetNode = this.getFs()._getNodeByPathArray(this.getFs().resolvePath(resolvedPath)); // Conversion from STRING path to ARRAY

	if (targetNode === null) return result;
	if (targetNode.type !== Type.Directory) return result;
	//if () return ExitCode.ERROR; // Check for read permissions on node and user

	this.getFs().cwd = this.getFs().resolvePath(resolvedPath); // CD was successfull, change current dir to the verified target dir
	result.exitCode = ExitCode.SUCCESS;
	return result;
};

/* const compareArrays = (A: string[], B: string[]): { value: string; isInB: boolean }[] => {
	const result = A.map((item) => ({ value: item, isInB: B.includes(item) }));

	// Validate all B items are in A
	const invalidItems = B.filter((item) => !A.includes(item));
	if (invalidItems.length > 0) {
		throw new Error(`Items '${invalidItems.join("', '")}' from B not found in A`);
	}

	return result;
}; */

export const COMMANDS = {
	return: {
		method: cmd_return,
		flags: [] as string[],
		help: 'PATH TO HELP.MD',
		root: false
	},
	cd: {
		method: cmd_cd,
		flags: [] as string[],
		help: 'PATH TO HELP.MD',
		root: false
	},
	ls
} as const satisfies Record<string, ICommand>;

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
