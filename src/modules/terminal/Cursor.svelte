<script lang="ts">
	let { path, output }: { path: string; output: any } = $props(); //TODO: change any to matching
</script>

<p class="cwd" id="cwd">{path}</p>
<div class="pointer-wrapper mr-4 mb-2.5 flex flex-row items-center font-terminal">
	<span class="pointer pr-2">$</span>
	<!-- prettier-ignore -->
	<div style="white-space: preserve;" class=" relative wrap-break-word">{output}</div>
</div>
