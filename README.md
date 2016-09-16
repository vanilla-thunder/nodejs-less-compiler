# nodejs-less-compiler
nodejs based less compiler for oxid templates

### additional information in german can be found here:  
### https://marat.ws/nodejs-less-compiler-fuer-oxid-themes/

## for flow child themes:
import flow.less file:
````@import "flow";````  
and add this row to fix path variable for fontawesome font files:  
````@fa-font-path: "../../../flow/src/fonts";````

# how to use:
* copy less.js and package.json into your **out/** directory
* edit less.js and set configuration parameters in rows 9-14:  
  **$theme**: name of your child theme or "flow"  
  **$vendor**: relative path to flow less files  
  **$watch**: directory with your less files. this directory will be watched for changes  
  **$source**: your main less file, that includes other files.  
  **$target**: output file for compiled css  
  **$sourcemap**: include sourcemap? true/false  
  **$minify**: minify output style? true/false  
* `$ npm install`
* `$ npm start`

