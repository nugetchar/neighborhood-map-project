/*jslint esversion: 6*/
// Main viewmodel class
define(['jquery'], function(jq) {
	'use strict';
	/**
	 * @class DomHandler Prototype
	 */
	function DomHandler(){
		var self = this;

		self.searchTerms = jq('#searchTerms');
	}

	DomHandler.prototype.focusOnInput = function() {
		self.searchTerms.focus();
	};

    return DomHandler;
});
