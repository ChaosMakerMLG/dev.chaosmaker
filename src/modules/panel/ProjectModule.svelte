<script lang="ts">
	import { ChevronRight, Power, SquarePen } from '@lucide/svelte';

	let { projectName, checked = true }: { projectName: string; checked?: boolean } = $props();
</script>

<div
	class=" flex items-center text-text-dark saturate-50 has-checked:saturate-100 light:text-text-light"
>
	<div class=" flex w-full flex-col justify-center gap-1 rounded-lg bg-bg-mid-dark">
		<h5 class=" m-4 font-primary text-xl font-bold">{projectName}</h5>
		<div class="flex items-center gap-2">
			<label
				for={projectName}
				class="relative m-2 ml-auto block h-5 w-10 cursor-pointer rounded-full bg-bg-lighter-dark shadow-subtle"
			>
				<input type="checkbox" {checked} id={projectName} class=" peer sr-only" />
				<span
					class=" absolute top-0.5 left-0.5 h-4/5 w-2/5 rounded-full bg-bg-dark peer-checked:left-5.5 peer-checked:bg-primary-dark"
				></span>
			</label>
		</div>
	</div>

	<div class=" flex items-center justify-center rounded-r-lg bg-bg-dark"></div>
</div>
