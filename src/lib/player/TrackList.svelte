<script lang="ts">
	import { album, track, playing } from '$lib/stores/nowPlaying';
	let tracks = [];
	let artistList = '';
	let albumImg = '';
	$: {
		tracks = $album?.tracks?.items || [];
		albumImg = $album?.images[0].url;
		tracks.sort((a, b) => a?.track_number - b?.track_number);
		artistList = $album?.artists?.map((artist) => artist.name).join(', ');
	}
</script>

{#if $album}
	<div
		class="h-full absolute top-0 right-0"
		style="aspect-ratio: 1/1; 
			-webkit-mask-image: linear-gradient(to left, rgba(0,0,0,0.7), transparent 99%);"
	>
		<img src={albumImg} class="object-cover" alt="Album cover" />
	</div>
	<div class="p-2 pl-6 h-full">
		<h2 class="font-bold text-5xl my-2 mt-6">
			{$album?.name}
		</h2>
		<h3 class="text-3xl text-brand-grey-400 mb-8">{artistList}</h3>
		<ol class="list-decimal pl-4 two-col text-2xl py-2 font-thin">
			{#each tracks as albumTrack}<li
					class:now-playing={$track.name.toLocaleLowerCase() ===
						albumTrack.name.toLocaleLowerCase()}
				>
					{#if $track.name.toLocaleLowerCase() === albumTrack.name.toLocaleLowerCase()}{#if $playing}▶{:else}&#1520;{/if}{/if}
					{albumTrack?.name}
				</li>{/each}
		</ol>
	</div>
{/if}

<style>
	.now-playing {
		@apply font-bold animate-pulse;
	}

	.two-col {
		columns: 2;
	}
</style>
