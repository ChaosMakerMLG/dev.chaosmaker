<div
	id="loader-master"
	class=" light:bg-dots-bg-2-light pointer-events-none visible absolute z-49 size-full bg-bg-dark select-none"
>
	<div id="loader" class="tran absolute top-1/2 left-1/2 z-50 -translate-x-1/2 -translate-y-1/2">
		<div id="bar-wrapper" class="flex h-full flex-row items-center gap-2">
			<div
				class="bar h-10 w-2 origin-center rounded-[3px] bg-loader-primary-dark light:bg-loader-primary-light"
			></div>
			<div
				class="bar h-10 w-2 origin-center rounded-[3px] bg-loader-primary-dark light:bg-loader-primary-light"
			></div>
			<div
				class="bar h-10 w-2 origin-center rounded-[3px] bg-loader-primary-dark light:bg-loader-primary-light"
			></div>
			<div
				class="bar h-10 w-2 origin-center rounded-[3px] bg-loader-primary-dark light:bg-loader-primary-light"
			></div>
		</div>
	</div>
</div>

<style>
	#loader-master {
		transition: all 0.3s cubic-bezier(0.41, 0.68, 0.45, 0.96);
	}

	.bar {
		animation: pulse 1s ease-in-out infinite;
	}

	.bar:nth-child(1) {
		animation-delay: 0s;
	}
	.bar:nth-child(2) {
		animation-delay: 0.1s;
	}
	.bar:nth-child(3) {
		animation-delay: 0.2s;
	}
	.bar:nth-child(4) {
		animation-delay: 0.3s;
	}

	@keyframes pulse {
		0% {
			transform: scaleY(1);
		}
		30% {
			transform: scaleY(0.35);
			background-color: oklch(0.8 0.15 292);
		}
		60% {
			transform: scaleY(1);
		}
	}
</style>
