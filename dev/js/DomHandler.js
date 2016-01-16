
var jq = $.noConflict();
// Main viewmodel class
define([], function() {
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
