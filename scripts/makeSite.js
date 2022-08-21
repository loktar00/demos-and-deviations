/* eslint-disable no-underscore-dangle */
/* eslint-disable import/extensions */
import path from 'path';
import fs from 'fs-extra';
import {
    writeFileSync,
    createWriteStream,
    createReadStream,
    readFileSync
} from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

(async () => {
    const fileData = readFileSync(path.join(__dirname, '../dist/index.html'));

    // Replace the first script tag with the list of demos and empty it.
    const html = fileData.toString().replace(/<script>((.|\n)*)<\/script>/, '');
    writeFileSync(path.join(__dirname, '../dist/index.html'), html);

    // Open up some streams to concat the list file we made.
    const writeStream = createWriteStream(path.join(__dirname, '../dist/index.html'), { flags: 'a' });
    const readStream = createReadStream(path.join(__dirname, '../dist/list.html'));

    writeStream.on('close', () => { console.log('done'); });

    readStream.on('data', chunk => {
        writeStream.write(chunk);
    });

    // Copy the rest of the files
    try {
        fs.copySync(path.join(__dirname, '../public/'), path.join(__dirname, '../dist/'));
        console.log('public files copy succes!');
    } catch (err) {
        console.error(err);
    }

    try {
        fs.copySync(path.join(__dirname, '../src/demos'), path.join(__dirname, '../dist/demos'));
        console.log('demo copy succes!');
    } catch (err) {
        console.error(err);
    }
})();
