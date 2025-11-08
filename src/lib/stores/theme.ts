import { writable } from 'svelte/store';

function getInitalTheme(): string {
	if (typeof window === 'undefined') return 'dark';

	const savedTheme: string | null = localStorage.getItem('theme');
	if (savedTheme === 'dark' || savedTheme === 'light') return savedTheme;

	const sysPrefTheme = window.matchMedia('(prefers-color-scheme: dark)').matches;
	return sysPrefTheme ? 'dark' : 'light';
}

export const theme = writable(getInitalTheme());

theme.subscribe((value) => {
	if (typeof window !== 'undefined') localStorage.setItem('theme', value);
});
