<script lang="ts">
	const birthday = new Date(2002, 9, 7)
	const today = new Date()

	const difference = +today - +birthday
	const days = Math.ceil(difference / (1000 * 3600 * 24))
	const years = days / 365.25 // close enough
	const age = Math.round((years + Number.EPSILON) * 1000) / 1000
</script>

<svelte:head>
	<title>flmng0</title>
</svelte:head>

<section id="about">
	<h1>About Me</h1>

	<p>
		"Timothy Mitchell Davis" is the name, and programming is the game. I'm currently {age} years
		old, and have been developing since I was 9. I graduated in 2020 as the DUX of my high-school,
		with an ATAR of 86.55.
	</p>
	<p>
		For the past 10 years, I've been making projects to improve my skills. As every developer I
		know, I started off making games. I then moved on to game engines, and then automation and
		reporting.
	</p>

	<p>
		After all this time, making games is still my favourite passtime. I would happily show them
		to you... but my bad habit is not finishing projects. For instance, the website you're
		looking at right now went un-touched for a good month or two.
	</p>

	<p>
		For a portfolio, this isn't making me sound good, so let me just give you the "specs"
		instead.
	</p>
</section>

<section id="specs">
	<h1>The Specs (Certifications)</h1>

	<p>Following are awards and certifications that make me feel like less of an imposter:</p>
	<ul>
		<li class="in-progress" data-year="2021">
			Certificate III in Information, Digital Media and Technology
		</li>
		<li data-year="2020">STEM Student of the Year for the Northern Territory</li>
		<li data-year="2019">80% Certification Toward Cisco IT Essentials</li>
		<!-- <li></li> -->
	</ul>
	<p class="special-notes"><span style="font-size: 1.25em;">*</span> Currently in progress</p>
</section>

<style lang="scss">
	h1 {
		text-transform: uppercase;
		letter-spacing: 0.3em;
	}

	section + section {
		margin-top: 4.5em;

		// font: inherit;
	}

	p,
	li {
		line-height: 2.1em;
		letter-spacing: 0.05em;
	}

	p + p {
		margin-top: 2.3em;
	}

	ul {
		list-style: none;
		margin-left: 1em;
		width: 100%;
	}

	li {
		width: 100%;
		padding-left: 1em;
		position: relative;

		&.in-progress {
			&::before {
				content: '*';
				font-weight: bold;
				font-size: 1.25em;
				position: absolute;
				left: 0;
			}
		}

		&::after {
			content: attr(data-year);
			position: absolute;
			right: 100%;
		}
	}

	.special-notes {
		font-weight: bold;
		font-style: italic;
	}
</style>
