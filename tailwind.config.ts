import type { Config } from "tailwindcss";

const config: Config = {
	content: [
		"./src/app/**/*.{ts,tsx}",
		"./src/components/**/*.{ts,tsx}",
		"./src/features/**/*.{ts,tsx}",
	],
	theme: {
		extend: {
			fontFamily: {
				body: "var(--font-body)",
				heading: "var(--font-heading)",
			},
		},
	},
	plugins: [],
};

export default config;
