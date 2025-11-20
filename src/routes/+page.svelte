<script lang="ts">
	import TerminalModule from '../modules/Terminal.svelte';
	import Settings from '../modules/Settings.svelte';
	import Loading from '../modules/Loading.svelte';
	import { isInitializing } from '$lib/stores/terminal/init.svelte';
</script>

<Settings></Settings>
<div class="h-dvh w-full p-24">
	<TerminalModule />
</div>

<style>
</style>
