<script lang="ts">
	let inputElement = $state<HTMLInputElement>();

	let { value, isFocused, cwd }: { value?: string; isFocused?: boolean; cwd: string } = $props();

	export function focus() {
		console.log('WOOOOW');
		inputElement?.focus();
	}

	export function blur() {
		console.log('beeeeeeeee');
		inputElement?.blur();
	}

	export function setValue(newValue: string) {
		if (inputElement) {
			inputElement.value = newValue;
		}
	}

	export function clear() {
		setValue('');
	}

	function handleInput(event: Event) {
		value = (event.target as HTMLInputElement).value;
	}
</script>

<div class=" relative">
	<input
		bind:this={inputElement}
		oninput={handleInput}
		onfocus={() => (isFocused = true)}
		onblur={() => (isFocused = false)}
		type="text"
		class=" pointer-events-none absolute left-0 m-0 w-0 border-none p-0 opacity-0"
	/>
	<p class="cwd" id="cwd">{cwd}</p>
	<div class="w flex-column flex flex-row flex-wrap font-terminal">
		<span class="pointer pr-2">$</span>
		<!-- prettier-ignore -->
		<div style="white-space: preserve;" class=" relative wrap-break-word">{value}</div>
		<span id="cursor" class={isFocused ? 'animate-cursor-blink' : ''}>_</span>
	</div>
</div>

<style>
</style>
