<svg width="1em" height="1em" view-box="0 0 16 16" version="1.1" xmlns="http://www.w3.org/2000/svg">
	<defs />
	<g class="animate" fill="currentColor">
		<rect class="eq__bar eq__bar1" x="1" y="8" width="4" height="8" />
		<rect class="eq__bar eq__bar2" id="eq2" x="6" y="1" width="4" height="15" />
		<rect class="eq__bar eq__bar3" x="11" y="4" width="4" height="12" />
	</g>
</svg>

<style lang="scss">
	@keyframes eq-uppydowny {
		0% {
			//height: 20px;
			transform: scaleY(1);
		}
		50% {
			//height: 3px;
			transform: scaleY(0.5);
		}
		100% {
			//height: 20px;
			transform: scaleY(1);
		}
	}

	.eq__bar {
		position: absolute;
		bottom: 0px;
		animation-name: eq-uppydowny;
		animation-fill: forwards;
		animation-iteration-count: infinite;
		transform-origin: 8px 16px;
		-webkit-transform-origin: 8px 16px;
		rx: 0;
		ry: 0;
		&1 {
			animation-duration: 0.5s;
		}
		&2 {
			animation-duration: 1.3s;
		}
		&3 {
			animation-duration: 0.7s;
		}
	}
</style>
