import { COMMANDS, GROUP, PASSWD, type CommandArgs, type ICommand, type Result } from './static';
import { VirtualFS } from './fs';
import { Terminal, type PrintData } from '../terminal/terminal';
import { Stack } from '../stack';

export type Permission = {
	r: boolean;
	w: boolean;
	x: boolean;
};

export type BashInitArgs = {
	stdio?: Terminal;
	user: User;
	fs: any;
};

export type TimeStamps = {
	mTime: Date;
	cTime: Date;
	aTime: Date;
};

// TODO: Finish this
// TODO: Change into a type instead of an enum for performance (low priority)
export enum ExitCode {
	SUCCESS = 0,
	ERROR = 1
}

export type User = {
	username: string;
	passwd: string; //HASHED PASSWORD //TODO: Make a formated type
	readonly uid: number; // Normal user 1000+ System user 1-999 root - 0 //TODO: Make a formated type
	readonly gid: number; // Primary group | 'Users' 1000 - Others - 1000+ root - 0 //TODO: Make a formated type
	home: string; //TODO: Make a formated type
	history: string[];
	cwd?: number; //TODO: Make a formated type
	pwd?: number; //TODO: Make a formated type
};

export type Group = {
	groupname: string;
	gid: number; // Primary group 'Users' 1000 - Others - 1000+ root - 0
	members: number[]; //TODO: Make a formated type UID
};

export class Bash {
	private vfs: VirtualFS;
	private _passwd: User[];
	private _instances: Stack<User>;
	private _group: Group[];
	private _terminal!: Terminal;
	private user: User;
	private readonly _commands: Record<string, ICommand>;

	constructor(args: BashInitArgs) {
		this.user = args.user;
		this._commands = COMMANDS;
		this._passwd = PASSWD;
		this._group = GROUP;
		this._terminal = args.stdio!;
		this._instances = new Stack<User>();

		this.vfs = new VirtualFS({ fs: args.fs, user: args.user });
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

	getCwd(): number {
		return this.vfs.cwd;
	}

	getPwd(): number {
		return this.vfs.pwd;
	}

	getUser(): User {
		return this.user;
	}

	getFs(): VirtualFS {
		return this.vfs;
	}

	hasSudoPerms(uid: number): boolean {
		return this._group[1].members.includes(uid);
	}

	executeCommand(commandName: string, args: CommandArgs): void {
		let result: Result = { exitCode: ExitCode.ERROR };
		const command = this._commands[commandName];
		if (!command) this.throwError(result);

		if (command.root) {
			if (this.hasSudoPerms(this.user.uid)) {
				let out: Result = command.method.call(this, args);
				this.appendNewResult(this.getCwd(), out, this.user.history[0]);
			}
			this.throwError(result);
		}

		let out: Result = command.method.call(this, args);
		console.log(out);
		this.appendNewResult(this.getCwd(), out.data?.data, this.user.history[0]);
	}

	throwError(result: Result): void {
		switch (result.exitCode) {
			default: {
				throw new Error(`Error, dont know where, just look for it;`);
			}
		}
	}

	userLogout() {
		this._instances.pop();
		if (this._instances.size() === 0) {
			//TODO: Implement system logout
		} else {
			//this.changeUser(this._instances.peek()!);
		}
	}

	private appendNewResult(workingDir: number, output: any, cmd: string) {
		const data: PrintData = {
			path: this.vfs.formatPath(this.vfs.getPathByInode(workingDir)),
			output: output,
			cmd: cmd
		};
		console.log(data);
		this._terminal.PrintOutput(data);
	}

	formatBytes(bytes: number, dPoint?: number): string {
		if (!+bytes) return '0';

		const k: number = 1024;
		const dp: number = dPoint ? (dPoint < 0 ? 0 : dPoint) : 1;
		const units: string[] = ['', 'K', 'M', 'G', 'T', 'P'];

		const i: number = Math.floor(Math.log(bytes) / Math.log(k));

		return `${(bytes / Math.pow(k, i)).toFixed(dp)}${units[i]}`;
	}

	getGroupByName(name: string): Group {
		const out: Group | undefined = this._group.find((group) => group.groupname === name);

		if (out) return out;
		else throw new Error(`Cannot find a user group named ${name}`);
	}

	getUserByName(name: string): User {
		const out: User | undefined = this._passwd.find((user) => user.username === name);

		if (out) return out;
		else throw new Error(`Cannot find a user named ${name}`);
	}

	getGroupByGid(gid: number): Group {
		const out: Group | undefined = this._group.find((group) => group.gid === gid);

		if (out) return out;
		else throw new Error(`Cannot find a user group with id of ${gid}`);
	}

	getUserByUid(uid: number): User {
		const out: User | undefined = this._passwd.find((user) => user.uid === uid);

		if (out) return out;
		else throw new Error(`Cannot find a user with id of ${uid}`);
	}
}
