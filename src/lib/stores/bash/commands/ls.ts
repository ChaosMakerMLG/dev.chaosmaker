import { Bash, ExitCode, type Permission } from '../bash';
import { Type, type NodePerms, type TreeNode } from '../fs';
import { asciiByteQSort } from '../sort';
import type { CommandArgs, ICommand, Result, resultData } from '../static';

type LsEntry = {
	perms: string;
	children: string;
	owners: string;
	size: string;
	modt: string;
	name: string;
};

const LsEntryUtils = {
	toString(entry: LsEntry): string {
		return Object.entries(entry)
			.filter(([_, value]) => value !== '')
			.map(([_, value]) => value)
			.join(' ');
	}
};

const months: readonly string[] = [
	'Jan',
	'Feb',
	'Mar',
	'Apr',
	'May',
	'Jun',
	'Jul',
	'Aug',
	'Sep',
	'Oct',
	'Nov',
	'Dec'
];

export const cmd_ls = function (this: Bash, args: CommandArgs): Result {
	const resultData: resultData = { cmd: 'ls', data: null, args: args };
	const result: Result = { exitCode: ExitCode.ERROR, data: resultData };
	const nodes: TreeNode[] = [];
	const paths: string[][] = [];

	//Check if args contain any nonexistent flags, if so add it to an array and check its length. if 0 no bad flags
	const invalidItems = args.flags.filter((flag) => !ls.flags.includes(flag));
	console.log(invalidItems);
	if (invalidItems.length > 0) {
		this.throwError(result); //No such flag
	}

	if (args.args.length === 0) {
		const node = this.getFs()._getNodeByPathArray(this.getFs().cwd);
		if (node === null) this.throwError(result); //no such path

		nodes.push(node!);
	}

	for (let i = 0; i < args.args.length; i++) {
		if (args.args.length !== 0) paths.push(this.getFs().resolvePath(args.args[i]));

		const node = this.getFs()._getNodeByPathArray(paths[i]);
		if (node === null) this.throwError(result); //no such path

		nodes.push(node!);
	}

	result.exitCode = ExitCode.SUCCESS;
	resultData.data = result_ls.call(this, nodes, args);
	return result;
};

function result_ls(this: Bash, data: any, args: CommandArgs): HTMLElement {
	const dummysonoerror: HTMLElement = document.createElement('div');

	const flagInfo = checkFlags(args.flags, ls.flags);
	const nodes: TreeNode[] = data;

	const f_a: boolean = flagInfo.has('a') || flagInfo.has('f');
	const f_h: boolean = flagInfo.has('h');

	if (flagInfo.has('l') || flagInfo.has('g') || flagInfo.has('o')) {
		const w: HTMLElement = document.createElement('div');

		for (const node of nodes) {
			if (!flagInfo.has('U') && !flagInfo.has('f'))
				asciiByteQSort(node.children, flagInfo.has('r'));

			const elem: HTMLElement = document.createElement('div');
			const rows: string[] = [];

			//TODO: Actually calculate sizes here instead of defining numbers for types of nodes
			const sizes = node.children.map((child) => (child.type === Type.Directory ? '4096' : '1'));
			const maxSizeWidth = Math.max(...sizes.map((size) => size.length));

			for (const child of node.children) {
				if (child.name.startsWith('.') && !(f_a || flagInfo.has('A'))) continue;

				const cols: LsEntry = {
					perms: formatPermission(child),
					children: formatChildren(child),
					owners: formatOwners.call(this, child, flagInfo),
					size: formatSize.call(this, f_h, child, maxSizeWidth),
					modt: formatModtime(child),
					name: formatName(child, flagInfo)
				};

				rows.push(LsEntryUtils.toString(cols));
			}

			if (f_a && !flagInfo.has('A')) {
				const current: LsEntry = {
					perms: formatPermission(node),
					children: formatChildren(node),
					owners: formatOwners.call(this, node, flagInfo),
					size: formatSize.call(this, f_h, node, maxSizeWidth),
					modt: formatModtime(node),
					name: '.'
				};
				const parent: LsEntry = node.parent
					? {
							perms: formatPermission(node.parent),
							children: formatChildren(node.parent),
							owners: formatOwners.call(this, node.parent, flagInfo),
							size: formatSize.call(this, f_h, node.parent, maxSizeWidth),
							modt: formatModtime(node.parent),
							name: '..'
						}
					: {
							...current,
							name: '..'
						};

				if (flagInfo.has('r')) {
					rows.push(LsEntryUtils.toString(parent), LsEntryUtils.toString(current));
				} else {
					rows.unshift(LsEntryUtils.toString(current), LsEntryUtils.toString(parent));
				}
			}

			//TODO: Calculate the total size of contents in the node
			rows.unshift('total ' + node.children.length.toString());

			if (nodes.length > 1) {
				const nodePath: string =
					node.name === '/' ? '/:' : `${this.getFs().getPathByInode(node.inode).slice(1)}:`;
				rows.unshift(nodePath);
				rows.push('\n');
			}

			for (let i = 0; i < rows.length; i++) {
				const p: HTMLElement = document.createElement('p');
				p.innerText = rows[i];

				elem.appendChild(p);
			}

			w.appendChild(elem);
		}
		return w;
	}

	return dummysonoerror; //TEMP SO NO ERROR CUZ RETURNS HTMLElement EVERY TIME, DELETE LATER
}

function parsePerms(perms: NodePerms): string {
	const parts: string[] = [];
	//for each key (key representing key name and p representing the key contents) of entries in perms as types keyof NodePerms and Permission
	for (const [key, p] of Object.entries(perms) as [keyof NodePerms, Permission][]) {
		const perms: string = `${p.r ? 'r' : '-'}${p.w ? 'w' : '-'}${p.x ? 'x' : '-'}`;
		parts.push(perms);
	}
	return parts.join('');
}

function formatOwners(this: Bash, node: TreeNode, flag: any): string {
	const owner: string = node.owner;
	const group: string = node.group;

	if (flag.has('G') || flag.has('o')) {
		if (flag.has('n')) {
			const uid: number = this.getUserByName(owner).uid;
			return `${uid}`;
		}
		return `${owner}`;
	}

	if (flag.has('g')) {
		if (flag.has('n')) {
			const gid: number = this.getGroupByName(group).gid;
			return `${gid}`;
		}
		return `${group}`;
	}

	if (flag.has('n')) {
		const uid: number = this.getUserByName(owner).uid;
		const gid: number = this.getGroupByName(group).gid;

		return `${uid} ${gid}`;
	}

	return `${owner} ${group}`;
}

function formatPermission(node: TreeNode): string {
	return `${node.type === Type.Directory ? 'd' : '-'}${parsePerms(node.permission)}`;
}

function formatChildren(node: TreeNode): string {
	const c = node.children.length.toString();
	return c.length > 1 ? c : ` ${c}`;
}

function formatSize(this: Bash, human: boolean, node: TreeNode, max: number): string {
	const byteSize: number = node.type === Type.Directory ? 4096 : 1; //TEMP, later calculate the size.
	let size: string;
	if (human) {
		size = this.formatBytes(byteSize);
	} else size = byteSize.toString();

	return size.padStart(max, ' ');
}

function formatModtime(node: TreeNode): string {
	const now = new Date();
	const hours: string = node.modtime.getHours().toString().padStart(2, '0');
	const minutes: string = node.modtime.getMinutes().toString().padStart(2, '0');
	const time: string =
		now.getFullYear() === node.modtime.getFullYear()
			? `${hours}:${minutes}`
			: node.modtime.getFullYear().toString();

	return [
		months[node.modtime.getMonth()],
		node.modtime.getDate().toString().padStart(2, ' '),
		`${time}`
	].join(' ');
}

function formatName(node: TreeNode, flag: any) {
	let name: string;
	const char: string = flag.has('Q') ? '"' : "'";

	if (flag.has('N')) {
		name = node.name;
	} else {
		name = /\s/.test(node.name) ? `${char}${node.name}${char}` : `${node.name}`; //test if any spaces specifically '\s' (escape and 's' for space)
	}

	return flag.has('p') && node.type === Type.Directory ? `${name}/` : name;
}

const checkFlags = (pFlags: string[], dFlags: string[]) => {
	const flagSet = new Set(pFlags);

	return { has: (flag: string) => flagSet.has(flag) };
};

export const ls: ICommand = {
	method: cmd_ls,
	flags: [
		'l',
		'a',
		'A',
		'c',
		'U',
		'g',
		'G',
		'h',
		'f',
		'x',
		'X',
		'u',
		't',
		'S',
		'r',
		'Q',
		'p',
		'o',
		'n',
		'N',
		'L',
		'm'
	] as string[],
	help: 'PATH TO HELP.MD',
	root: false
};
