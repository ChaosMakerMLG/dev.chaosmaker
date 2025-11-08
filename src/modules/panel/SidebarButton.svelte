<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount, type Snippet } from 'svelte';

	let {
		children,
		path = '/',
		checked = false
	}: { children: Snippet; path?: string; checked?: boolean } = $props();

	onMount(() => {
		if (checked) goto(path);
	});
</script>

<label
	class="m-0 flex size-12 items-center justify-center rounded-xl bg-bg-lighter-dark shadow-subtle hover:text-primary-hover-dark has-checked:text-primary-dark has-checked:hover:text-primary-hover-dark light:bg-bg-light-light light:hover:text-primary-hover-light light:has-checked:text-primary-light light:has-checked:hover:text-primary-hover-light"
>
	<input
		onclick={() => goto(path)}
		name="langs"
		type="radio"
		class="hidden"
		id="pl"
		autocomplete="off"
		{checked}
	/>
	{@render children()}
</label>
