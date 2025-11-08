<script lang="ts">
	import TerminalModule from '../modules/Terminal.svelte';

	import { Terminal, type PrintData, type TermInitArgs } from '$lib/stores/terminal';
	import type { User } from '$lib/stores/bash/bash';
	import { onMount } from 'svelte';
	import Settings from '../modules/Settings.svelte';
	import Loading from '../modules/Loading.svelte';
	import type { TreeNode } from '$lib/stores/bash/fs';
	import Input from '../modules/terminal/Input.svelte';
	import Cursor from '../modules/terminal/Cursor.svelte';

	//let terminalMode =

	function jsonToTreeNode(data: any): TreeNode {
		return {
			name: data.Name,
			type: data.Type,
			readonly: data.ReadOnly,
			interactible: data.Interactible,
			func: data.Func,
			children: data.Children ? data.Children.map((child: any) => jsonToTreeNode(child)) : [],
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
			modtime: new Date(data.Mtime)
		};
	}

	async function fetchFileSystem(path: string): Promise<any> {
		const response = await fetch(path);
		if (!response.ok) throw new Error('Failed to fetch the file system json');

		const data = await response.json();

		const node: TreeNode = jsonToTreeNode(data);
		return node;
	}

	let callbackInit = {
		print: (data: any) => {
			console.log('print callback executed');
			print(data);
		}
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

	let isInitializing = $state(true);

	onMount(async () => {
		try {
			let fsJson = await fetchFileSystem('/src/lib/assets/fs/fs.json');

			let args: TermInitArgs = {
				bash: {
					user: testUser,
					fs: fsJson
				}
			};

			terminal = new Terminal(args);
			terminal.registerCallbacks(callbackInit);

			username = terminal.getUser().username;
			cwd = terminal.getCwd();
		} catch (error) {
			console.error('Failed to initialize terminal:', error);
		} finally {
			updateTerminal();
			isInitializing = false;
		}
	});

	function updateTerminal() {
		username = terminal!.getUser().username;
		cwd = terminal!.getCwd();
	}

	let terminalComponent = $state<any>();

	let inputComponent = $state<any>();

	function focusInput() {
		console.log('focus');
		inputComponent.focus();
	}

	function blurInput() {
		console.log('blur');
		inputComponent.blur();
	}

	function clearInput() {
		inputComponent.value = '';
	}

	function print(data: PrintData): void {
		if (isInitializing) {
			console.error('Terminal is initializing! Skipping Print');
			return;
		}
		terminalComponent.addComponent(Cursor, {
			path: data.path,
			output: data.output
		});
		updateTerminal();
	}

	function testAction() {
		if (!terminal || isInitializing) {
			console.error('Terminal is initializing!');
			return;
		}

		terminal.executeCommand('cd ~/.config');
	}
</script>

<Settings></Settings>
{#if !isInitializing}
	<div class="h-dvh w-full p-24">
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<div onclick={() => focusInput()}>
			<TerminalModule bind:this={terminalComponent} {username} {cwd}>
				<Input {cwd} bind:this={inputComponent} />
			</TerminalModule>
			<button title="" onclick={() => testAction()}>Test Action</button>
		</div>
	</div>
{:else}
	<Loading></Loading>
{/if}

<style>
</style>
