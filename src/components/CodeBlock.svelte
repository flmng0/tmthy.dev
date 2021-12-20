<script lang="ts">
	import { onMount } from "svelte";
	import { slide } from "svelte/transition";
	import prism from "prismjs";

	export let dataSrc: string;
	export let language: string;

	export let height = null;

	function loaded(node: HTMLElement) {
		prism.highlightElement(node, true);

		prism.hooks.add("complete", () => {
			height = getComputedStyle(node).height;
		});
	}
</script>

<pre use:loaded class="language-{language}" data-src={dataSrc} />

<style global lang="scss">
	body,
	body[data-theme="dark"] {
		pre[class*="language-"] {
			--background: #32302f;
			--base: #d4be98;
			--comment: #928374;
			--keyword: #e78a4e;
			--function: #a9b665;
			--string: #d8a657;
			--number: #d3869b;
			--tags: #7daea3;

			::selection {
				background-color: #5a524c;
			}
		}
	}
	// This is a comment

	body[data-theme="light"] {
		pre[class*="language-"] {
			--background: #f5f5f5;
			--base: #654735;
			--comment: #928374;
			--keyword: #c35e0a;
			--function: #6c782e;
			--string: #b47109;
			--number: #945e80;
			--tags: #45707a;

			::selection {
				background-color: #c9d0d9;
			}
		}
	}

	pre[class*="language-"] {
		--important: var(--string);

		overflow: auto;
		padding: 1.5rem 2rem;
		margin: 0;
	}

	code[class*="language-"],
	pre[class*="language-"] {
		font-family: Fira Code, Consolas, "Courier New", monospace;
		font-size: 0.9rem;

		color: var(--base);
		background: none;

		tab-size: 4;
		text-align: left;
		white-space: pre;

		word-spacing: normal;
		word-break: normal;
		word-wrap: normal;
		hyphens: none;
	}

	:not(pre) > code[class*="language-"],
	pre[class*="language-"] {
		background: var(--background);
	}

	/*	tokens --------------------------------- */
	.token.comment,
	.token.prolog,
	.token.doctype,
	.token.cdata {
		color: var(--comment);
	}

	.token.punctuation {
		color: var(--base);
	}

	.token.property,
	.token.tag,
	.token.constant,
	.token.symbol,
	.token.deleted {
		color: var(--tags);
	}

	.token.boolean,
	.token.number {
		color: var(--number);
	}

	.token.selector,
	.token.attr-name,
	.token.string,
	.token.char,
	.token.builtin,
	.token.inserted {
		color: var(--string);
	}

	.token.operator,
	.token.entity,
	.token.url,
	.language-css .token.string,
	.style .token.string,
	.token.variable {
		color: var(--base);
	}

	.token.atrule,
	.token.attr-value,
	.token.function,
	.token.class-name {
		color: var(--function);
	}

	.token.keyword {
		color: var(--keyword);
	}

	.token.regex,
	.token.important {
		color: var(--important);
	}

	.token.important,
	.token.bold {
		font-weight: bold;
	}
	.token.italic {
		font-style: italic;
	}
	.token.entity {
		cursor: help;
	}
</style>
