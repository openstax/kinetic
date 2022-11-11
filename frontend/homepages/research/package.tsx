import fs from 'fs'
import { load as loadHTML } from 'cheerio'

import { React } from '@common'
import { ResearchHomepage } from './research-homepage'

import { CacheProvider } from '@emotion/react'
import { renderToString } from 'react-dom/server'
import createEmotionServer from '@emotion/server/create-instance'
import createCache from '@emotion/cache'

const key = 'css'
const cache = createCache({ key })
const { extractCritical } = createEmotionServer(cache)


const DIR = './homepages/research'
export default function ssrRender() {


    let element = (
        <CacheProvider value={cache}>
            <ResearchHomepage />
        </CacheProvider>
    )
    let { html, css, ids } = extractCritical(renderToString(element))


    const data = fs.readFileSync(`${DIR}/index.html`, 'utf8')

    const $ = loadHTML(data)

    $('body').prepend(`<style data-emotion="${key} ${ids.join(' ')}" data-s>${css}</style>`)

    $('#research-homepage').html(html)

    fs.writeFileSync(`${DIR}/hydration-test.html`, $.html())
}
