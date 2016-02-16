
define(['jquery'],function(jq){'use strict';function DomHandler(){var self=this;self.searchTerms=jq('#searchTerms');}
DomHandler.prototype.focusOnInput=function(){self.searchTerms.focus();};return DomHandler;});