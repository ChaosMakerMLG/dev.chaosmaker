<script lang="ts">
	import { Languages, SunMoon } from '@lucide/svelte';
	import { theme } from '$lib/stores/theme';
	import plFlag from '$lib/assets/plFlag.svg';
	import enFlag from '$lib/assets/enFlag.svg';
</script>

<div
	id="footer"
	class="fixed bottom-0 flex w-max flex-row-reverse items-center justify-between p-2"
>
	<div class="footer-child flex flex-row-reverse content-start items-center" id="footer-lang-child">
		<button
			type="button"
			id="lang-switch"
			class="button rounded-lg bg-bg text-primary hover:text-primary-hover"
		>
			<Languages class="m-2.5 size-10" />
		</button>
		<div id="lang-wrapper" class="">
			<div id="pl" class="lang visible">
				<img class="flags" src={plFlag} alt="PL" height="30" width="30" />
			</div>
			<div id="en" class="lang">
				<img class="flags" src={enFlag} alt="EN" height="30" width="30" />
			</div>
			<!--  <div id="ja" class="lang"><img class="flags" src="/images/japan-svgrepo-com.svg" alt="JA" height="30" width="30"/></div>
                <div id="de" class="lang"><img class="flags" src="/images/germany-svgrepo-com.svg" alt="DE" height="30" width="30"/></div>
                <div id="fr" class="lang"><img class="flags" src="/images/france-svgrepo-com.svg" alt="FR" height="30" width="30"/></div> -->
		</div>
	</div>
	<div
		class="footer-child flex flex-row content-start items-center bg-bg text-primary hover:text-primary-hover"
		id="footer-theme-child"
	>
		<button
			type="button"
			id="theme-switch"
			class="button rounded-lg"
			onclick={() => {
				$theme = $theme === 'dark' ? 'light' : 'dark';
			}}
		>
			<SunMoon class="m-2.5 size-10" />
		</button>
	</div>
</div>

<style>
	.button {
		transition: var(--transition-standard);
		padding: 0;
		border: none;
	}
</style>
