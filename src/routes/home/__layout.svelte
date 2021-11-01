<script>
	import NavBar from '$lib/navigation/NavBar.svelte';
	import Footer from '$lib/navigation/Footer.svelte';
</script>

<div
	class="flex flex-col h-screen overflow-hidden font-light tracking-tight bg-brand-grey-900 text-brand-grey-300"
>
	<NavBar />
	<main class="flex-grow h-full overflow-hidden">
		<slot />
	</main>
	<Footer />
</div>
