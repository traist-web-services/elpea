<script lang="ts">
	import { savedTracks } from '$lib/stores/savedTracks';
	import { loading } from '$lib/stores/loading';
	import { onMount } from 'svelte';
	import { getToken } from '$lib/auth/getToken';

	let namedArtists = [];
	let uniqueArtists = [];
	let filteredArtists = [];
	let filter = '';
	let example = '';

	onMount(async () => {
		let next = 'https://api.spotify.com/v1/me/tracks';
		const token = await getToken();
		while (next) {
			const res = await fetch(next, {
				headers: { Authorization: 'Bearer ' + token }
			});
			const json = await res.json();
			next = json.next;
			savedTracks.update((savedTracks) => [...savedTracks, ...json.items]);
		}

		example = randomArtist();
		loading.set(false);
	});

	const scrollElIn = (id: string) => {
		document
			.getElementById(id)
			.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'start' });
	};
	const randomArtist = () => {
		let pick = Math.floor(Math.random() * uniqueArtists.length);
		return uniqueArtists[pick];
	};

	$: namedArtists = $savedTracks.map((item) => item?.track?.artists[0]?.name);
	$: uniqueArtists = [...new Set(namedArtists)];
	$: filteredArtists = uniqueArtists
		.filter((el) => el.toLowerCase().indexOf(filter.toLowerCase()) > -1)
		.sort();
</script>

<div class="flex flex-col h-full">
	<h2 class="p-2 pt-0 text-lg font-semibold text-brand-green-50">Search</h2>
	<input
		type="text"
		bind:value={filter}
		class="p-1 border-2 rounded-full bg-brand-50 border-brand-300"
		placeholder="eg: {example}"
	/>
	<button
		on:click={() => (filter = randomArtist())}
		class="p-1 my-2 text-sm font-semibold tracking-widest uppercase border-2 rounded-full bg-brand-500 text-brand-50 border-brand-300"
		>Random</button
	>
	<div class="overflow-scroll">
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
