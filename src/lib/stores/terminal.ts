import { FileOutput } from '@lucide/svelte';
import Cursor from '../../modules/terminal/Cursor.svelte';
import { Bash, ExitCode, type BashInitArgs, type User } from './bash/bash';
import { Stack } from './stack';
import type { VirtualFS } from './bash/fs';

export interface TerminalMode {}

export interface TermInitArgs {
	bash: BashInitArgs;
}

export interface ParsedInput {
	command: string;
	args: string[];
}

export interface PrintData {
	path: string;
	output: any; // TODO: Make this be any predefined format of outputs like ls, ls w/ flags and so on;
}

export interface PageCallbacks {
	print: (data: PrintData) => void;
}

export class Terminal {
	private bash: Bash;
	private callbacks: Partial<PageCallbacks> = {};

	constructor(args: TermInitArgs) {
		args.bash.stdio = this;
		this.bash = new Bash(args.bash);
	}

	private _parseInput(input: string): ParsedInput {
		const result: ParsedInput = { command: '', args: [] };
		let current: string = '';
		let inQuotes: boolean = false;
		let quoteChar: Stack<string> = new Stack<string>();

		for (let i = 0; i < input.length; i++) {
			const char = input[i];

			if ((char === '"' || char === "'") && !inQuotes) {
				inQuotes = true;
				quoteChar.push(char);
				continue;
			} else if (char === quoteChar.peek() && inQuotes) {
				inQuotes = false;
				quoteChar.pop();
				continue;
			}

			if (char === ' ' && !inQuotes) {
				if (current !== '') {
					result.command = current;
					current = '';
				}
			} else {
				current += char;
			}
		}
		if (current !== '') result.args.push(current);
		return result;
	}

	executeCommand(input: string): void {
		this.bash.updateHistory(input);
		const parsed: ParsedInput = this._parseInput(input);
		this.bash.executeCommand(parsed.command, ...parsed.args);
	}

	registerCallbacks(callbacks: PageCallbacks): void {
		this.callbacks = callbacks;
	}

	getUser(): User {
		return this.bash.getUser();
	}

	getCwd(): string {
		const fs: VirtualFS = this.bash.getFs();
		let temp: string = fs.formatPath(fs.pathArrayToString(this.bash.getCwd()));
		return temp;
	}

	userLogin(username: string, passwd: string): ExitCode {
		return this.bash.userLogin(username, passwd);
	}

	PrintOutput(data: PrintData) {
		this.callbacks.print?.(data);
	}
}
