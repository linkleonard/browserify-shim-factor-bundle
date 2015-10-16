'use strict';

var browserify = require('browserify');
var gulp = require('gulp');
var file = require('gulp-file');
var source = require('vinyl-source-stream');
var path = require('path');
var concat = require('concat-stream');
var resolve = require('resolve');
var _ = require('lodash');

gulp.task('build', ['build-vendor', 'build-app']);

/**
 * Build vendor files.
 *
 * Based off: https://github.com/sogko/gulp-recipes/blob/master/browserify-separating-app-and-vendor-bundles/gulpfile.js
 */
gulp.task('build-vendor', function() {
    var modules = getNPMModules();
    var browserModules = getNPMBrowserModules();

    var b = browserify({debug: true});

    _.forIn(getModuleDefinitions(), function(module, moduleID) {
        b.require(resolve.sync(module), {expose: moduleID});
    });

    return b.bundle()
        .pipe(source('vendor.js'))
        .pipe(gulp.dest('build/'));
});

gulp.task('build-app', function() {
    var files = ['js/app/page1.js', 'js/app/page2.js'];
    var b = browserify({entries: files, debug: true})

    // Define the page-specific files
    b.plugin('factor-bundle', {outputs: files.map(function(entry) {
        return concat(function(content) {
            return file(path.basename(entry), content, {src: true})
                .pipe(gulp.dest('build/'));
        })
    })});
    b.external(getNPMModules());

    // Generate the bundle for the shared code
    var task = b.bundle()
        .pipe(source('common.js'))
        .pipe(gulp.dest('build/'));

    return task;
});

function getNPMBrowserModules() {
    var packageDefinition = require('./package.json');
    return packageDefinition.browser;
}


function getNPMModules() {
    var packageDefinition = require('./package.json');
    return _.keys(packageDefinition.dependencies) || []
}

function getModuleDefinitions() {
    var definitions = {};
    var modules = getNPMModules();
    var browserModules = getNPMBrowserModules();

    _.forIn(browserModules, function(mappedModuleName, moduleID) {
        definitions[moduleID] = mappedModuleName;
    });

    var browserModuleNames = _.keys(browserModules);
    modules.forEach(function(module) {
        if (!_.has(definitions, module)) {
            definitions[module] = module;
        }
    });
    return definitions;
}
