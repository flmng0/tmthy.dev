<script lang="ts">
	import CardList from '$components/CardList.svelte'
	import DisplayCard from '$components/DisplayCard.svelte'
</script>

<main>
	<CardList>
		<DisplayCard
			href="#"
			name="Card Test"
			description="This is a test to make sure the styling of the cards look somewhat decent"
		/>

		<DisplayCard
			href="#"
			name="Card With Image Test"
			description="This is a test to make sure the styling of the cards with images in them look somewhat decent"
			imageSrc="https://picsum.photos/512/512"
		/>
	</CardList>
</main>

<style lang="scss">
	main {
		width: min(100%, 60rem);
		margin: 1em auto;
	}
</style>
