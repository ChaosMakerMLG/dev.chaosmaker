import { command } from '$app/server';
import { COMMANDS, GROUP, HELP_ARGS, PASSWD, type CommandArg, type ICommand } from './static';
import { VirtualFS } from './fs';
import { Terminal, type PrintData } from '../terminal';
import { Stack } from '../stack';
import path from 'path';

export interface Permission {
	r: boolean;
	w: boolean;
	x: boolean;
}

export interface BashInitArgs {
	stdio?: Terminal;
	user: User;
	fs: any;
}

// TODO: Finish this
export enum ExitCode {
	SUCCESS = 0,
	ERROR = 1
}

export interface User {
	username: string;
	passwd: string; //HASHED PASSWORD
	uid: number; // Normal user 1000+ System user 1-999 root - 0
	gid: number; // Primary group | 'Users' 1000 - Others - 1000+ root - 0
	home: string;
	history: string[];
	cwd?: string[];
	pwd?: string[];
}

export interface Group {
	groupname: string;
	gid: number; // Primary group 'Users' 1000 - Others - 1000+ root - 0
	members: string[];
}

export class Bash {
	private vfs: VirtualFS;
	private _passwd: User[];
	private _instances: Stack<User>;
	private _group: Group[];
	private _terminal!: Terminal;
	private user: User;
	private _helpArgs: CommandArg[];
	private _commands: Record<string, ICommand>;

	constructor(args: BashInitArgs) {
		this.user = args.user;
		this._helpArgs = HELP_ARGS;
		this._commands = COMMANDS;
		this._passwd = PASSWD;
		this._group = GROUP;
		this._terminal = args.stdio!;
		this._instances = new Stack<User>();

		this.vfs = new VirtualFS({ fs: args.fs, user: args.user });

		console.log(this._commands);
	}

	updateHistory(input: string): void {
		if ((this.user.history.length = 255)) {
			this.user.history.unshift(...this.user.history.splice(-1));
			this.user.history[0] = input;
		} else {
			this.user.history.push(input);
			this.user.history.unshift(...this.user.history.splice(-1));
		}
	}

	getCwd(): string[] {
		return this.vfs.cwd;
	}

	getPwd(): string[] {
		return this.vfs.pwd;
	}

	getUser(): User {
		return this.user;
	}

	getFs(): VirtualFS {
		return this.vfs;
	}

	changeUser(user: User) {
		this.user = user;
		this.vfs.home = this.vfs._splitPathString(user.home);
		this.vfs.cwd = user.cwd ? user.cwd : this.vfs._splitPathString(user.home);
		this.vfs.pwd = user.pwd ? user.pwd : this.vfs._splitPathString(user.home);
	}

	executeCommand(commandName: string, ...args: string[]): void {
		const command = this._commands[commandName];
		if (!command) this.throwError(ExitCode.ERROR);
		if (command.root) {
			if (this._group[1].members.includes(this.user.username)) {
				let out: ExitCode = command.method.call(this, ...args);
				this.throwError(out);
			}
			this.throwError(ExitCode.ERROR);
		}

		let out: ExitCode = command.method.call(this, ...args);
		this.throwError(out);
	}

	throwError(code: ExitCode, data?: any): void {
		//TODO: Make data some interface format or smh.
		switch (code) {
			default:
				this.appendNewResult(this.vfs.pwd, 'Success!');
				break;
		}
	}

	userLogin(username: string, passwd: string): ExitCode {
		const user: User | undefined = this._passwd.find((u) => u.username === username);
		if (user === undefined) return ExitCode.ERROR;

		if (user.passwd === passwd) {
			this._instances.push(user);
			this.changeUser(user);
			return ExitCode.ERROR; //TODO: Make it return the exitcode of changeUser() if needed
		} else return ExitCode.ERROR;
	}

	userLogout() {
		this._instances.pop();
		if (this._instances.size() === 0) {
			//TODO: Implement system logout
		} else {
			this.changeUser(this._instances.peek()!);
		}
	}

	appendNewResult(path: string[], output: any) {
		const data: PrintData = {
			path: this.vfs.formatPath(this.vfs.pathArrayToString(path)),
			output: output
		};
		console.log('NEW RESULT - ', data);
		this._terminal.PrintOutput(data);
	}
}
