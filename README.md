# Personal build

Personal build process using browserify for scripts and myth for css

### Install

```
  $ npm install mnmly/boilerplate-build
```

### Usage

```
var build = require('boilerplate-build');
var package = require('./package.json');

var options = {
  out: 'build/build',    // => output dir + name
  name: 'main'           // => exposed require module name (default: `boot`)
  main: package.browser, // => entry file for scripts
  style: package.style,  // => entry file for styles
  debug: true,           // => debug to be true
  paths: ["lib"]         // => other misc browserify options,
  baseDir: process.cwd()
};

build.script(options, function(e){
  if (e) // do something with error
  // otherwise it's built using `browserify`
});

build.style(options, function(e){
  if (e) // do something with error
  // otherwise it's built using `myth`
});
```
