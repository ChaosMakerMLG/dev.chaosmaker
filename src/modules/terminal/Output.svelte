<script lang="ts">
	let { path, output, cmd }: { path: string; output: any; cmd: string } = $props(); //TODO: change any to matching
</script>

<p class="cwd" id="cwd">{path}</p>
<div class="pointer-wrapper mr-4 mb-2.5 flex flex-col justify-center font-terminal">
	<div class=" flex flex-row items-center">
		<span class=" pointer self-start pr-2">$</span>
		<p>{cmd}</p>
	</div>
	<div style="white-space: preserve;" class=" relative wrap-break-word">
		{#if typeof output === 'string'}
			{output}
		{:else if output instanceof Element}
			{@html output.outerHTML}
		{:else}
			{output}
		{/if}
	</div>
</div>
