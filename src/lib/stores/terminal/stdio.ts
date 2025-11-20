import { mount, unmount } from 'svelte';
import Output from '../../../modules/terminal/Output.svelte';
import { isInitializing } from './init.svelte';
import type { PrintData } from './terminal';

interface OutputProps {
	path: string;
	output: any;
	cmd: string;
}

const outputInstances = new Set<Output>();

function appendOutput(container: HTMLElement, props: OutputProps): Output | undefined {
	if (!container) return;
	const instance = mount(Output, {
		target: container,
		props
	});

	outputInstances.add(instance);
	return instance;
}

export function print(e: HTMLElement, data: PrintData): void {
	if (isInitializing()) {
		console.error('Terminal is initializing! Skipping Print');
		return;
	}
	appendOutput(e, {
		path: data.path,
		output: data.output,
		cmd: data.cmd
	});
}

export function clear(): void {
	for (const n of outputInstances) {
		unmount(n);
	}
}
