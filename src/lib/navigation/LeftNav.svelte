<script>
	import RecordPlayer from '$lib/player/RecordPlayer.svelte';
	import ArtistList from './ArtistList.svelte';
</script>

<div class="flex flex-col h-full overflow-hidden">
	<div class="h-full overflow-hidden pb-2">
		<ArtistList />
	</div>
	<div>
		<RecordPlayer />
	</div>
</div>
