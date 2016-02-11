require.config({
    baseUrl: 'js',
    paths: {
    	app: 'app',
        jquery: '../libs/jquery/jquery.min'
    }
});

requirejs(['jquery', 'app'], function(jq, app){

});