
let jq = $.noConflict();
// Main viewmodel class
define([], function() {
	/**
	 * @class DomHandler Prototype
	 */
	function DomHandler(){
		let self = this;

		self.searchTerms = jq('#searchTerms');
	}

	DomHandler.prototype.focusOnInput = function() {
		self.searchTerms.focus();
	};

    return DomHandler;
});
