import {cp,mkdir,writeFile,readFile} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
await mkdir('public/vendor',{recursive:true});
await cp('node_modules/@wasm-gaming/mgba-wasm/dist/mgba','public/vendor',{recursive:true});
// LLD emits the cartridge directly; no separately installed objcopy is needed.
execFileSync('clang',['--target=arm-none-eabi','-mcpu=arm7tdmi','-marm','-O2','-ffreestanding','-fno-builtin','-nostdlib','-fuse-ld=lld','-Wl,-T,link.ld','-Wl,--oformat=binary','start.s','demo.c','-o','../public/pocket-test.gba'],{cwd:'demo-src',stdio:'inherit'});
const rom=await readFile('public/pocket-test.gba');let sum=0;for(let i=0xa0;i<0xbd;i++)sum+=rom[i];rom[0xbd]=(-sum-0x19)&255;await writeFile('public/pocket-test.gba',rom);
await writeFile('public/version.json',JSON.stringify({version:'1.0.0',commit:process.env.GITHUB_SHA||'local',builtAt:new Date().toISOString()}));
await writeFile('public/THIRD_PARTY_NOTICES.txt',`POCKET 1.0.0\n\nThree.js 0.170.0 — MIT\nhttps://github.com/mrdoob/three.js/tree/r170\n\nmGBA SDK @wasm-gaming/mgba-wasm 0.1.1 — MPL-2.0\nCorresponding source and build scripts: https://github.com/wasm-gaming/mGBA-wasm\nUpstream: https://github.com/mgba-emu/mgba\nRuntime files are unmodified copies from the published npm package.\n\nOriginal Pocket Field Test homebrew, UI and procedural 3D geometry — MIT.\nTest cartridge source: https://github.com/staruhub/chaogeek-publisher/tree/pocket-gba/.pocket-gba-src/demo-src\nCommercial Nintendo ROMs and BIOS files are not included.\n`);
await cp('node_modules/three/LICENSE','public/THREE-LICENSE.txt');
