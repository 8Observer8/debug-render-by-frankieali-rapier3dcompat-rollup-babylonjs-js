This is an example created by **frankieali** with my adaptation for importmap and Rollup. See the original example: https://playground.babylonjs.com/#JL3MT8#5, [issue](https://github.com/dimforge/rapier.js/pull/119#issuecomment-1627506376), and [topic](https://forum.babylonjs.com/t/improve-this-debug-rendering-for-the-rapier3d-compat-physics-engine-and-babylon-js-if-necessary/42283).

Sandboxes:
- PlayCode: https://playcode.io/1528902
- Plunker: https://plnkr.co/edit/dBHPCgYHa9fxnfO4?preview

Install globally:

> npm i -g http-server rollup uglify-js

Run http-server. Add `-c-1` as an option to disable caching:

> http-server -c-1

Debug mode:

> npm run dev

Release build. Stop debugging (Ctrl+C in CMD). Type:

> npm run release
