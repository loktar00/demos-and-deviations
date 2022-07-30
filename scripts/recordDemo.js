import path from 'path';
import child_process from 'child_process';

import { fileURLToPath } from 'url';
import { writeFileSync, existsSync, mkdirSync, rmdirSync } from "fs";
import puppeteer from 'puppeteer';
import connect from 'connect';
import serveStatic from 'serve-static';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const demoPath = path.join(__dirname,'../dist/demos/2d raycast light');

connect().use(serveStatic(demoPath)).listen(8080, () => console.log('Server running on 8080...'));

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.exposeFunction('saveImages', (demoName, imageList) => {
    const destiniationDirectory = path.join(__dirname, `../dist/demos/${demoName}`);

    // Create the dist directory
    if (!existsSync(`${destiniationDirectory}/frames`)) {
        mkdirSync(`${destiniationDirectory}/frames`, { recursive: true });
    }

    const framesData = Object.entries(imageList);

    for (const [frameName, frameData] of framesData) {
        const base64Data = frameData.replace(/^data:image\/png;base64,/, '');
        writeFileSync(`${destiniationDirectory}/frames/${frameName}.png`, base64Data, 'base64');
    }

    // Create gif
    child_process.execSync(`${__dirname}/../bin/ffmpeg -f image2 -framerate 50 -i "${destiniationDirectory}/frames/%03d.png" -pix_fmt yuv420p "${destiniationDirectory}/vid.mp4"`);
    // options -vf scale=256:256 -c:v libx264 -pix_fmt yuv420p -vb 10M

    // Remove the frames
    // remove the frames directory
    rmdirSync(`${destiniationDirectory}/frames`, { recursive: true });

    process.exit(0);
  });

  await page.goto('http://localhost:8080');
  await page.evaluate(async () => {
    const canvas = document.querySelector('canvas');
    window.requestAnimationFrame = () => {};

    function recordCanvas(canvas) {
        const options = {
            fps: 50,
            duration: 5000,
            canvas: canvas,
        };

        const framesData = {};

        const frameDuration = 1000 / options.fps;
        const frames = Math.round(options.duration / frameDuration);
        const framesNameLength = Math.ceil(Math.log10(frames));

        for (let i = 0; i < frames; i++) {
            const timestamp = i * frameDuration;
            // This is the function to render to canvas
            draw(timestamp);
            const frameName = i.toString().padStart(framesNameLength, '0');
            framesData[frameName] = options.canvas.toDataURL('image/png');
        }

        window.saveImages('2d raycast light', framesData);
    }

    recordCanvas(canvas);
  });

   await browser.close();
})();

