import path from 'path';
import child_process from 'child_process';
import { fileURLToPath } from 'url';
import { writeFileSync, existsSync, mkdirSync, rmdirSync } from "fs";
import puppeteer from 'puppeteer';
import connect from 'connect';
import serveStatic from 'serve-static';

import list from '../dist/list.json' assert { type: 'json'};

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const staticServePath = path.join(__dirname,'../dist');
const demoPath = path.join(__dirname,'../demos');
const args = process.argv;

// start up a server to serve the static files from our dist directory
connect().use(serveStatic(staticServePath)).listen(8080, () => console.log('Server running'));

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  // generates a bunch of pngs that are sticked together to make a gif/video
    await page.exposeFunction('saveImages', (demoName, imageList) => {
        const destiniationDirectory = path.join(__dirname, `../dist/demos/${demoName}`);
        const destiniationVideoDirectory = path.join(__dirname, `../demos/${demoName}`);

        // Create the destination directory to save our images
        if (!existsSync(`${destiniationDirectory}/frames`)) {
            mkdirSync(`${destiniationDirectory}/frames`, { recursive: true });
        }

        const framesData = Object.entries(imageList);

        // Save each image to the destination directory
        for (const [frameName, frameData] of framesData) {
            const base64Data = frameData.replace(/^data:image\/png;base64,/, '');
            writeFileSync(`${destiniationDirectory}/frames/${frameName}.png`, base64Data, 'base64');
        }

        // Create Video
        child_process.execSync(`${__dirname}/../bin/ffmpeg -framerate 50 -i "${destiniationDirectory}/frames/%03d.png" -pix_fmt yuv420p "${destiniationVideoDirectory}/vid.mp4"`);
        // Create Gif
        // child_process.execSync(`${__dirname}/../bin/ffmpeg -f image2 -framerate 50 -i "${destiniationDirectory}/frames/%03d.png" "${destiniationVideoDirectory}/vid.gif"`);
        // additional options for possible later use -f image2 -vf scale=iw*.75:ih*.75
        // -vf scale=256:256 -c:v libx264 -pix_fmt yuv420p -vb 10M

        // remove the frames directory and all of the generated images
        rmdirSync(`${destiniationDirectory}/frames`, { recursive: true });

        process.exit(0);
    });

    const firstDemoWithNoVideo = list.filter(demo => {
        const file = existsSync(`${demoPath}/${demo.name}/vid.mp4`) || existsSync(`${demoPath}/${demo.name}/demo.png`) || existsSync(`${demoPath}/${demo.name}/demo.gif`);
        return !file;
    })[0];

    console.log(firstDemoWithNoVideo.name);

    await page.goto(`http://localhost:8080/demos/${firstDemoWithNoVideo.name}`);
    await page.waitForTimeout(200);
    await page.evaluate(async (demoName, args) => {
        console.log('Running demo:', demoName);
        // This runs the current demo and records each frame.
        // We override the requestAnimationFrame function so we can generate each frame.
        const canvas = document.querySelector('canvas');
        const opaqueCanvas = document.createElement('canvas');
        const oCtx = opaqueCanvas.getContext('2d');
        opaqueCanvas.width = canvas.width;
        opaqueCanvas.height = canvas.height;
        oCtx.fillStyle = '#000';

        window.requestAnimationFrame = () => {};

        function recordCanvas(canvas) {
            const options = {
                fps: 50,
                duration: 3000,
                canvas: canvas,
            };

            const framesData = {};
            const frameDuration = 1000 / options.fps;
            const frames = Math.round(options.duration / frameDuration);
            const framesNameLength = Math.ceil(Math.log10(frames));

            for (let i = 0; i < frames; i++) {
                const timestamp = i * frameDuration;

                // This is the function to render to canvas.. this is different for most demos
                for (let j = 0; j < 1; j++) {
                    if (typeof draw === 'function') {
                        draw(timestamp);
                    } else if (typeof render === 'function') {
                        render(timestamp);
                    } else if (typeof update === 'function') {
                        update(timestamp);
                    }
                }

                const frameName = i.toString().padStart(framesNameLength, '0');

                if (args.includes('--opaque')) {
                    oCtx.fillRect(0, 0, opaqueCanvas.width, opaqueCanvas.height);
                    oCtx.drawImage(canvas, 0, 0);
                    framesData[frameName] = opaqueCanvas.toDataURL('image/png');
                } else {
                    framesData[frameName] = options.canvas.toDataURL('image/png');
                }

            }

            window.saveImages(demoName, framesData);
        }
        recordCanvas(canvas);

    }, firstDemoWithNoVideo.name, args);

   await browser.close();
})();

