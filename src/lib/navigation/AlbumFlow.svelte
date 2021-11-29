<script lang="ts">
	import LP from '$lib/lp/LP.svelte';
	import { loading } from '$lib/stores/loading';
	import { savedTracks } from '$lib/stores/savedTracks';

	let albums = [];
	let artists = {};
	let artistsArr = [];
	let scrollPos = 0;

	const scrollPosUpdate = (e) => (scrollPos = e.target.scrollLeft);

	albums = $savedTracks.map((el) => el.track.album);
	albums.forEach((album) => {
		// Add albums under all artists named, even if only featured
		for (let artistObj of album.artists) {
			let artist = artistObj.name;
			if (!artists[artist]) {
				artists[artist] = {};
			}
			artists[artist][album.name] = album;
		}
	});

	for (const [artistName, albumsObj] of Object.entries(artists)) {
		let albums = [];
		for (const [_, albumObj] of Object.entries(albumsObj)) {
			albums.push(albumObj);
		}
		artistsArr.push({ name: artistName, albums });
		artistsArr.sort((a, b) => a.name.localeCompare(b.name, { sensitivity: 'base' }));
		artistsArr = artistsArr;
	}
</script>

<h2 class="p-2 text-2xl font-bold text-brand-50">Your Albums</h2>

<div
	class="flex flex-row overflow-x-scroll overflow-y-hidden bg-brand-grey-900"
	on:scroll={scrollPosUpdate}
	id="album-flow"
>
	{#if !$loading}
		{#each artistsArr as artist}
			<a id={artist.name}>
				<div class="flex flex-col m-2 rounded-lg bg-brand-grey-800">
					<div class="pl-6 mb-2 text-xl font-semibold one-line text-brand-50">
						{artist.name}
					</div>
					<div class="flex flex-row">
						{#each artist.albums as album}
							<LP {album} {scrollPos} />
						{/each}
					</div>
				</div>
			</a>
		{/each}
	{/if}
</div>

<style>
	#album-flow {
		scroll-behavior: smooth;
	}

	.one-line {
		display: -webkit-box;
		-webkit-line-clamp: 1;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}
</style>
