<script>
	import { session } from '$app/stores';
	import LogOut from '$lib/auth/LogOut.svelte';
	import Player from '$lib/player/Player.svelte';
	let user;
	user = $session.user;
</script>

<nav class="flex items-center p-2 border-b-2 bg-brand-900 border-brand-400">
	<div class="flex-1 pl-2">
		<h1 class="text-2xl font-light font-header text-brand-50">Elpea</h1>
	</div>

	<Player />
	{#if user}
		<LogOut />
	{/if}
</nav>
