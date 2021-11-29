<script lang="ts">
	import { browser } from '$app/env';
	import { player } from '$lib/stores/player';
	import { track, playing, state } from '$lib/stores/nowPlaying';

	if (browser) {
		const script = document.createElement('script');
		script.src = 'https://sdk.scdn.co/spotify-player.js';
		script.async = true;

		document.body.appendChild(script);

		let myWindow: any = window;
		myWindow.onSpotifyWebPlaybackSDKReady = () => {
			const spotify_player = new myWindow.Spotify.Player({
				name: 'Elpea',
				getOAuthToken: (cb) => {
					fetch('/api/auth/token')
						.then((r) => r.json())
						.then((res) => cb(res.spotify_access_token));
				},
				volume: 0.5
			});

			spotify_player.addListener('ready', ({ device_id }) => {
				console.log('Ready with Device ID', device_id);
				spotify_player.id = device_id;
			});

			spotify_player.addListener('not_ready', ({ device_id }) => {
				console.log('Device ID has gone offline', device_id);
			});

			spotify_player.addListener('player_state_changed', (thisState) => {
				if (!thisState) {
					return;
				}
				state.set(thisState);
				track.set(thisState.track_window.current_track);
				playing.set(thisState && !thisState.paused);
			});
			spotify_player.connect();
			$player = spotify_player;
		};
	}
</script>
