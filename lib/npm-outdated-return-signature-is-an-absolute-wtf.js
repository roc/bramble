'use strict';

var Spinner = require('cli-spinner').Spinner;
var Q = require('q');
var npm = require('npm');

// function exec(cmd, cb) {
//     childProcess.exec(cmd, { encoding: 'utf8', cwd: process.cwd() }, cb);
// }

var spinner = new Spinner('Checking for outdated packages %s');
spinner.setSpinnerString('∸∹∺∻⨪⨫⨬');

var getOutdated = function getOutdatedPackages () {
    var def = Q.defer();
    spinner.start();

    npm.load('./package', function () {
        npm.config.set('json', true);
        npm.config.set('long', true);
        npm.commands.outdated(function (err, packages) {
            if (err) {
                def.reject(new Error(err));
            } else {
                def.resolve(packages);
            }
        });
    });

    // exec('npm outdated --json --long --depth=0', function (err, stdout, stderr) {
    //     var outdated = stdout ? JSON.parse(stdout) : false;
    //     if (stderr) {
    //         def.reject(new Error(stderr));
    //     } else {
    //         def.resolve(outdated);
    //     }
    // });

    return def.promise;
};

getOutdated().done(function (items) {

    spinner.stop(true);

    console.log('\nThis is the way it comes back from npm:\n');
    console.log(items);
    // WHY THE F would you remove these?
    // https://github.com/npm/npm/blob/master/lib/outdated.js#L92-L97
    var headings =[
        'location',
        'package',
        'current',
        'wanted',
        'latest',
        'I have no idea why current is repeated here',
        'type'
    ];

    var packs = [];
    items.forEach(function (pack) {
        var ob = {};
        pack.map(function(item, i) {
            return ob[headings[i]] = item;
        });
        packs.push(ob);
    });

    console.log('\n after some mapping (wtf):\n');
    console.log(JSON.stringify(packs, null, 4));

});

module.exports = getOutdated;