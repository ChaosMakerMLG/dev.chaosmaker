<script lang="ts">
	import '../../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import type { Snippet } from 'svelte';
	import { BookA, ChartLine, ChartNoAxesColumn, FolderArchive, Plus } from '@lucide/svelte';
	import SidebarButton from '../../modules/panel/SidebarButton.svelte';

	let { children }: { children: Snippet } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<div class="flex h-dvh w-full flex-row text-text-dark light:text-text-light">
	<div class="flex h-full w-fit flex-col items-center bg-bg-dark light:bg-bg-light">
		<img class="m-3 mb-8" alt="Logo" src={favicon} height="32" width="32" />
		<form class="flex h-full w-fit flex-col items-center gap-3">
			<label
				class="m-0 mb-4 flex size-12 items-center justify-center rounded-xl bg-bg-lighter-dark shadow-subtle hover:text-primary-hover-dark has-checked:text-primary-dark has-checked:hover:text-primary-hover-dark light:bg-bg-light-light light:hover:text-primary-hover-light light:has-checked:text-primary-light light:has-checked:hover:text-primary-hover-light"
			>
				<input name="langs" type="radio" class="hidden" id="pl" autocomplete="off" />
				<Plus strokeWidth={1} />
			</label>
			<SidebarButton checked path="/panel/projects">
				<FolderArchive strokeWidth={1} />
			</SidebarButton>
			<SidebarButton path="/panel/langs">
				<BookA strokeWidth={1} />
			</SidebarButton>
			<SidebarButton path="/panel/metrics">
				<ChartLine strokeWidth={1} />
			</SidebarButton>
			<SidebarButton path="/panel/stats">
				<ChartNoAxesColumn strokeWidth={1} />
			</SidebarButton>
		</form>
	</div>
	<div class="flex w-full grow">
		{@render children()}
	</div>
</div>

<style>
	main {
		transition:
			--dots-bg-2 0.2s ease-in,
			--dots-bg-1 0.2s ease-in;
	}
</style>
