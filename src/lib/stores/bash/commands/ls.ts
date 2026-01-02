import { Bash, ExitCode, type Permission, type TimeStamps } from '../bash';
import { Type, type NodePerms, type TreeNode } from '../fs';
import { Sort, SortNodeBy } from '../sort';
import type { CommandArgs, ICommand, Result, resultData } from '../static';

type LsEntry = {
	inode: number | null;
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
	const result: Result = { exitCode: ExitCode.ERROR, path: this.getCwd(), data: resultData };
	const nodes: TreeNode[] = [];

	//Check if any args contain the long flags with value and are valid flags inside the ls const
	const valuedArgs = args.flags.filter((flag: string) =>
		 flag.includes('=') && ls.flags.includes(flag.split('=')[0]));
	console.log(valuedArgs);

	//Check if args contain any nonexistent flags, if so add it to an array and check its length. if 0 no bad flags
	const invalidArgs = args.flags.filter((flag) => !ls.flags.includes(flag) && !valuedArgs.includes(flag));
	console.log(invalidArgs);

	if (invalidArgs.length > 0) {
		this.throwError(result); //No such flag/s
	}

	if (args.args.length === 0) nodes.push(this.getFs().getNodeByINode(this.getFs().cwd));

	for (let i = 0; i < args.args.length; i++) {
		const node = this.getFs().resolvePath(args.args[i]);
		if (node === null) this.throwError(result); //no such path (i think this will never occur as backed methods have error cases implemented - which is wrong)

		nodes.push(node);
	}

	result.exitCode = ExitCode.SUCCESS;
	resultData.data = result_ls.call(this, nodes, args);
	return result;
};

function result_ls(this: Bash, data: any, args: CommandArgs): HTMLElement {
	const dummysonoerror: HTMLElement = document.createElement('div');

	const flagInfo = checkFlags(args.flags);
	const nodes: TreeNode[] = data;

	const f_a: boolean = flagInfo.has('a') || flagInfo.has('all');
	const f_A: boolean = flagInfo.has('A') || flagInfo.has('almost-all');
	const f_G: boolean = flagInfo.has('G') || flagInfo.has('no-group');
	const f_h: boolean = flagInfo.has('h') || flagInfo.has('human-readable');
	const f_r: boolean = flagInfo.has('r') || flagInfo.has('reverse');
	const f_Q: boolean = flagInfo.has('Q') || flagInfo.has('quote-name');
	const f_n: boolean = flagInfo.has('n') || flagInfo.has('numeric-uid-gid');
	const f_N: boolean = flagInfo.has('N') || flagInfo.has('literal');
	const f_L: boolean = flagInfo.has('L') || flagInfo.has('dereference');
	const f_i: boolean = flagInfo.has('i') || flagInfo.has('inode');
	const f_help: boolean = flagInfo.has('help');
	const f_si: boolean = flagInfo.has('si');
	const f_X: boolean = flagInfo.has('X');
	const f_S: boolean = flagInfo.has('S');
	const f_t: boolean = flagInfo.has('t');
	const f_l: boolean = flagInfo.has('l');
	const f_U: boolean = flagInfo.has('U');
	const f_f: boolean = flagInfo.has('f');
	const f_g: boolean = flagInfo.has('g');
	const f_o: boolean = flagInfo.has('o');

	let shouldShift: boolean = false

	const valuedArgs = args.flags.filter((flag: string) =>
		 flag.includes('=') && ls.flags.includes(flag.split('=')[0]));

	if (f_l || f_g || f_o) {
		const w: HTMLElement = document.createElement('div');

		for (const node of nodes) {
			const elem: HTMLElement = document.createElement('div');
			const children: TreeNode[] = node.children.map((child) => this.getFs().getNodeByINode(child));
			const rows: string[] = [];

			const timeArg = valuedArgs.find((flag) => flag.startsWith('time'));
			let timestamp: SortNodeBy.ATIME | SortNodeBy.CTIME | SortNodeBy.MTIME = SortNodeBy.MTIME;
			if(timeArg) {
				let value: string = timeArg.split('=')[1];
				if (value && isValidNodeTimestamp(value)) {
					timestamp = value;
					console.log(timestamp);
				}
			}

			if (!f_U && !f_f) {
				const sortArg = valuedArgs.find((flag) => flag.startsWith('sort'));
				let sortBy: SortNodeBy = SortNodeBy.NAME;
				if(f_t) sortBy = timestamp;
				if(f_S) sortBy = SortNodeBy.SIZE;
				if(f_X) sortBy = SortNodeBy.EXTENSION;
				if(sortArg) {
					let value = sortArg.split('=')[1];
					if(value && isValidNodeSortMethod(value)) {
						sortBy = value;
						console.log(sortBy, 'sortBy');
					}
				}

				Sort.nodeArraySort.call(this, children, f_r, sortBy);
			}

			const sizes = children.map((child) => child.size);
			const maxSizeWidth = Math.max(...sizes.map((size) => size));

			for (const child of children) {
				if (child.name.startsWith('.') && !(f_a || f_A)) continue;

				const cols: LsEntry = {
					inode: null,
					perms: formatPermission(child),
					children: formatChildren(child),
					owners: formatOwners.call(this, child, flagInfo),
					size: formatSize.call(this, f_h, child, maxSizeWidth, f_si),
					modt: formatModtime(child, timestamp),
					name: formatName(child, flagInfo, shouldShift)
				};

				if (f_i) cols.inode = child.inode;

				rows.push(LsEntryUtils.toString(cols));
			}

			if (f_a && !f_A) {
				const current: LsEntry = {
					inode: null,
					perms: formatPermission(node),
					children: formatChildren(node),
					owners: formatOwners.call(this, node, flagInfo),
					size: formatSize.call(this, f_h, node, maxSizeWidth, f_si),
					modt: formatModtime(node, timestamp),
					name: '.'
				};
				let parent: LsEntry = {
					...current,
					name: '..'
				};
				if (node.parent) {
					const parentNode: TreeNode = this.getFs().getNodeByINode(node.parent);
					parent = {
						inode: null,
						perms: formatPermission(parentNode),
						children: formatChildren(parentNode),
						owners: formatOwners.call(this, parentNode, flagInfo),
						size: formatSize.call(this, f_h, parentNode, maxSizeWidth, f_si),
						modt: formatModtime(parentNode, timestamp),
						name: '..'
					};
				}

				if (f_i) {
					current.inode = node.inode;
					parent.inode = node.parent ? node.parent : node.inode;
				}

				if (f_r) {
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

			for(const row of rows) {
				const name: string = row[row.length - 1];
				if(!name.startsWith('"') || !name.startsWith("'")) 
					name.padStart(1, ' ');
				else continue;
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

function isValidNodeSortMethod(value: string): value is SortNodeBy {
	return Object.values(SortNodeBy).includes(value as SortNodeBy);
}

function isValidNodeTimestamp(value: string): value is SortNodeBy.ATIME | SortNodeBy.CTIME | SortNodeBy.MTIME {
	return Object.values(SortNodeBy).includes(value as SortNodeBy.ATIME | SortNodeBy.CTIME | SortNodeBy.MTIME);
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
	const owner: string = this.getUserByUid(node.owner).username;
	const group: string = this.getGroupByGid(node.group).groupname;

	if (flag.has('G') || flag.has('o')) {
		if (flag.has('n')) return `${node.owner}`;
		return `${owner}`;
	}

	if (flag.has('g')) {
		if (flag.has('n')) return `${node.group}`;
		return `${group}`;
	}

	if (flag.has('n')) return `${node.owner} ${node.group}`;

	return `${owner} ${group}`;
}

function formatPermission(node: TreeNode): string {
	switch(node.type) {
		case Type.Directory:
			return `d${parsePerms(node.permission)}`;
		case Type.File:
			return `-${parsePerms(node.permission)}`;
		case Type.SymbolicLink:
			return `l${parsePerms(node.permission)}`;
		default:
			throw new Error(`Node of unexpected type - ${node.type}`);
	}
}

function formatChildren(node: TreeNode): string {
	if (node.type !== Type.Directory) return ' 0';
	if (!node.children) throw new Error('children array is null on this node');

	const c = node.children.length.toString();
	return c.length > 1 ? c : ` ${c}`;
}

function formatSize(
	this: Bash,
	humanReadable: boolean,
	node: TreeNode,
	max: number,
	f_si: boolean
): string {
	let size: string;
	if (humanReadable) {
		size = this.formatBytes(node.size, 1, f_si ? 1000 : 1024);
	} else size = node.size.toString();

	return size.padStart(max, ' ');
}

function formatModtime(node: TreeNode, sortBy: SortNodeBy.ATIME | SortNodeBy.CTIME | SortNodeBy.MTIME): string {
	const now = new Date();
	//TODO: Change this to be dynamic based on the --time value passed
	const hours: string = node.timestamps[sortBy].getHours().toString().padStart(2, '0');
	const minutes: string = node.timestamps[sortBy].getMinutes().toString().padStart(2, '0');
	const time: string =
		now.getFullYear() === node.timestamps[sortBy].getFullYear()
			? `${hours}:${minutes}`
			: node.timestamps[sortBy].getFullYear().toString();

	return [
		months[node.timestamps[sortBy].getMonth()],
		node.timestamps[sortBy].getDate().toString().padStart(2, ' '),
		`${time}`
	].join(' ');
}

function formatName(node: TreeNode, flag: any, shouldShift: boolean) {
	let name: string;
	const char: string = flag.has('Q') ? '"' : "'";

	if (/\s/.test(node.name)) {
		name = `${char}${node.name}${char}`
		shouldShift = true;
	} else {
		name = `${node.name}`;
	}

	return flag.has('p') && node.type === Type.Directory ? `${name}/` : name;
}

const checkFlags = (pFlags: string[]) => {
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
		'm',
		'i',
		'sort',
		'time',
		'help',
		'all',
		'almost-all',
		'no-group',
		'human-readable',
		'reverse',
		'quote-name',
		'indicator-style',
		'literal',
		'numeric-uid-gid',
		'inode',
		'si',
		'dereference'
	] as string[],
	help: 'PATH TO HELP.MD',
	root: false
};
