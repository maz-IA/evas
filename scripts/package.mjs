import {mkdir,cp} from 'node:fs/promises';
await mkdir('dist/evas',{recursive:true});
for(const item of ['manifest.json','index.html','src','assets']) await cp(item,`dist/evas/${item}`,{recursive:true});
console.log('Extensão pronta em dist/evas. Carregue essa pasta como extensão descompactada.');
