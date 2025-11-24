import { Bash, ExitCode, type Group, type User } from './bash';
import { ls } from './commands/ls';
import { cd } from './commands/cd';

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
	},
	{
		username: 'kamil',
		passwd: '000',
		uid: 1003,
		gid: 1000,
		home: '/home/kamil',
		history: [] //TODO: Delete this and declare a new history array when logging the user in.
	}
];

export const cmd_return = function (this: Bash, args: CommandArgs): Result {
	let result: Result = { exitCode: ExitCode.ERROR };
	return result;
};

export const COMMANDS = {
	return: {
		method: cmd_return,
		flags: [] as string[],
		help: 'PATH TO HELP.MD',
		root: false
	},
	cd,
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
