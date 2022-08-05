const scroller = scrollama();

	scroller
		.setup({
			step: "#scrolly .scrolly-overlay .step",
			offset: 0.5,
			debug: false
		})
		.onStepEnter(function({ element, index, direction}) {
			const event = new CustomEvent('stepin', { detail: { direction: direction } })
			element.dispatchEvent(event);
		})
		.onStepExit(function({ element, index, direction }) {
			const event = new CustomEvent('stepout', { detail: { direction: direction } })
			element.dispatchEvent(event);
		});

	window.addEventListener("resize", scroller.resize);