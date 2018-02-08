var fs = require('fs'),
    less = require('less'),
    path = require('path'),
//ProgressBar = require('progress'),
    watch = require('node-watch');


// ********** Compiler config
var $theme  = 'pow3r', // your theme directory/name. e.g. flow if you want to edit flow theme or the name of your child theme
    $vendor = path.join(__dirname, '../application/views/flow/build/less/'), // relative path to flow less files
    $watch  = path.join(__dirname, $theme, 'src/less/'), // watch this directory for file changes
    $source = path.join(__dirname, $theme, 'src/less/styles.less'), // less source file relative to this file
    $target = path.join(__dirname, $theme, 'src/css/styles.min.css'), //  target file for compilation relative to this file
    $sourcemap = true, // include source map or not? true / false
    $minify = false; // minify output? true / false

// ********************************************************

less.logger.addListener({
    debug: function(msg) { console.log("  ### debug : " +msg); },
    info: function(msg)  { console.log("  ### info : " +msg); },
    warn: function(msg)  { console.log("  ### warning : " +msg); },
    error: function(msg) { console.log("  ### error : " +msg); }
});

var compile = function () {
    //var bar = new ProgressBar(' progress: [:bar] :percent :etas :token ', { width:50, total: 10 });
    //bar.tick(1,{'token': "reading source ..."});
    console.log('  > reading source files ... ');
    fs.readFile($source, function (err, data) {
        if (err) {
            console.log('  > could not read '+$source);
            return;
        }
        console.log('  > compiling less ... ');
        //console.log(data.toString());
        //bar.tick(2,{'token': "compiling less ..."});
        less.render(
            data.toString(),
            {
                paths: [__dirname, $vendor],
                filename: $source,
                compress: $minify,
                sourceMap: {sourceMapFileInline: $sourcemap}
            })
            .then(
                function(output) {
                    //bar.tick(3,{'token': "writing css ..."});
                    console.log('  > writing css ... ');
                    fs.writeFileSync($target, output.css);
                    //bar.tick(4,{'token': $target + ' updated'});
                    console.log('  > ' + path.relative(__dirname,$target) + ' updated');
                },
                function(error) {
                    //bar.tick(7,{'token': "aborted"});
                    console.log(' ---------- ERROR # \n' + e + '\n ---------- ERROR #');
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
    else if (cmd == "min") {
        $minify = !$minify;
        console.log('  > minify set to: ' + $minify);
        compile();
    }
    else if (cmd == "map") {
        $sourcemap = !$sourcemap;
        console.log('  > sourcemap set to: ' + $sourcemap);
        compile();
    }
    else {
        console.log('');
        console.log(' | type "l" or "less" to compile less files');
        console.log(' | type "map" to toggle sorucemap on and off ');
        console.log(' | type "min" to toggle minifying css on and off ');
        //console.log('');
        //console.log('  vendor directory: ' + $vendor);
        //console.log('  less directory:   ' + $watch);
        //console.log('');
        //console.log('  source: ' + $source);
        //console.log('  target: ' + $target);
        //console.log('');
        //console.log('');
    }
});

console.log('');
console.log('  ____________________________  party hard! ctrl+c to stop');
console.log(' |');
console.log(' | type "l" or "less" to compile less files');
console.log(' | type "m" or "minify" to toggle minifying css on and off ');
console.log(' |');
console.log(' | vendor directory: ' + path.relative(__dirname,$vendor) );
console.log(' |   less directory: ' + path.relative(__dirname,$watch) );
console.log(' |        sourcemap: ' + $sourcemap);
console.log(' |           minify: ' + $minify);
console.log(' |');
console.log(' | source: ' + path.relative(__dirname,$source));
console.log(' | target: ' + path.relative(__dirname,$target));
console.log(' |________________________________________________________');
console.log('');

// file and directory watchers
watch($watch, function (evt, filename) {
    if (path.extname(filename) == '.less') {
        fs.stat(filename, function (err, stat) {
            if (err !== null) return;
            console.log('');
            console.log('  [ ' + new Date().toLocaleTimeString() + ' ] ' + path.relative(__dirname,filename) + ' changed');
            compile();
        });
    }
});
