<script lang="ts">
	import type { User } from '$lib/stores/bash/bash';
	import type { TreeNode } from '$lib/stores/bash/fs';
	import { Terminal, type TermInitArgs } from '$lib/stores/terminal';
	import {
		onDestroy,
		onMount,
		type Snippet,
		type Component,
		type ComponentProps,
		mount
	} from 'svelte';

	let { children, username, cwd }: { children: Snippet; username: string; cwd: string } = $props();

	/* function jsonToTreeNode(data: any): TreeNode {
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
			//print(data);
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
	} */

	let outputContainer = $state<HTMLElement>();
	let instances = $state<Set<ReturnType<typeof mount>>>(new Set());

	onMount(() => {
		const scrollable = document.getElementById('cout');

		const config = { childList: true };

		const callback = function (mutationList: any, observer: any) {
			for (let mutation of mutationList) {
				if (mutation.type === 'childList') {
					scrollable?.scrollTo(0, scrollable.scrollHeight);
				}
			}
		};

		const observer = new MutationObserver(callback);
		observer.observe(scrollable!, config);
	});

	export function addComponent<T extends Component>(
		component: T,
		props: ComponentProps<T> = {} as ComponentProps<T>
	): ReturnType<typeof mount> | undefined {
		if (!outputContainer) return;

		const instance = mount(component, {
			target: outputContainer,
			props
		});

		instances.add(instance);
		return instance;
	}

	export function clearComponents(): void {
		for (const instance of instances) {
			instance.$destroy();
		}
		instances.clear();
	}

	onDestroy(() => {
		for (const instance of instances) {
			instance.$destroy();
		}
	});
</script>

<div id="terminal" class="terminal-window shadow-() size-full rounded-md shadow-bg">
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
		<div bind:this={outputContainer}></div>
		{@render children()}
	</div>
</div>

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
