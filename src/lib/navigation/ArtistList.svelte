<script lang="ts">
	import { savedTracks } from '$lib/stores/savedTracks';
	import { loading } from '$lib/stores/loading';
	import { getToken } from '$lib/auth/getToken';
	import { playAlbum } from '$lib/spotify/spotify';
	import { session } from '$app/stores';
	import { player } from '$lib/stores/player';
	import { album as playingAlbum } from '$lib/stores/nowPlaying';
	import type { Track } from '$lib/types';

	let namedArtists = [];
	let uniqueArtists = [];
	let filteredArtists = [];
	let filter = '';
	let example: Track = null;

	let next = 'https://api.spotify.com/v1/me/tracks';
	const populateTrackList = async () => {
		const token = await getToken();
		while (next) {
			const res = await fetch(next, {
				headers: { Authorization: 'Bearer ' + token }
			});
			const json = await res.json();

			if ($savedTracks.length === json.total) {
				break;
			}
			next = json.next;
			savedTracks.update((savedTracks) => [...savedTracks, ...json.items]);
		}

		namedArtists = $savedTracks?.map((item) => item?.track?.artists[0]?.name);
		uniqueArtists = [...new Set(namedArtists)];

		example = randomTrack();
		$loading = false;
	};

	const scrollElIn = (id: string) => {
		document
			.getElementById(id)
			.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'start' });
	};
	const randomTrack = () => {
		let pick = Math.floor(Math.random() * $savedTracks.length);
		return $savedTracks[pick];
	};

	const playRandomAlbum = async () => {
		const albumId = randomTrack().track.album;
		$playingAlbum = await playAlbum(albumId, $player, $session);
	};

	populateTrackList();
	$: filteredArtists = uniqueArtists
		.filter((el) => el.toLocaleLowerCase().indexOf(filter.toLocaleLowerCase()) > -1)
		.sort((a, b) => a.localeCompare(b, { sensitivity: 'base' }));
</script>

<div class="flex flex-col h-full p-2">
	<h2 class="p-2 pt-0 text-lg font-semibold text-brand-green-50">Search</h2>
	<input
		type="text"
		bind:value={filter}
		class="p-1 border-2 rounded-full bg-brand-50 border-brand-300"
		placeholder={example?.track?.artists[0]?.name ?? 'Loading...'}
	/>
	<button
		on:click={playRandomAlbum}
		class="p-1 my-2 text-sm font-semibold tracking-widest uppercase border-2 rounded-full bg-brand-500 text-brand-50 border-brand-300"
		>Random</button
	>
	<div class="overflow-auto overflow-x-hidden">
		<ul>
			{#each filteredArtists as artist (artist)}
				<!-- svelte-ignore a11y-missing-attribute because this is not an actual link for navigation purposes -->
				<li class="py-1 transition-colors duration-200 hover:text-brand-50">
					<a on:click={() => scrollElIn(artist)}>{artist}</a>
				</li>
			{/each}
		</ul>
	</div>
</div>
