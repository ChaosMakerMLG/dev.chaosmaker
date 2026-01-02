<script lang="ts">
	import type { User } from '$lib/stores/bash/bash';
	import { Terminal, type PrintData } from '$lib/stores/terminal/terminal';
	import { onMount } from 'svelte';
	import Input from './terminal/Input.svelte';
	import { initTerminal, isInitializing } from '$lib/stores/terminal/init.svelte';
	import { clear, print } from '$lib/stores/terminal/stdio';

	const clearTerminal = (): void => clear();

	const printOutput = (e: HTMLElement, d: PrintData): void => print(e, d);

	function updateTerminal() {
		username = terminal!.getUser().username;
		cwd = terminal!.getCwd();
	}

	function getWidth() {
		const e = document.getElementById('cout');
		if(!e){
			throw new Error('cant get width of the teminal element. Its null');
		}
		const padding: number = parseInt(window.getComputedStyle(e, null).getPropertyValue('padding').slice(0, -2));
		console.log(padding);
		return e.clientWidth - (padding * 2);
	}

	function handleInput(e: KeyboardEvent) {
		switch (e.key) {
			case 'Enter': {
				terminal.executeCommand(inputValue);
				updateTerminal();
				break;
			}
			case 'ArrowRight': {
				//TODO: Move cursor visually
			}
			case 'ArrowLeft': {
				//TODO: Move cursor visually
			}
			case 'ArrowUp': {
				//TODO: Make a traverse history function with up/down args
			}
			case 'ArrowDown': {
				//TODO: Make a traverse history function with up/down args
			}
		}
	}

	let callbackInit = {
		print: (data: any) => {
			const e = document.getElementById('outputWrapper');
			if (!e) return;
			printOutput(e, data);
		},
		getWidth: getWidth
	};

	let testUser: User = {
		username: 'kamil',
		passwd: '123',
		uid: 0,
		gid: 0,
		home: '/home/kamil',
		history: []
	};

	let terminal: Terminal;
	let username: string = $state(testUser.username);
	let cwd: string = $state(testUser.home);

	let inputValue = $state<string>('');

	onMount(async () => {
		try {
			terminal = await initTerminal(testUser, callbackInit);
			updateTerminal();
		} catch (error) {
			console.error('onMount trycatch failed', error);
		}
	});
</script>

<label for="input" onkeydowncapture={(e) => handleInput(e)}>
	<div id="terminal" class="terminal-window shadow-() size-full resize rounded-md shadow-bg">
		<div
			class="terminal-bar flex h-9 w-full flex-row items-center rounded-t-md bg-bg-dark text-center font-terminal text-sm font-bold text-primary-dark light:bg-bg-dark-light light:text-primary-light"
		>
			<div class="dots-wrapper mx-2.5 flex h-full flex-row items-center justify-center gap-2.5">
				<button class="size-2.5 cursor-pointer rounded-full p-0" title=""></button>
				<button class="size-2.5 cursor-pointer rounded-full p-0" title=""></button>
				<button class="size-2.5 cursor-pointer rounded-full p-0" title=""></button>
			</div>
			<div class=" flex">
				<h5>{username}</h5>
				<!-- prettier-ignore -->
				<h5 class=" mr-2">@terminal: </h5>
				<h5>{cwd}</h5>
			</div>
		</div>
		<div
			class="inner-content scroll-hidden h-[860px] origin-top overflow-y-auto rounded-b-md bg-bg-light-dark p-4 text-text-dark shadow-subtle light:bg-bg-lighter-light light:text-text-light"
			id="cout"
		>
			<div id="outputWrapper"></div>
			<Input {cwd} bind:inputValue />
		</div>
	</div>
</label>

<style>
	* {
		transition: var(--transition-standard);
	}
	.dots-wrapper {
		& > button {
			border: none;
			&:hover {
				transform: translateY(-0.1rem);
			}
			&:active {
				transform: translate(0);
			}
			&:nth-child(1) {
				background-color: rgb(255, 0, 0);
				&:active {
					background-color: rgb(255, 100, 100);
				}
			}
			&:nth-child(2) {
				background-color: rgb(255, 165, 0);
				&:active {
					background-color: rgb(255, 215, 50);
				}
			}
			&:nth-child(3) {
				background-color: rgb(50, 205, 50);
				&:active {
					background-color: rgb(100, 255, 100);
				}
			}
		}
	}
</style>
