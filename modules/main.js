/// <reference path="../scripts/require.js" />

requirejs.config({
    baseUrl: 'modules', // Change this setting to point to your own module folder to test your own code.
    paths: {
        jquery: '../lib/jquery-2.0.3',
        underscore: '../lib/underscore',
        'knockout': '../lib/knockout-2.3.0'
    },
    shim: {
        'underscore': {
            exports: '_'
        },
        'jquery': {
            exports: '$'
        },
        'jasmine-html': {
            deps: ['jasmine']
        },
        'd3': {
            exports: 'd3'
        }
    }
   // ,urlArgs: '_ts=' + (new Date()).getTime()
});

var done = false;
requirejs(['knockout', './board'], function (ko, Board) {
    if (!done) {
        var gameBoard = new Board({ height: 100, width: 100, ratio: 0.2 });
        ko.applyBindings(gameBoard);
        done = true;
    }
});