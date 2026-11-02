// Keep legacy media and baking intermediates in source; ship only active assets.
import { readdirSync, rmSync, copyFileSync, mkdirSync } from 'node:fs';
for (const name of readdirSync('dist/media')) {
  if (!['favicon.svg'].includes(name)) rmSync(`dist/media/${name}`, { recursive: true });
}
for (const name of readdirSync('dist/models')) {
  if (/-color\.png$|-normal\.png$/.test(name)) rmSync(`dist/models/${name}`);
}

mkdirSync('dist/licenses', {recursive:true});
for (const name of ['Inter-OFL.txt','Pretendard-OFL.txt','THIRD_PARTY.md']) copyFileSync(`docs/${name}`,`dist/licenses/${name}`);
