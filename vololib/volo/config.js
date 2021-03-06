/**
 * @license Copyright (c) 2011, The Dojo Foundation All Rights Reserved.
 * Available via the MIT or new BSD license.
 * see: http://github.com/volojs/volo for details
 */

/*global define, process, voloPath, console */

define(function (require) {
    'use strict';
    var fs = require('fs'),
        path = require('path'),
        lang = require('./lang'),
        file = require('./file'),
        homeDir = require('./homeDir'),
        overrideConfigUrl = path.join(homeDir, '.voloconfig'),
        localConfigUrl = path.join(homeDir, '.voloconfiglocal'),

        data, overrideConfig, localConfig, contents;

    // The defaults to use.
    data = lang.delegate({
        "volo": {
            //Hold on to the name of the script
            "path": typeof voloPath === 'undefined' ? process.argv[1] : voloPath
        },

        "npmRegistry": "https://registry.npmjs.org/",

        "github": {
            "scheme": "https",
            "host": "github.com",
            "apiHost": "api.github.com",
            "searchHost": "api.github.com",
            "rawUrlPattern": "https://raw.github.com/{owner}/{repo}/{version}/{file}",
            "searchPath": "/legacy/repos/search/{query}?language=JavaScript",
            "searchOverrides": {
                "amd": {
                    "underscore": "amdjs/underscore",
                    "backbone": "amdjs/backbone"
                }
            },
            "typeOverrides": {
                "dojo/dijit": "directory"
            },

            "auth": {
                "domain": "https://api.github.com",
                "authPath": "/authorizations",
                "scopes": ["repo"],
                "note": "Allow volo to interact with your repos.",
                "noteUrl": "https://github.com/volojs/volo"
            }
        },

        "command": {
            "add": {
                "discard": {
                    ".gitignore": true,
                    "test": true,
                    "tests": true,
                    "doc": true,
                    "docs": true,
                    "example": true,
                    "examples": true,
                    "demo": true,
                    "demos": true
                }
            },

            "rejuvenate":  {
                archive: 'volojs/volo#dist/volo'
            }
        }
    });

    //Allow a local config at baseUrl + '.config.js'
    if (path.existsSync(overrideConfigUrl)) {
        contents = (fs.readFileSync(overrideConfigUrl, 'utf8') || '').trim();

        if (contents) {
            overrideConfig = JSON.parse(contents);
            lang.mixin(data, overrideConfig, true);
        }
    }

    return {
        get: function () {
            return data;
        },

        //Simple local config. No fancy JSON object merging just plain mixing
        //of top level properties.
        getLocal: function () {
            var contents;

            if (!localConfig) {
                if (path.existsSync(localConfigUrl)) {

                    contents = (fs.readFileSync(localConfigUrl, 'utf8') || '').trim();

                    if (contents) {
                        localConfig = JSON.parse(contents);
                    }
                }

                if (!localConfig) {
                    localConfig = {};
                }
            }

            return localConfig;
        },

        saveLocal: function () {
            //Make sure the directory exists
            try {
                file.mkdirs(path.dirname(localConfigUrl));
                fs.writeFileSync(localConfigUrl, JSON.stringify(localConfig, null, '  '));
            } catch (e) {
                console.error('Cannot save local config, continuing without saving.');
                return '';
            }

            return localConfigUrl;
        }
    };
});
