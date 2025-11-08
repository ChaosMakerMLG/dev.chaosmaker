<script lang="ts">
	import { SquarePen } from '@lucide/svelte';

	let {
		langName,
		icon,
		checked = false
	}: { langName: string; icon: string; checked?: boolean } = $props();
</script>

<div
	class=" flex items-center text-text-dark saturate-50 has-checked:saturate-100 light:text-text-light"
>
	<div class=" flex w-full flex-col justify-center gap-1 rounded-lg bg-bg-mid-dark">
		<div class="flex items-center gap-2">
			<button
				class="m-2 mr-1 rounded-md bg-bg-lighter-dark p-1 shadow-subtle hover:text-primary-hover-dark active:text-primary-dark"
			>
				<SquarePen size={24} strokeWidth={1} />
			</button>
			<img alt="" width="32" height="32" src={icon} />
			<h5 class=" mr-2 font-primary font-bold">{langName}</h5>
			<label
				for={langName}
				class="relative m-2 ml-auto block h-5 w-10 cursor-pointer rounded-full bg-bg-lighter-dark shadow-subtle"
			>
				<input type="checkbox" {checked} id={langName} class=" peer sr-only" />
				<span
					class=" absolute top-0.5 left-0.5 h-4/5 w-2/5 rounded-full bg-bg-dark peer-checked:left-5.5 peer-checked:bg-primary-dark"
				></span>
			</label>
		</div>
	</div>

	<div class=" flex items-center justify-center rounded-r-lg bg-bg-dark"></div>
</div>
