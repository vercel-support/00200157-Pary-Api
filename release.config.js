module.exports = {
	branches: ["main"],
	plugins: [
		[
			"@semantic-release/commit-analyzer",
			{
				preset: "conventionalcommits"
			}
		],
		[
			"@semantic-release/release-notes-generator",
			{
				preset: "conventionalcommits",
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
						}
					]
				}
			}
		],
		[
			"semantic-release-replace-plugin",
			{
				replacements: [
					{
						files: ["package.json"],
						from: '"version": ".*"',
						to: '"version": "${nextRelease.version}"'
					},
					{
						files: ["app/main.ts"],
						from: /(\.setVersion\(")([^"]*)("\))/,
						to: "$1${nextRelease.version}$3"
					}
				]
			}
		],
		[
			"@semantic-release/git",
			{
				assets: ["package.json", "app/main.ts", "yarn.lock", "CHANGELOG.md"],
				message: "chore(release): ${nextRelease.version}"
			}
		],
		"@semantic-release/github"
	]
};
