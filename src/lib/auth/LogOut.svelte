<script lang="ts">
	import { session } from '$app/stores';
	let avatar = '';
	let name = '';

	session.subscribe((val) => {
		avatar =
			(val && val.user && val.user.images && val.user.images[0] && val.user.images[0].url) ??
			val?.user?.images[0]?.url;
		name = val?.user?.display_name;
	});
</script>

<a href="/api/auth/logout" rel="external" class="flex items-center flex-shrink-0 btn"
	><img src={avatar} class="w-10 pr-2 rounded-full" alt={name} />
	<div class="flex flex-col items-center">
		<span class="-mb-1">{name}</span><small>Log Out</small>
	</div></a
>

<style>
	.btn {
		@apply bg-brand-600 text-white p-2 rounded-full pl-2 pr-4 tracking-widest uppercase text-xs font-semibold;
	}
</style>
