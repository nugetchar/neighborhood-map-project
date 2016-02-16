/* jslint esversion: 6*/
// Main viewmodel class
define(['jquery'], function(jq){
	function initInteractions() {
		'use strict';
		let active = false;
		jq(document).ready(function() {
			jq('.row-offcanvas').toggleClass('active', active);
			jq('[data-toggle=offcanvas]').click(toggleOffCanvas);
			jq('.location').click(toggleOffCanvas);
		});

		function toggleOffCanvas(event){
			active = !active;
			jq('.row-offcanvas').toggleClass('active', active);
		}
	}
	return initInteractions;
});
