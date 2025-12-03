import { Bash, ExitCode, type BashInitArgs, type User } from '../bash/bash';
import type { VirtualFS } from '../bash/fs';
import type { CommandArgs } from '../bash/static';
import { Char } from '../char';

export type TerminalMode = {};

export type TermInitArgs = {
	bash: BashInitArgs;
};

export type ParsedInput = {
	command: string;
	args: CommandArgs;
};

export type PrintData = {
	path: string;
	output: any; // TODO: Make this be any predefined format of outputs like ls, ls w/ flags and so on;
	cmd: string;
};

export type PageCallbacks = {
	print: (data: PrintData) => void;
};

export class Terminal {
	private bash: Bash;
	private callbacks: Partial<PageCallbacks> = {};

	constructor(args: TermInitArgs) {
		args.bash.stdio = this;
		this.bash = new Bash(args.bash);
	}

	private _parseInput(input: string): ParsedInput {
		let args: string[] = [];
		const result: ParsedInput = { command: '', args: { flags: [], args: [] } };
		let current: string = '';
		let inQuotes: boolean = false;
		let quoteChar: string = '';

		for (let i = 0; i < input.length; i++) {
			const char = input[i];

			if ((char === '"' || char === "'") && !inQuotes) {
				inQuotes = true;
				quoteChar = char;
				continue;
			} else if (char === quoteChar && inQuotes) {
				inQuotes = false;
				continue;
			}

			if (char === ' ' && !inQuotes) {
				if (current === '') continue;

				result.command === '' ? (result.command = current) : args.push(current);
				current = '';
			} else {
				current += char;
			}
		}

		if (current !== '') result.command === '' ? (result.command = current) : args.push(current);

		for (let i = 0; i < args.length; i++) {
			let curr = args[i];

			if (!curr.startsWith('-')) result.args.args.push(curr);
			else {
				curr = curr.replaceAll('-', '');

				if (curr.length > 0) {
					for (let n = 0; n < curr.length; n++) {
						result.args.flags.push(curr[n]);
					}
				}
			}
		}

		return result;
	}

	executeCommand(input: string): void {
		this.bash.updateHistory(input);
		const parsed: ParsedInput = this._parseInput(input);
		console.log(parsed);
		this.bash.executeCommand(parsed.command, parsed.args);
	}

	registerCallbacks(callbacks: PageCallbacks): void {
		this.callbacks = callbacks;
	}

	getUser(): User {
		return this.bash.getUser();
	}

	getCwd(): string {
		const fs: VirtualFS = this.bash.getFs();
		return fs.formatPath(fs.getPathByInode(this.bash.getCwd()));
	}

	//TODO: Later reimplement the backend helper methods
	/* userLogin(username: string, passwd: string): ExitCode {
		return this.bash.userLogin(username, passwd);
	} */

	PrintOutput(data: PrintData) {
		this.callbacks.print?.(data);
	}
}
