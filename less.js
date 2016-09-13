var fs = require('fs'),
    less = require('less'),
    path = require('path'),
    ProgressBar = require('progress'),
    rd = require('readdirp'),
    watch = require('node-watch');


// ********** Compiler config
var $vendor = path.join(__dirname, '../../application/views/flow/build/less/'), // relative path to flow's less files
    $watch  = path.join(__dirname, 'src/less/'), // watch this directory for file changes
    $source = path.join(__dirname, 'src/less/style.less'), // less source file relative to this file
    $target = path.join(__dirname, 'src/css/style.css'), //  target file for compilation relative to this file
    $minify = false; // minify output? true / false
// ********************************************************



var compile = function () {
    var bar = new ProgressBar(' progress: [:bar] :percent :etas :token ', { width:50, total: 10 });
    bar.tick(1,{'token': "reading source ..."});
    //console.log('  >  compiling less ... ');
    fs.readFile($source, function (err, data) {
        if (err) {
            console.log('  >  could not read '+$source);
            return;
        }
        bar.tick(2,{'token': "compiling less ..."});
        less.render(
            data.toString(),
            {
                paths: [__dirname, $vendor],
                filename: $source,
                compress: $minify
            })
            .then(
                function(output) {
                    bar.tick(3,{'token': "writing css ..."});
                    //console.log('  >  done, writing css ... ');
                    fs.writeFileSync($target, output.css);
                    bar.tick(4,{'token': $target + ' updated'});
                    //console.log('  >  ' + $target + ' updated');
                },
                function(error) {
                    bar.tick(7,{'token': "aborted"});
                    console.log('# ERROR: ---------- \n' + e + '\n ---------------');
                });
    });
};


// Benutzereingaben abfertigen
var stdin = process.openStdin();
stdin.addListener("data", function (d) {
    // note:  d is an object, and when converted to a string it will end with a linefeed.
    // so we (rather crudely) account for that with toString() and then substring()
    var cmd = d.toString().trim();
    if (cmd == "l" || cmd == "less") compile();
    else if (cmd == "m" || cmd == "minify") {
        $minify = !$minify;
        console.log('  minify:   ' + $minify);
        compile();
    }
    else {
        console.log('');
        console.log('  type "l" or "less" to compile less files');
        console.log('  type "m" or "minify" to toggle minifying css on and off ');
        //console.log('');
        //console.log('  vendor directory: ' + $vendor);
        //console.log('  less directory:   ' + $watch);
        //console.log('');
        //console.log('  source: ' + $source);
        //console.log('  target: ' + $target);
        console.log('');
        console.log('');
    }
});

console.log('');
console.log(' --- party hard! press ctrl+c to go home ---');
console.log('');
console.log('  type "l" or "less" to compile less files');
console.log('  type "m" or "minify" to toggle minifying css on and off ');
console.log('');
console.log('  vendor directory: ' + $vendor);
console.log('  less directory:   ' + $watch);
console.log('');
console.log('  source: ' + $source);
console.log('  target: ' + $target);
console.log('  minify: ' + $minify);
console.log('');

// file and directory watchers
watch($watch, function (filename) {
    var ext = filename.split('.')[1];
    if (ext == 'less') {
        fs.stat("./" + filename, function (err, stat) {
            if (err !== null) return;
            console.log('     ' + filename + ' was changed');
            compile();
        });
    }
});
