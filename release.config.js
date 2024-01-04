module.exports = {
	branches: ["main"],
	plugins: [
		[
			"@semantic-release/commit-analyzer",
			{
				preset: "angular",
				releaseRules: [
					{ breaking: true, release: "major" },
					{ revert: true, release: "patch" },
					{ type: "feat", release: "minor" },
					{ type: "fix", release: "patch" },
					{ type: "docs", scope: "README", release: "patch" },
					{ type: "refactor", release: "patch" },
					{ type: "style", release: "patch" }
				],
				parserOpts: {
					noteKeywords: ["BREAKING CHANGE", "BREAKING CHANGES", "BREAKING"]
				}
			}
		],
		[
			"@semantic-release/release-notes-generator",
			{
				preset: "angular",
				parserOpts: {
					noteKeywords: ["BREAKING CHANGE", "BREAKING CHANGES", "BREAKING"]
				},
				presetConfig: {
					types: [
						{
							type: "feat",
							section: ":sparkles: Features",
							hidden: false
						},
						{
							type: "fix",
							section: ":bug: Fixes",
							hidden: false
						},
						{
							type: "docs",
							section: ":memo: Documentation",
							hidden: false
						},
						{
							type: "ci",
							section: ":repeat: CI",
							hidden: false
						},
						{
							type: "chore",
							section: ":broom: Chore",
							hidden: false
						},
						{
							type: "breaking",
							section: ":boom: Breaking changes"
						}
					]
				}
			}
		],
		[
			"@google/semantic-release-replace-plugin",
			{
				replacements: [
					{
						files: ["package.json"],
						from: '"version": ".*"',
						to: '"version": "${nextRelease.version}"'
					},
					{
						files: ["app/main.ts"],
						from: '.setVersion(".*")',
						to: '.setVersion("${nextRelease.version}")'
					}
				]
			}
		],
		[
			"@semantic-release/git",
			{
				assets: ["package.json", "app/main.ts", "yarn.lock", "CHANGELOG.md"],
				message: "chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}"
			}
		],
		"@semantic-release/github"
	]
};
