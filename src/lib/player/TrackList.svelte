<script lang="ts">
	import type { Album } from '$lib/types';
	import { album, track, playing } from '$lib/stores/nowPlaying';
	let playingAlbum = {} as Album;
	let tracks = [];
	album.subscribe((a) => {
		playingAlbum = a;
		tracks = a?.tracks?.items || [];
		tracks.sort((a, b) => a?.track_number - b?.track_number);
	});
</script>

<div class="pl-6">
	{#if playingAlbum}
		<h2 class="font-bold text-5xl my-2 mt-6">
			{playingAlbum?.name}
		</h2>
		<h3 class="text-3xl text-brand-grey-400 mb-8">{playingAlbum?.artists[0]?.name}</h3>
		<ol class="list-decimal pl-4 two-col text-2xl py-2 font-thin">
			{#each tracks as albumTrack}<li
					class:now-playing={$track.name.toLocaleLowerCase() ===
						albumTrack.name.toLocaleLowerCase()}
				>
					{#if $track.name.toLocaleLowerCase() === albumTrack.name.toLocaleLowerCase()}{#if $playing}▶{:else}&#1520;{/if}{/if}
					{albumTrack?.name}
				</li>{/each}
		</ol>
	{/if}
</div>

<style>
	.now-playing {
		@apply font-bold animate-pulse;
	}

	.two-col {
		columns: 2;
	}
</style>
