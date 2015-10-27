'use strict';
var PluginError = require('gulp-util').PluginError;
var through = require('through2');
var loadReporter = require('./loadReporter');
var failReporter = require('./fail');

module.exports = function (reporter) {
	if (reporter === 'fail' || reporter === 'failImmediately') {
		return failReporter(reporter === 'failImmediately');
	}

	var rpt = loadReporter(reporter);

	if (typeof rpt !== 'function') {
		throw new PluginError('gulp-jscs', 'Invalid reporter');
	}

    var files = [];
	// return stream that reports stuff
	return through.obj(function (file, enc, cb) {
		if (file.jscs && !file.jscs.success) {
            files.push(file.jscs.errors);
		}

		cb(null, file);
	}, function() {
        rpt(files);
    });
};
