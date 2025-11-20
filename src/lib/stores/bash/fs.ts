import type { readonly } from 'svelte/store';
import type { Permission, User } from './bash';

export enum Type {
	Directory = 16384,
	File = 32768
}

export type NodePerms = {
	user: Permission;
	group: Permission;
	other: Permission;
};

export type FsInitArgs = {
	fs: any;
	user: User;
};

export type TreeNode = {
	name: string;
	type: Type;
	readonly: boolean;
	interactible: boolean;
	func: any;
	children: TreeNode[];
	content: string; // Path to the content of the file
	link: string[]; // Symlink
	permission: NodePerms;
	owner: string;
	group: string;
	modtime: Date;
	parent?: TreeNode;
};

export class VirtualFS {
	private root: TreeNode; // TODO make this the correct type

	home: string[];
	cwd: string[];
	pwd: string[];

	constructor(args: FsInitArgs) {
		this.root = args.fs;
		this.home = this._splitPathString(args.user.home);
		this.cwd = args.user.cwd ? args.user.cwd : this.home;
		this.pwd = args.user.pwd ? args.user.pwd : this.cwd;

		console.log(this.home);
		console.log(this.cwd);
		console.log(this.pwd);

		console.log('VFS INIT ', this._getNodeByPathArray(['/', 'home', 'kamil']));
	}

	_splitPathString(path: string): string[] {
		if (path === '/') return ['/'];

		const raw: string[] = path.split('/');
		const parts: string[] = [];

		for (let i = 0; i < raw.length; i++) {
			if (raw[i].length > 0) parts.push(raw[i]);
		}
		return parts;
	}

	_isAbsolutePath = (path: string): boolean => {
		return typeof path === 'string' && path.startsWith('/');
	};

	pathArrayToString(path: string[]): string {
		if (path.length === 1 && path[0] === '/') return '/';
		return '/' + path.join('/');
	}

	formatPath(path: string): string {
		const prefix = this.pathArrayToString(this.home);
		if (path.startsWith(prefix)) {
			return path.replace(prefix, '~');
		} else return path;
	}

	resolvePath(path: string): string[] {
		if (path === '' || path === undefined || path === null) return this.cwd.slice();
		if (path.startsWith('/') && path.length === 1) return [];

		if (path.startsWith('~')) {
			const trail: string = path === '~' ? '' : path.slice(1);
			const home: string = this.pathArrayToString(this.home);
			path = home + (trail ? (trail.startsWith('/') ? '' : '/') + trail : '');
		}

		const start = this._isAbsolutePath(path) ? [] : this.cwd.slice();
		const parts = this._splitPathString(path);

		for (let i = 0; i < parts.length; i++) {
			const seg = parts[i];

			if (seg === '.' || seg === '') continue;
			if (seg === '..') {
				if (start.length > 1) start.pop();
				continue;
			}
			start.push(seg);
		}

		if (start.length === 0) return [];
		console.log('OUTPUT', start);
		return start;
	}

	_getNodeByPathArray(path: string[]): TreeNode | null {
		if (path.length === 1 && path[0] === '/') return this.root;

		let node: TreeNode = this.root;
		const parts: string[] = path.slice(path[0] === '/' ? 1 : 0);

		for (let i = 0; i < parts.length; i++) {
			const seg: string = parts[i];

			if (node.type === Type.File) return node;
			const newNode = node.children.find((child) => child.name === seg);
			console.log(newNode);
			if (newNode !== undefined) node = newNode;
			else return null;
		}

		return node;
	}

	_getPathToNode(node: TreeNode): string[] {
		const path: string[] = [];
		let current = node;
		path.push(node.name);

		while (current.parent) {
			current = current.parent;
			path.unshift(current.name);
		}

		return path;
	}
}
