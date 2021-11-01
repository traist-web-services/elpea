<script lang="ts">
	import { album, track } from '$lib/stores/nowPlaying';
	let tracks = $album?.tracks?.items || [];
	tracks.sort((a, b) => a.track_number - b.track_number);
	console.log(tracks);
</script>

<div class="pl-6">
	<ol class="list-decimal">
		{#each tracks as track}<li>{track?.name}</li>{/each}
	</ol>
</div>
