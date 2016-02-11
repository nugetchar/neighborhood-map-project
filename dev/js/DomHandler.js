
// Main viewmodel class
define(['jquery'], function(jq) {
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
