
let jq=$.noConflict();define([],function(){function DomHandler(){let self=this;self.searchTerms=jq('#searchTerms');}
DomHandler.prototype.focusOnInput=function(){self.searchTerms.focus();};return DomHandler;});