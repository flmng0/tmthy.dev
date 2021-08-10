<script lang="ts">
	import LinkedSection from '$components/LinkedSection.svelte'

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

<div class="container">
	<LinkedSection id="about">
		<h1 slot="header">About Me</h1>

		<p>
			"Timothy Mitchell Davis" is the name, and programming is the game. I'm currently {age} years
			old, and have been developing since I was 9. I graduated high-school in 2020 as the DUX of
			my grade, with an ATAR of 86.55. I achieved STEM Student of the Year for the Northern Territory
			in the same year.
		</p>
		<p>
			For the past 10 years, I've been making projects to improve my skills. As every
			developer I know, I started off making games. I then moved on to game engines, and then
			automation and reporting.
		</p>

		<p>
			After all this time, making games is still my favourite passtime. I would happily show
			them to you... but my bad habit is not finishing projects. For instance, the website
			you're looking at right now went un-touched for a good month or two.
		</p>

		<p>
			For a portfolio, that last paragraph doesn't make me sound good, so let me just give you
			the "specs" instead.
		</p>
	</LinkedSection>

	<LinkedSection id="specs">
		<h1 slot="header">The Specs (Qualifications)</h1>

		<LinkedSection id="specs--certificates">
			<h2 slot="header">Certificates</h2>

			<p>
				Following are awards and certifications that make me feel like less of an imposter:
			</p>
			<ul>
				<li class="in-progress" data-year="2021">
					Certificate III in Information, Digital Media and Technology
				</li>
				<li data-year="2020">STEM Student of the Year for the Northern Territory</li>
				<li data-year="2019">80% Certification Toward Cisco IT Essentials</li>
				<!-- <li></li> -->
			</ul>
			<p class="special-notes">
				<span style="font-size: 1.25em;">*</span> Currently in progress
			</p>
		</LinkedSection>

		<!-- <LinkedSection id="specs--experience">
			<h2 slot="header">Work Experience</h2>
		</LinkedSection> -->
	</LinkedSection>
</div>

<style lang="scss">
	.container > :not(:first-child) {
		margin-top: 4.5em;
	}

	h1,
	h2 {
		text-transform: uppercase;
		letter-spacing: 0.3em;
	}

	h1 {
		font-size: 1.8em;
	}

	h2 {
		font-size: 1.5em;
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
