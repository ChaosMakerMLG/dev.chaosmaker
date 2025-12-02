import type { readonly } from 'svelte/store';
import type { Permission, TimeStamps, User } from './bash';
import { Stack } from '../stack';
import { Pause } from '@lucide/svelte';

export enum Type {
	Directory = 16384,
	File = 32768,
	SymblicLink = 40960
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
		let components: Stack<string> = new Stack<string>();
		let currentNode = this.FsTable.get(inode);
		let path: string = ''; 
		if(!currentNode) throw new Error('iNode does not exist,');

		components.push(currentNode.name);

		if(!currentNode.parent) {
			for(let i = 0; i < components.size(); i++) {
				path += components.pop() + '/';
			}

		} else {
			this._iNodeToPathString(currentNode.parent);
		}

		return path;
	}

	private _pathStringToINode(path: string): number {
		const normalizedPath = path.replace(/^\/+|\/+$/g, '');
		const pathComponents = normalizedPath.split('/').filter(component => component.length > 0);

		if(pathComponents.length === 0) return this.rootINode;

		let currentNode = this.FsTable.get(this.rootINode);
		if(!currentNode) throw new Error('iNode does not exist,');

		for(const component of pathComponents) {
			const childINode = this._findChildNodeByName(currentNode, component);
			if(childINode === null) throw new Error('this child iNode does not exist,');

			const nextNode = this.FsTable.get(childINode);
			if(!nextNode) throw new Error('iNode child does not exist,');

			currentNode = nextNode;
		}
		return currentNode.inode;
	}

	private _findChildNodeByName(node: TreeNode, name: string): number {
		for(const childINode of node.children) {
			const child = this.FsTable.get(childINode);
			if(child && child.name === name) {
				return childINode;
			} 
		}
		throw new Error('could not find the specified child node');
	}

	private _isAbsolutePath = (path: string): boolean => {
		return typeof path === 'string' && path.startsWith('/');
	};

	formatPath(path: string): string {
		const prefix = this._iNodeToPathString(this.home);
		if (path.startsWith(prefix)) {
			return path.replace(prefix, '~');
		} else return path;
	}

	resolvePath(path: string): TreeNode{
		if(path === '/') return this._getNodeByINode(this.rootINode);

		if (!this._isAbsolutePath(path)) {
			const trail: string = this._iNodeToPathString(this.cwd);
			path = trail + path;

		}
		else if (path.startsWith('~')) {
			const trail: string = this._iNodeToPathString(this.home);
			path = trail + path
		}

		console.log(path);

		const INode: number = this._pathStringToINode(path);
		const Node: TreeNode = this._getNodeByINode(INode);

		return Node;
	}
	

	private _getNodeByINode(inode: number): TreeNode {
		const node: TreeNode | undefined = this.FsTable.get(inode);
		if(!node) throw new Error('Could not get the node, no such i node exists');
		return node;
	}

	private _getPathToNode(node: TreeNode): string[] {
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
