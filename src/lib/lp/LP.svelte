<script lang="ts">
	import { onMount } from 'svelte';
	import { playAlbum } from '$lib/spotify/spotify';
	import { session } from '$app/stores';

	import { player } from '$lib/stores/player';
	import { album as playingAlbum } from '$lib/stores/nowPlaying';
	export let album = null;
	export let scrollPos = 0;

	let showLP = false;
	let el = null;
	let clLeft = 0;
	let bgString = null;

	onMount(() => {
		clLeft = el.getBoundingClientRect().left;
	});

	$: bgString =
		scrollPos > clLeft - 2000 ? `background-image: url('${album.images[0].url}')` : null;
</script>

<div
	class="flex flex-col items-center flex-shrink-0 h-56 w-52"
	on:mouseover={() => (showLP = true)}
	on:focus={() => (showLP = true)}
	on:mouseout={() => (showLP = false)}
	on:blur={() => (showLP = false)}
	on:click={async () => {
		$playingAlbum = await playAlbum(album, $player, $session);
	}}
	bind:this={el}
>
	<div class="relative w-40 h-40 rounded">
		<div
			class="relative z-10 flex-shrink-0 w-40 h-40 overflow-hidden rounded-md album-cover lp"
			style={bgString}
		/>
		<div
			class="absolute top-0 left-0 z-0 w-full h-full transition-transform duration-200 transform bg-black rounded-full"
			class:-translate-x-6={showLP}
		/>
	</div>
	<p class="w-40 two-lines">
		{album.name}
	</p>
</div>

<style>
	.two-lines {
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}
	.album-cover {
		background-size: cover;
	}

	.lp:after {
		content: '';
		position: absolute;
		top: -110%;
		left: -210%;
		width: 200%;
		height: 200%;
		opacity: 0;
		transform: rotate(30deg);

		background: rgba(255, 255, 255, 0.13);
		background: linear-gradient(
			to right,
			rgba(255, 255, 255, 0.13) 0%,
			rgba(255, 255, 255, 0.13) 77%,
			rgba(255, 255, 255, 0.5) 92%,
			rgba(255, 255, 255, 0) 100%
		);
	}

	/* Hover state - trigger effect */

	.lp:hover:after {
		opacity: 1;
		top: -30%;
		left: -30%;
		transition-property: left, top, opacity;
		transition-duration: 0.7s, 0.7s, 0.15s;
		transition-timing-function: ease;
	}

	/* Active state */

	.lp:active:after {
		opacity: 0;
	}
</style>
