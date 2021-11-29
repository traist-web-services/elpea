<script lang="ts">
	import { playing, track, state, album } from '$lib/stores/nowPlaying';

	const minAngle = 14;
	const maxAngle = 36;

	let rotationDegree = 0;
	let percentageComplete = 0;
	let albumDuration = 0;
	let totalPlayed = 0;
	let labelImage = '';

	$: {
		labelImage = $track?.album?.images[0].url;
		albumDuration = $album?.tracks?.items.reduce(
			(acc: number, curr: { duration_ms: number }) => acc + curr.duration_ms,
			0
		);
		let playingTrack = $album?.tracks?.items?.findIndex((el: any) => {
			return el?.name.toLowerCase() === $track?.name.toLowerCase();
		});
		let playedTracks = $album?.tracks?.items?.slice(0, playingTrack);
		totalPlayed =
			$state?.position +
			playedTracks?.reduce((acc: number, curr: any) => acc + curr.duration_ms, 0);
		rotationDegree = $playing ? minAngle + percentageComplete * (maxAngle - minAngle) : 0;
		percentageComplete = totalPlayed / albumDuration;
	}
</script>

<div class="container">
	<div class="record" class:playing={$playing} />
	<div class="label" class:playing={$playing} style="background-image: url({labelImage})" />
	<div class="recordarm" style="--rotation-degree: {rotationDegree}deg">
		<div class="pivot" />
		<div class="arm" />
		<div class="elbow">
			<div class="tip">
				<div class="needle" />
			</div>
		</div>
	</div>
</div>

<style lang="scss">
	.container {
		display: block;
		position: relative;
		overflow: hidden;
		width: 100%;
		margin: auto;
		border-radius: 10px;
		box-shadow: 0 6px #99907e;
		background: var(--record-player);
		margin: auto;
		--record-black: #2a2928;
		--needle-tip: #aaa9ad;
		--record-arm: #aaa9ad;
		--arm-tip: #2a2928;
		--arm-pivot: #2a2928;
		--label: #da5b33;
		--tracks: #ada9a0;
		--record-player: #caa472;
	}

	.record {
		position: relative;
		margin: 2% auto;
		width: 70%;
		padding-bottom: 70%;
		border-radius: 50%;
		background: linear-gradient(30deg, transparent 40%, rgba(42, 41, 40, 0.85) 40%) no-repeat 100% 0,
			linear-gradient(60deg, rgba(42, 41, 40, 0.85) 60%, transparent 60%) no-repeat 0 100%,
			repeating-radial-gradient(
				var(--record-black),
				var(--record-black) 4px,
				var(--tracks) 5px,
				var(--record-black) 6px
			);
		background-size: 50% 100%, 100% 50%, 100% 100%;
		&.playing {
			-webkit-animation-name: rotate;
			-webkit-animation-duration: 1.8s;
			-webkit-animation-iteration-count: infinite;
			-webkit-animation-timing-function: linear;
		}
	}

	/*.playing .recordArm {
  Max rotation is 35, min is 14 
  --rotation: 14deg;
}*/

	.label {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: 25%;
		padding-bottom: 25%;
		border-radius: 50%;
		box-shadow: 0 0 0 4px var(--label), inset 0 0 0 0 var(--label),
			inset 0 0 0 5px var(--record-black);
		background-size: contain;
		background-position: 50% 50%;
		&.playing {
			-webkit-animation-name: rotate-label;
			-webkit-animation-duration: 1.8s;
			-webkit-animation-iteration-count: infinite;
			-webkit-animation-timing-function: linear;
		}
	}

	.recordarm {
		position: absolute;
		top: 5%;
		right: 5%;
		height: 50%;
		-moz-transform: rotate(var(--rotation-degree));
		-webkit-transform: rotate(var(--rotation-degree));
		transform: rotate(var(--rotation-degree));
		transform-origin: 50% 5%;
		transition-property: transform;
		transition-duration: 1s;

		.arm {
			background: var(--record-arm);
			width: 10px;
			height: 100%;
			border-radius: 30px 30px 30px 0px;
		}

		.pivot {
			background: var(--arm-pivot);
			width: 20px;
			height: 20px;
			position: absolute;
			top: 5%;
			left: -5px;
			border-radius: 50%;
		}

		.tip {
			background: var(--arm-tip);
			padding-bottom: 400%;
			width: 200%;
			height: 15%;
			position: relative;
			border-radius: 3px;
			left: 50%;
			transform: translate(-50%, 0%);
		}

		.needle {
			background: var(--needle-tip);
			width: 2px;
			height: 6px;
			position: absolute;
			left: 50%;
			transform: translate(-50%, 0%);
			bottom: -4px;
			border-radius: 3px;
		}
	}

	@-moz-keyframes rotate {
		100% {
			-moz-transform: rotate(360deg);
		}
	}
	@-webkit-keyframes rotate {
		100% {
			-webkit-transform: rotate(360deg);
		}
	}
	@keyframes rotate {
		100% {
			-webkit-transform: rotate(360deg);
			transform: rotate(360deg);
		}
	}

	@-moz-keyframes rotate-label {
		100% {
			-moz-transform: translate(-50%, -50%) rotate(360deg);
		}
	}
	@-webkit-keyframes rotate-label {
		100% {
			-webkit-transform: translate(-50%, -50%) rotate(360deg);
		}
	}
	@keyframes rotate-label {
		100% {
			-webkit-transform: translate(-50%, -50%) rotate(360deg);
			transform: translate(-50%, -50%) rotate(360deg);
		}
	}
</style>
