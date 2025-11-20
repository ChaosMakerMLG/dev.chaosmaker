import type { TreeNode } from './fs';

export function asciiByteQSort(array: TreeNode[]) {
	qSort(array, 0, array.length - 1);
}

function qSort(array: TreeNode[], start: number, end: number) {
	if (end <= start) return;

	let pivot: number = partition(array, start, end);
	qSort(array, start, pivot - 1);
	qSort(array, pivot + 1, end);
}

function partition(part: TreeNode[], start: number, end: number): number {
	let pivot: TreeNode = part[end];
	let i: number = start - 1;

	for (let j = start; j <= end; j++) {
		if (compareStrings(part[j].name, pivot.name) < 0) {
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

function compareStrings(a: string, b: string): number {
	const minLength = Math.min(a.length, b.length);

	for (let i = 0; i < minLength; i++) {
		const charCodeA = a.charCodeAt(i);
		const charCodeB = b.charCodeAt(i);

		if (charCodeA !== charCodeB) {
			return charCodeA - charCodeB;
		}
	}
	return a.length - b.length;
}
