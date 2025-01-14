module.exports = {
	env: {
		es2021: true,
		node: true,
	},
	extends: [
		"eslint:recommended",
		"plugin:@typescript-eslint/strict",
		"prettier",
		"plugin:json/recommended-legacy",
	],
	parser: "@typescript-eslint/parser",
	parserOptions: {
		ecmaFeatures: {
			jsx: true,
		},
		ecmaVersion: 12,
		sourceType: "module",
	},
	plugins: ["@typescript-eslint"],
	root: true,
	settings: {
		react: {
			version: "detect",
		},
	},
	rules: {
		"@typescript-eslint/consistent-type-imports": "error",
	},
	ignorePatterns: ["node_modules", "build", "dist"],
	overrides: [
		{
			files: ["**/*.js", "**/*.ts"],
			rules: {
				"@typescript-eslint/no-unused-vars": "off",
				"@typescript-eslint/explicit-module-boundary-types": "off",
				"no-unused-vars": "off",
			},
		},
	],
};
