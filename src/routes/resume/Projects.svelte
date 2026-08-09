{#snippet link(
	/** @type {string} */ title,
	/** @type {string} */ href,
	/** @type {string} */ display
)}
	<p>({title}: <a class="not-prose" {href}>{display}</a>)</p>
{/snippet}
{#snippet shortLink(/** @type {string} */ name, /** @type {string} */ href)}
	{@render link(name, `https://${href}`, href)}
{/snippet}

{#snippet ghLink(/** @type {string} */ repo)}
	{@const path = `flmng0/${repo}`}
	{@render link('GitHub', `https://github.com/${path}`, path)}
{/snippet}

<div class="prose prose-p:mb-0 prose-p:not-first:mt-0 prose-li:my-0">
	<ul class="projects flex flex-col space-y-12">
		<li>
			<p>
				Portfolio website written using SvelteKit.
				<span class="print:hidden">(you're looking at it :P)</span>
			</p>
			(<a class="not-prose" href="https://timd.dev">timd.dev</a>)
		</li>
		<li>
			<p>Real-time synchronised pixel-art canvas written with Go and Svelte.</p>
			{@render shortLink('Shanvas', 'timd.dev/toys/shanvas')}
		</li>
		<li>
			<p>Real-time syncrhonised volleyball scoring application written with Phoenix / Elixir.</p>
			{@render shortLink('Volley Kit', 'volley-kit.timd.dev')}
		</li>
		<li>
			<p>
				Self-hosted invoicing system to simplify storage and delivery of invoices to clients when
				freelancing.
			</p>
			{@render shortLink('Cabinet', 'timd.dev/projects/cabinet')}
		</li>
		<li>
			<p>Keyboard firmware using QMK, written in C.</p>
			{@render ghLink('keyboard')}
		</li>
		<li>
			<p>Processing-esque creative coding library for Rust using WebGPU.</p>
			{@render ghLink('peach')}
		</li>
	</ul>
</div>
