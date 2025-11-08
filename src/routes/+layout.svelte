<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import { onMount, type Snippet } from 'svelte';
	import { theme } from '$lib/stores/theme';

	let { children }: { children: Snippet } = $props();

	let bg1: string | null;
	let bg2: string | null;

	onMount(() => {
		const style = window.getComputedStyle(document.documentElement);

		bg1 = style.getPropertyValue('--dots-bg-1');
		bg2 = style.getPropertyValue('--dots-bg-2');

		if (bg2 && bg1) {
			window.CSS.registerProperty({
				name: '--dots-bg-2',
				syntax: '<color>',
				inherits: true,
				initialValue: bg2
			});

			window.CSS.registerProperty({
				name: '--dots-bg-1',
				syntax: '<color>',
				inherits: true,
				initialValue: bg1
			});
		}
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<main
	class="text-text m-auto flex min-h-dvh w-full flex-col items-center justify-center overflow-hidden bg-dots-bg bg-size-[20px_20px]"
	class:dark={$theme === 'dark'}
	class:light={$theme === 'light'}
>
	{@render children()}
</main>

<style>
	main {
		transition:
			--dots-bg-2 0.2s ease-in,
			--dots-bg-1 0.2s ease-in;
	}
</style>
