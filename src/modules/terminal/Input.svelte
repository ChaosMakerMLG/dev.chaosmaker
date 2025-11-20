<script lang="ts">
	let {
		inputValue = $bindable(),
		isFocused,
		cwd
	}: { inputValue: string; isFocused?: boolean; cwd: string } = $props();

	function handleInput(event: Event) {
		inputValue = (event.target as HTMLInputElement).value;
	}
</script>

<div class=" relative">
	<input
		bind:value={inputValue}
		onkeydown={(e) => e.key === 'Enter' && (inputValue = '')}
		oninput={handleInput}
		onfocus={() => (isFocused = true)}
		onblur={() => (isFocused = false)}
		type="text"
		autocapitalize="off"
		autocomplete="off"
		autocorrect="off"
		class=" pointer-events-none absolute left-0 m-0 w-0 border-none p-0 opacity-0"
		id="input"
	/>
	<p class="cwd" id="cwd">{cwd}</p>
	<div class="w flex-column flex flex-row flex-wrap font-terminal">
		<span class="pointer pr-2">$</span>
		<!-- prettier-ignore -->
		<div style="white-space: preserve;" class=" relative wrap-break-word">{inputValue}</div>
		<span id="cursor" class={isFocused ? 'animate-cursor-blink' : ''}>_</span>
	</div>
</div>

<style>
</style>
