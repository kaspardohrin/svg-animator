## configuration
 ```bash
  # make sure you have npm and node installed
  $ yarn install
  $ yarn build
  $ yarn start
 ```

## requirements
 a svg icon with:
 * an id for every line
 * paths that are created with strokes

 by default the path to use for animating is `icon.svg` in the root of this folder

## usage
 you can change basic css styling in generate.ts,
 the function returns a css snippet per id matched in the svg,
 this snippet however you can change as you see fit
