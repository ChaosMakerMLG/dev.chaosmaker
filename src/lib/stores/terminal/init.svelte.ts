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

async function fetchFsJson(sig: string): Promise<any> {
	const signature: string | null = localStorage.getItem('signature');

	if (signature !== sig || signature === null || localStorage.getItem('fs') === null) {
		const fs: JSON = await fetchFileSystem('/src/lib/assets/fs/fs.json');
		localStorage.setItem('signature', sig);
		localStorage.setItem('fs', JSON.stringify(fs));

		console.info('FS fetched from file, new sinature:', sig);

		return fs;
	} else {
		const fs: string | null = localStorage.getItem('fs');
		if (fs === null) throw new Error('FS in LocalStorage is null!');

		console.info('FS fetched from localStorage with signature:', sig);

		return JSON.parse(fs);
	}
}

async function fetchFsSignature(path: string): Promise<any> {
	try {
		const response = await fetch(path);
		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}

		const data = await response.text();
		return data.slice(0, 36); //32 characters of uuid + 4 dashes
	} catch (error) {
		console.error('Failed to fetch the file system signature', error);
	}
}

async function fetchFileSystem(path: string): Promise<any> {
	const response = await fetch(path);
	if (!response.ok) throw new Error('Failed to fetch the file system json');

	const data = await response.json();
	return data;
}

export async function initTerminal(user: User, callbackInit: any): Promise<Terminal> {
	try {
		const sig = await fetchFsSignature('/src/lib/assets/fs/signature');
		const fsJson = await fetchFsJson(sig);
		const fs: TreeNode = jsonToTreeNode(fsJson);

		const args: TermInitArgs = {
			bash: {
				user,
				fs
			}
		};

		const terminal = new Terminal(args);
		terminal.registerCallbacks(callbackInit);

		return terminal;
	} catch (error) {
		console.error('Failed to initialize terminal:', error);
		throw error;
	} finally {
		initializing = false;
	}
}
