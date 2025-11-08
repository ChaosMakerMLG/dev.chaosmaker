<script lang="ts">
	import { Languages, Settings2, SunMoon } from '@lucide/svelte';
	import { theme } from '$lib/stores/theme';
	import plFlag from '$lib/assets/plFlag.svg';
	import enFlag from '$lib/assets/enFlag.svg';
	import deFlag from '$lib/assets/deFlag.svg';
	import frFlag from '$lib/assets/frFlag.svg';
	import jaFlag from '$lib/assets/jaFlag.svg';

	function toggleSettings() {
		const settingsMenu = window.document.getElementById('settings-menu');
		const langsMenu = window.document.getElementById('langs-menu');
		langsMenu?.classList.add('hide');
		settingsMenu?.classList.toggle('hide');
	}

	function toggleLangs() {
		const langsMenu = window.document.getElementById('langs-menu');
		langsMenu?.classList.toggle('hide');
	}
</script>

<div
	id="options"
	class="absolute top-0 left-0 isolate mx-4 rounded-b-xl bg-bg-dark light:bg-bg-light"
>
	<section class="hide grid" id="settings-menu">
		<div class="flex flex-col items-center justify-center gap-4 overflow-hidden">
			<div class=" mt-4 flex items-center justify-center rounded-lg">
				<button
					class=" rounded-lg bg-bg-lighter-dark p-1.5 text-text-dark shadow-button duration-75 hover:text-primary-hover-dark active:translate-y-0.5 light:bg-bg-lighter-light light:text-text-muted-light light:hover:text-primary-hover-light"
					id="theme-btn"
					onclick={() => {
						$theme = $theme === 'dark' ? 'light' : 'dark';
					}}
				>
					<SunMoon strokeWidth={1} size={32} />
				</button>
			</div>
			<div class="flex flex-col content-center items-center">
				<button
					class="z-3 mb-4 rounded-lg bg-bg-lighter-dark p-1.5 text-text-dark duration-75 hover:text-primary-hover-dark active:translate-y-0.5 light:bg-bg-lighter-light light:text-text-muted-light light:hover:text-primary-hover-light"
					id="langs-btn"
					onclick={toggleLangs}
				>
					<Languages strokeWidth={1} size={32} />
				</button>
				<form id="langs-menu" class="hide grid">
					<div class="z-2 mb-4 flex flex-col items-center gap-2 overflow-hidden">
						<label
							class="border-primary-dark duration-100 hover:ml-1 hover:pl-1 has-checked:border-l-3 has-checked:hover:m-0 has-checked:hover:p-0 light:border-primary-light"
						>
							<input name="langs" type="radio" class="lang hidden" id="pl" autocomplete="off" />
							<img class="flags mx-2" src={plFlag} alt="PL" height="26" width="26" />
						</label>
						<label
							class="border-primary-dark duration-100 hover:ml-1 hover:pl-1 has-checked:border-l-3 has-checked:hover:m-0 has-checked:hover:p-0 light:border-primary-light"
						>
							<input name="langs" type="radio" class="lang hidden" id="en" autocomplete="off" />
							<img class="flags mx-2" src={enFlag} alt="EN" height="26" width="26" />
						</label>
						<label
							class="border-primary-dark duration-100 hover:ml-1 hover:pl-1 has-checked:border-l-3 has-checked:hover:m-0 has-checked:hover:p-0 light:border-primary-light"
						>
							<input name="langs" type="radio" class="lang hidden" id="en" autocomplete="off" />
							<img class="flags mx-2" src={deFlag} alt="DE" height="26" width="26" />
						</label>
						<label
							class="border-primary-dark duration-100 hover:ml-1 hover:pl-1 has-checked:border-l-3 has-checked:hover:m-0 has-checked:hover:p-0 light:border-primary-light"
						>
							<input name="langs" type="radio" class="lang hidden" id="en" autocomplete="off" />
							<img class="flags mx-2" src={jaFlag} alt="JA" height="26" width="26" />
						</label>
						<label
							class="border-primary-dark duration-100 hover:ml-1 hover:pl-1 has-checked:border-l-3 has-checked:hover:m-0 has-checked:hover:p-0 light:border-primary-light"
						>
							<input name="langs" type="radio" class="lang hidden" id="en" autocomplete="off" />
							<img class="flags mx-2" src={frFlag} alt="FR" height="26" width="26" />
						</label>
					</div>
				</form>
			</div>
		</div>
	</section>
	<button
		class="rounded-b-xl border-t bg-bg-light-dark p-2 text-text-dark shadow-button hover:text-primary-dark light:bg-bg-lighter-light light:text-text-muted-light light:hover:text-primary-light"
		id="settings-btn"
		onclick={toggleSettings}
	>
		<Settings2 strokeWidth={1} size={38} />
	</button>
</div>

<style>
	#langs-menu {
		transition: 0.2s ease-in;
		grid-template-rows: 1fr;
		&.hide {
			grid-template-rows: 0fr;
		}
	}

	#settings-menu {
		transition: 0.2s ease-in;
		grid-template-rows: 1fr;
		&.hide {
			grid-template-rows: 0fr;
		}
	}
</style>
