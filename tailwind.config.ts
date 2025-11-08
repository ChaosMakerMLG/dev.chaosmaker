import type { Config } from "tailwindcss"
export default {
	content: [],
	theme: {
		extend: {
			colors: {
                dots-bg-p: "oklch(var(--dots-bg-1))",
                dots-bg-s: "oklch(var(--dots-bg-1))",
            }
		}
	},
	plugins: []
} satisfies Config
