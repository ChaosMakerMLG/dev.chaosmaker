import type { TreeNode } from './fs';
import type { Bash } from './bash';

export enum SortNodeBy {
	NAME = 'name',
	INODE = 'inode',
	SIZE = 'size',
	EXTENSION = 'extension',
	TYPE = 'type',
	MTIME = 'modified',
	ATIME = 'accessed',
	CTIME = 'changed'
}

export class Sort {
	public static nodeArraySort(
		this: Bash,
		nodes: TreeNode[] | number[],
		reverse: boolean = false,
		sortBy: SortNodeBy = SortNodeBy.NAME
	): TreeNode[] {
		if (nodes.length === 0) throw new Error('Tried to sort an empty node array!');
		const parsedNodes: TreeNode[] = [];

		if (typeof nodes[0] === 'number') {
			for (const inode of nodes as number[]) {
				const node = this.getFs().getNodeByINode(inode);
				parsedNodes.push(node);
			}
			Sort.nodeQSort(parsedNodes, reverse, sortBy, 0, parsedNodes.length - 1);
			console.log(parsedNodes);
			return parsedNodes;
		} else {
			Sort.nodeQSort(nodes as TreeNode[], reverse, sortBy, 0, nodes.length - 1);
			console.log(nodes);
			return nodes as TreeNode[];
		}
	}

	private static nodeQSort(
		array: TreeNode[],
		reverse: boolean,
		sortBy: SortNodeBy,
		start: number,
		end: number
	) {
		if (end <= start) return;

		let pivot: number = this.nodePartition(array, reverse, sortBy, start, end);
		this.nodeQSort(array, reverse, sortBy, start, pivot - 1);
		this.nodeQSort(array, reverse, sortBy, pivot + 1, end);
	}

	private static nodePartition(
		part: TreeNode[],
		reverse: boolean,
		sortBy: SortNodeBy,
		start: number,
		end: number
	): number {
		let pivot: TreeNode = part[end];
		let i: number = start - 1;

		for (let j = start; j <= end; j++) {
			if (this.nodeCompareElements(part[j], pivot, sortBy, reverse) < 0) {
				i++;
				let temp = part[i];
				part[i] = part[j];
				part[j] = temp;
			}
		}
		i++;
		let temp = part[i];
		part[i] = part[end];
		part[end] = temp;

		return i;
	}

	private static nodeCompareElements(
		a: TreeNode,
		b: TreeNode,
		sortBy: SortNodeBy,
		reverse: boolean
	): number {
		switch (sortBy) {
			case SortNodeBy.NAME: {
				const minLength = Math.min(a.name.length, b.name.length);

				for (let i = 0; i < minLength; i++) {
					const charCodeA = a.name.charCodeAt(i);
					const charCodeB = b.name.charCodeAt(i);

					if (charCodeA !== charCodeB) {
						return reverse ? charCodeB - charCodeA : charCodeA - charCodeB;
					}
				}
				return reverse ? b.name.length - a.name.length : a.name.length - b.name.length;
			}
			case SortNodeBy.MTIME:
			case SortNodeBy.ATIME:
			case SortNodeBy.CTIME: {
				console.log(sortBy, 'sortby');
				// The sortBy serves as the lookup key in the timestamps object.
				// It works because the times in SortBy enum have assigned values matching the names of the keys in the TreeNode object
				const timeA: number = a.timestamps[sortBy].getTime();
				const timeB: number = b.timestamps[sortBy].getTime();

				return reverse ? timeA - timeB : timeB - timeA;
			}
			case SortNodeBy.SIZE: {
				return reverse ? a.size - b.size : b.size - a.size;
			}
			case SortNodeBy.EXTENSION: {
				const extA: string = a.name.split('.').pop() ?? '';
				const extB: string = b.name.split('.').pop() ?? '';
				const minLength = Math.min(extA.length, extB.length);

				for (let i = 0; i < minLength; i++) {
					const charCodeA = extA.charCodeAt(i);
					const charCodeB = extB.charCodeAt(i);

					if (charCodeA !== charCodeB) {
						return reverse ? charCodeB - charCodeA : charCodeA - charCodeB;
					}
				}
				return reverse ? extB.length - extA.length : extA.length - extB.length;
			}
			case SortNodeBy.INODE: {
				return reverse ? b.inode - a.inode : a.inode - b.inode;
			}
			case SortNodeBy.TYPE: {
				return reverse ? b.type - a.type : a.type - b.type;
			}
			default:
				throw new Error(`Sorting basis outside of the declared scope. - `);
		}
	}
}
