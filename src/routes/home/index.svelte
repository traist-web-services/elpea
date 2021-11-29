<script lang="ts" context="module">
</script>

<script lang="ts">
	import Loading from '$lib/loading/Loading.svelte';
	import AlbumFlow from '$lib/navigation/AlbumFlow.svelte';
	import LeftNav from '$lib/navigation/LeftNav.svelte';
	import TrackList from '$lib/player/TrackList.svelte';
	import { loading } from '$lib/stores/loading';
	let title = 'Elpea';
</script>

<svelte:head>
	<title>{title}</title>
</svelte:head>

<div class="flex h-full">
	<div class="w-1/5 h-full bg-brand-grey-900">
		<LeftNav />
	</div>
	<div class="flex flex-col w-4/5 h-full bg-brand-grey-900">
		{#if $loading}
			<div class="flex items-center justify-center w-full text-6xl text-brand-400">
				<Loading />
			</div>
		{:else}
			<div class="flex-shrink-0">
				<AlbumFlow />
			</div>
			<div class="flex-1 relative">
				<TrackList />
			</div>
		{/if}
	</div>
</div>
