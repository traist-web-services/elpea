<script lang="ts">
	import AlbumFlow from '$lib/navigation/AlbumFlow.svelte';
	import LeftNav from '$lib/navigation/LeftNav.svelte';
	import TrackList from '$lib/player/TrackList.svelte';
	let title = 'Elpea';
</script>

<svelte:head>
	<title>{title}</title>
</svelte:head>

<div class="flex h-full">
	<div class="w-1/5 h-full p-2 bg-brand-grey-900">
		<LeftNav />
	</div>
	<div class="flex flex-col w-4/5 h-full p-2 bg-brand-grey-900">
		<div class="flex-shrink-0">
			<AlbumFlow />
		</div>
		<div class="flex-1">
			<TrackList />
		</div>
	</div>
</div>
