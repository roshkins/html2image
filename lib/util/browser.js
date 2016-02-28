var phantom = require('node-phantom');
var fs = require('fs');

var browser = null;

function init(callback) {
    phantom.create(function (/*err,*/ ph) {
        /*if (err) {
            throw err;
        }*/

        browser = ph;
        callback(browser);
    });
}

function get() {
    if (browser === null) {
        throw new Error('Browser instance must be init first by browser.init');
    }
    return browser;
}

function render(content, callback) {
    if (browser === null) {
        throw new Error('Browser instance must be init first by browser.init');
    }

    browser.createPage(function (err, page) {
        if (err) {
            throw err;
        }

        var temp = require('temp');
        var tempPath = temp.path({
            suffix: '.png'
        });

        page.set('content', content, function (err) {
            if (err) {
                throw err;
            }

            page.onLoadFinished = function () {
                page.render(tempPath, function (err) {
                    if (err) {
                        throw err;
                    }

                    /*jslint stupid:true*/
                    var content = fs.readFileSync(tempPath);
                    callback('png', content);
                    fs.unlink(tempPath);
                });
            };
        });
    });
}

exports.init = init;
exports.get = get;
exports.render = render;
