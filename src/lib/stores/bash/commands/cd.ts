import { ExitCode, type Bash } from '../bash';
import { Type, type TreeNode } from '../fs';
import type { CommandArgs, ICommand, Result } from '../static';

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

	this.getFs().pwd = this.getFs().cwd;
	targetNode = this.getFs().resolvePath(path); // Conversion from STRING path to TREENODE

	if (targetNode === null) return result;
	if (targetNode.type !== Type.Directory) return result;
	//if () return ExitCode.ERROR; // Check for read permissions on node and user

	this.getFs().cwd = targetNode.inode; // CD was successfull, change current dir to the verified target dir
	result.exitCode = ExitCode.SUCCESS;
	console.log(this.getCwd());
	return result;
};

export const cd: ICommand = {
	method: cmd_cd,
	flags: [] as string[],
	help: 'PATH TO HELP.md',
	root: false
};
