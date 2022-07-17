// Get all of the demo directories and build the links.
import path from 'path';
import { readdir } from "fs/promises";
import { writeFileSync } from "fs";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const baseBath = path.join(__dirname, '../demos');

async function generateListOfFiles(basePath) {
    return readdir(baseBath, (err, files) => {
        if (err) {
            console.log(err);
        }

        return files;
    });
}

(async () => {
    const files = await generateListOfFiles(baseBath);
    const fileList = files.map(file => {
        return {
            name: file,
            tags: []
        }
    });

    writeFileSync(path.join(__dirname, '../dist/list.json'), JSON.stringify(fileList, null, 2));
})();





