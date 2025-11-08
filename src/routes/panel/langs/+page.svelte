<script lang="ts">
	import LangModule from '../../../modules/panel/LangModule.svelte';
	import plFlag from '$lib/assets/plFlag.svg';
	import enFlag from '$lib/assets/enFlag.svg';
	import deFlag from '$lib/assets/deFlag.svg';
	import frFlag from '$lib/assets/frFlag.svg';
	import jaFlag from '$lib/assets/jaFlag.svg';
</script>

<div>
	<form name="langs" class="m-10 flex flex-col gap-4">
		<LangModule checked langName="Polish" icon={plFlag} />
		<LangModule checked langName="English" icon={enFlag} />
		<LangModule checked langName="German" icon={deFlag} />
		<LangModule langName="Japanese" icon={jaFlag} />
		<LangModule langName="French" icon={frFlag} />
	</form>
	<div></div>
</div>
