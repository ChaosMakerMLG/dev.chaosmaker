import type { Permission, TimeStamps, User } from './bash';

export enum Type {
	Directory = 16384,
	File = 32768,
	SymbolicLink = 40960
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
	inode: number;
	parent?: number;
	name: string;
	type: Type;
	size: number; //Size in Bytes
	children: number[];
	content: string; // GUID of the cache file that contains the file contents.
	link: number; // Links
	permission: NodePerms;
	owner: number;
	group: number;
	timestamps: TimeStamps;
	interactible: boolean;
	func: any;
};

export class VirtualFS {
	private FsTable: Map<number, TreeNode>;
	private rootINode: number;

	home: number;
	cwd: number;
	pwd: number;

	constructor(args: FsInitArgs) {
		this.FsTable = args.fs;
		this.rootINode = 1;
		this.home = this._pathStringToINode(args.user.home);
		this.cwd = args.user.cwd ? args.user.cwd : this.home;
		this.pwd = args.user.pwd ? args.user.pwd : this.cwd;

		console.log(this.home);
		console.log(this.cwd);
		console.log(this.pwd);
	}

	private _iNodeToPathString(inode: number): string {
		const currentNode = this.FsTable.get(inode);
		if (!currentNode)
			throw new Error('could not find the node in the fs table - inodetopathstring');

		if (!currentNode.parent) {
			return '/';
		}

		const parentPath: string = this._iNodeToPathString(currentNode.parent);
		return parentPath === '/' ? `/${currentNode.name}` : `${parentPath}/${currentNode.name}`;
	}

	//TODO: Make all backend methods NOT throw errors. Just return null, and let more closely connected with bash functions call throwError() so user can see the error.
	// 			this will save a lot of ass pain later.

	private _pathStringToINode(path: string): number {
		const normalizedPath = path.replace(/^\/+|\/+$/g, '');
		const pathComponents = normalizedPath.split('/').filter((component) => component.length > 0);

		console.log(path, 'pathstringtoinode');

		if (pathComponents.length === 0) return this.rootINode;

		let currentNode = this.FsTable.get(this.rootINode);
		if (!currentNode) throw new Error('iNode does not exist,');

		for (const component of pathComponents) {
			const childINode = this._findChildNodeByName(currentNode, component);
			if (childINode === null) throw new Error('this child iNode does not exist,');

			const nextNode = this.FsTable.get(childINode);
			if (!nextNode) throw new Error('iNode child does not exist,');

			currentNode = nextNode;
		}

		console.log(path, currentNode.inode);
		return currentNode.inode;
	}

	private _findChildNodeByName(node: TreeNode, name: string): number {
		console.log(name, node);
		for (const childINode of node.children) {
			const child = this.FsTable.get(childINode);
			if (child && child.name === name) {
				return childINode;
			}
		}
		throw new Error('could not find the specified child node');
	}

	private _isAbsolutePath = (path: string): boolean => {
		return typeof path === 'string' && path.startsWith('/');
	};

	getPathByInode(inode: number): string {
		return this._iNodeToPathString(inode);
	}

	formatPath(path: string): string {
		console.log(path, 'formatPath');
		const prefix = this._iNodeToPathString(this.home);

		if (path.startsWith(prefix)) {
			return path.replace(prefix, '~');
		} else return path;
	}

	resolvePath(path: string): TreeNode {
		if (path === '/') return this.getNodeByINode(this.rootINode);
		let parsedPath: string = path;

		if (!this._isAbsolutePath(path)) {
			const trail: string = this._iNodeToPathString(this.cwd);
			parsedPath = `${trail}/${path}`;
			console.log(parsedPath);
		}
		if (path.startsWith('~')) {
			const trail: string = this._iNodeToPathString(this.home);
			parsedPath = `${trail}/${path.replace('~', '')}`;
			console.log(parsedPath);
		}

		const INode: number = this._pathStringToINode(parsedPath);
		const Node: TreeNode = this.getNodeByINode(INode);

		return Node;
	}

	getNodeByINode(inode: number): TreeNode {
		const node: TreeNode | undefined = this.FsTable.get(inode);
		if (!node) throw new Error('Could not get the node, no such i node exists');
		return node;
	}

	/* private _getPathToNode(node: TreeNode): string[] {
		const path: string[] = [];
		let current = node;
		path.push(node.name);

		while (current.parent) {
			current = current.parent;
			path.unshift(current.name);
		}

		return path;
	} */
}
