import type { TreeNode } from './fs';

export function asciiByteQSort(array: TreeNode[], reverse: boolean) {
	qSort(array, 0, array.length - 1, reverse);
}

function qSort(array: TreeNode[], start: number, end: number, reverse: boolean) {
	if (end <= start) return;

	let pivot: number = partition(array, start, end, reverse);
	qSort(array, start, pivot - 1, reverse);
	qSort(array, pivot + 1, end, reverse);
}

function partition(part: TreeNode[], start: number, end: number, reverse: boolean): number {
	let pivot: TreeNode = part[end];
	let i: number = start - 1;

	for (let j = start; j <= end; j++) {
		if (compareStrings(part[j].name, pivot.name, reverse) < 0) {
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

function compareStrings(a: string, b: string, reverse: boolean): number {
	const minLength = Math.min(a.length, b.length);

	for (let i = 0; i < minLength; i++) {
		const charCodeA = a.charCodeAt(i);
		const charCodeB = b.charCodeAt(i);

		if (charCodeA !== charCodeB) {
			return reverse ? charCodeB - charCodeA : charCodeA - charCodeB;
		}
	}

	return reverse ? b.length - a.length : a.length - b.length;
}
