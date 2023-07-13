This is an example created by **frankieali** with my adaptation for importmap and Rollup. See the original example: https://playground.babylonjs.com/#JL3MT8#5, [issue](https://github.com/dimforge/rapier.js/pull/119#issuecomment-1627506376), and [topic](https://forum.babylonjs.com/t/improve-this-debug-rendering-for-the-rapier3d-compat-physics-engine-and-babylon-js-if-necessary/42283).

Sandboxes:
- PlayCode: https://playcode.io/1528902
- Plunker: https://plnkr.co/edit/dBHPCgYHa9fxnfO4?preview

Install these packages globally with the command:

> npm i -g http-server rollup uglify-js

Run http-server in the project directory:

> http-server -c-1

Note. The `-c-1` key allows you to disable caching.

Start development mode with the following command:

> npm run dev

Note. Rollup will automatically keep track of saving changes to files and build a new index.js file ready for debugging. You can debug your project step by step in the browser by setting breakpoints.

Create a compressed file ready for publishing. Stop development mode, for example, with this command Ctrl + C in CMD, if it was launched before and enter the command:

> npm run release

Note. After this command, Rollup will create a compressed index.js file. Compression is done using the uglify-js package.
