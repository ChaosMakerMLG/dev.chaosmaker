import type { User } from '../bash/bash';
import type { TreeNode } from '../bash/fs';
import { Terminal, type TermInitArgs } from './terminal';

let initializing = $state(true);

export function isInitializing(): boolean {
	return initializing;
}

function jsonToNodeTable(data: any, parent?: number): Map<number, TreeNode> {
	const FsTable: Map<number, TreeNode> = new Map<number, TreeNode>;
	const keyList = Object.keys(data);

	for(const key in keyList) {
		const object = data[key];
		const node: TreeNode = {
			inode: object.Inode,
			name: object.Name,
			type: object.Type,
			interactible: object.Interactible,
			func: object.Func,
			children: [],
			content: object.Content,
			link: object.Link || [],
			permission: {
				user: {
					r: object.Permission[0]?.Read,
					w: object.Permission[0]?.Write,
					x: object.Permission[0]?.Exec
				},
				group: {
					r: object.Permission[1]?.Read,
					w: object.Permission[1]?.Write,
					x: object.Permission[1]?.Exec
				},
				other: {
					r: object.Permission[2]?.Read,
					w: object.Permission[2]?.Write,
					x: object.Permission[2]?.Exec
				}
			},
			owner: object.Owner,
			group: object.Group,
			timestamps: {
				mTime: new Date(object.TimeStamps.MTime),
				cTime: new Date(object.TimeStamps.CTime),
				aTime: new Date(object.TimeStamps.ATime)
			},
			parent: object.parent
		};

		FsTable.set(object.Inode, node);
	}
	console.log(FsTable);
	return FsTable;
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
		const fs: Map<number, TreeNode> = jsonToNodeTable(fsJson);

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
