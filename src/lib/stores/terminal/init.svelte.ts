import type { User } from '../bash/bash';
import type { TreeNode } from '../bash/fs';
import { Terminal, type TermInitArgs } from './terminal';

let initializing = $state(true);

export function isInitializing(): boolean {
	return initializing;
}

function jsonToTreeNode(data: any, parent?: TreeNode): TreeNode {
	const node: TreeNode = {
		name: data.Name,
		type: data.Type,
		readonly: data.ReadOnly,
		interactible: data.Interactible,
		func: data.Func,
		children: [],
		content: data.Content,
		link: data.Link || [],
		permission: {
			user: {
				r: data.Permission[0]?.Read,
				w: data.Permission[0]?.Write,
				x: data.Permission[0]?.Exec
			},
			group: {
				r: data.Permission[1]?.Read,
				w: data.Permission[1]?.Write,
				x: data.Permission[1]?.Exec
			},
			other: {
				r: data.Permission[2]?.Read,
				w: data.Permission[2]?.Write,
				x: data.Permission[2]?.Exec
			}
		},
		owner: data.Owner,
		group: data.Group,
		modtime: new Date(data.Mtime),
		parent: parent
	};

	node.children = data.Children
		? data.Children.map((child: any) => jsonToTreeNode(child, node))
		: [];

	return node;
}

async function fetchFileSystem(path: string): Promise<any> {
	const response = await fetch(path);
	if (!response.ok) throw new Error('Failed to fetch the file system json');

	const data = await response.json();

	const node: TreeNode = jsonToTreeNode(data);
	return node;
}

export async function initTerminal(user: User, callbackInit: any): Promise<Terminal> {
	try {
		let fsJson = await fetchFileSystem('/src/lib/assets/fs/fs.json');

		let args: TermInitArgs = {
			bash: {
				user: user,
				fs: fsJson
			}
		};

		let terminal = new Terminal(args);
		terminal.registerCallbacks(callbackInit);

		return terminal;
	} catch (error) {
		console.error('Failed to initialize terminal:', error);
		throw error;
	} finally {
		initializing = false;
	}
}
