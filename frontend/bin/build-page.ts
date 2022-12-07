import fs from 'fs'
import { load as loadHTML } from 'cheerio'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { spawn, execSync } from 'node:child_process'
import { lookup } from 'mime-types'

export default async function buildPage({ args }: any) {
    const pageName = args[1]

    const path = `./homepages/${pageName}`
    const env = {
        ...process.env,
        BUILD_PAGE: pageName,
    }
    // first build the page
    execSync(`bin/env vite build`, { env })

    // now build a SSR version of the page
    execSync(`bin/env vite build --outDir tmp/ssr --ssr ${path}/ssr.tsx`, { env })

    let html = ''
    // extract the script and styles for it
    const packaged = loadHTML(fs.readFileSync(`dist/${path}/index.html`, 'utf8'));
    packaged('head > script,head > link').map(function () {
        html += loadHTML(this).html() + '\n'
    })

    // @ts-ignore
    // it will lack typescript types
    const { render } = await import('../tmp/ssr/ssr.mjs')
    html += render()

    // write a test file
    const $ = loadHTML(fs.readFileSync('homepages/hydration-test.html', 'utf8'))
    $('body').html(html)
    fs.writeFileSync(`tmp/page-hydration-test.html`, $.html())


    const s3 = new S3Client({ region: 'us-east-1' });
    const assets = await fs.promises.readdir('dist/assets')
    for (const asset of assets) {
        const stream = fs.createReadStream(`dist/assets/${asset}`)
        console.log(`upload ${asset}`)
        // will throw exception if upload fails
        await s3.send(new PutObjectCommand({
            Bucket: 'kinetic-app-assets',
            ACL: 'public-read',
            Key: `assets/${asset}`,
            Body: stream,
            ContentType: lookup(asset) || 'application/octet-stream',
        }));
    }

    const pbcopy = spawn('pbcopy')
    pbcopy.stdin.write(html)
    pbcopy.stdin.end()

    console.log('\ntmp/page-hydration-test.html was created, and output copied to clipboard')
}
