/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-underscore-dangle */
// Get all of the demo directories and build the links.
import path from 'path';
import { readdir } from 'fs/promises';
import { writeFileSync, existsSync, mkdirSync } from 'fs';
import { fileURLToPath } from 'url';
import { getFile } from './utils.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const basePath = path.join(__dirname, '../src/demos');

// Grabs all the directories in /demos
async function generateListOfDemos(demoPath) {
    return readdir(demoPath, (err, files) => {
        if (err) {
            console.log(err);
        }

        return files;
    });
}

(async () => {
    const demos = await generateListOfDemos(basePath);
    const destiniationDirectory = path.join(__dirname, '../dist/demos');

    // Create the dist directory
    if (!existsSync(destiniationDirectory)) {
        mkdirSync(destiniationDirectory, { recursive: true });
    }

    const fileList = [];
    const codepenIndex = await getFile('./scripts/templates/codepen.html');
    const dwitterIndex = await getFile('./scripts/templates/dwitter.html');

    for (const demo of demos) {
        const tagData = await getFile(`${basePath}/${demo}/tags.json`);
        let tagJSON = {};

        try {
            tagJSON = JSON.parse(tagData);
        } catch (e) {
            console.error(e);
        }

        let generatedIndex = null;
        const demoDirectory = path.join(__dirname, `../dist/demos/${demo}`);

        switch (tagJSON?.type) {
        case 'dwitter': {
            const dwitterCode = await getFile(`${basePath}/${demo}/dwitter.txt`);
            generatedIndex = dwitterIndex.replaceAll('{{dwitter_code}}', dwitterCode);

            if (!existsSync(demoDirectory)) {
                mkdirSync(demoDirectory, { recursive: true });
            }

            writeFileSync(`${demoDirectory}/index.html`, generatedIndex);
            break;
        }
        case 'codepen': {
            const codepenHtml = await getFile(`${basePath}/${demo}/markup.html`);
            generatedIndex = codepenIndex.replaceAll('{{html}}', codepenHtml);

            // Quite a few of my pens use datgui just include it if we need it.
            // Idea of this repo is to keep all my work working so self hosting it
            generatedIndex = generatedIndex.replaceAll('{{datgui}}', '<script src=\'../../js/datgui.min.js\'></script>');

            if (!existsSync(demoDirectory)) {
                mkdirSync(demoDirectory, { recursive: true });
            }

            writeFileSync(`${demoDirectory}/index.html`, generatedIndex);
            break;
        }
        default:
            break;
        }

        // Get tyhe demo display file.
        let demoFile = 'demo.mp4';

        if (existsSync(`${basePath}/${demo}/demo.png`)) {
            demoFile = 'demo.png';
        } else if (existsSync(`${basePath}/${demo}/demo.gif`)) {
            demoFile = 'demo.gif';
        }

        fileList.push({
            name: demo,
            tags: tagJSON?.tags || [],
            description: tagJSON?.description || '',
            demoFile
        });
    }

    writeFileSync(path.join(__dirname, '../dist/list.json'), JSON.stringify(fileList, null, 2));
})();
