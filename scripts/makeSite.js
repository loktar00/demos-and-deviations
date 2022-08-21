/* eslint-disable no-underscore-dangle */
/* eslint-disable import/extensions */
import path from 'path';
import { readFile } from 'fs/promises';
import fs from 'fs-extra';
import { writeFileSync } from 'fs';
import { fileURLToPath } from 'url';

import list from '../dist/list.json' assert { type: 'json'};

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load the index.html file
async function readIndex() {
    return readFile(path.join(__dirname, './index.html'), 'utf8')
        .then(data => data).catch(err => { console.error(err); });
}

(async () => {
    const fileData = await readIndex();

    const links = list.map(file => `<li><a href="demos/${file.name}">${file.name}</a></li>\n`);

    const html = fileData.replace('{{main}}', `<ol>${links.join('')}</ol>`);

    writeFileSync(path.join(__dirname, '../dist/index.html'), html);

    try {
        fs.copySync(path.join(__dirname, '../public/'), path.join(__dirname,'../dist/'));
        console.log('public files copy succes!');
    } catch (err) {
        console.error(err);
    }

    try {
        fs.copySync(path.join(__dirname, '../demos'), path.join(__dirname,'../dist/demos'));
        console.log('demo copy succes!');
    } catch (err) {
        console.error(err);
    }
})();
