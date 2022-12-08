import { React } from '@common'
import { ResearchHomepage } from './research-homepage'

import { CacheProvider } from '@emotion/react'
import { renderToString } from 'react-dom/server'
import createEmotionServer from '@emotion/server/create-instance'
import createCache from '@emotion/cache'

const key = 'css'
const cache = createCache({ key })
const { extractCritical } = createEmotionServer(cache)


export const render = () => {
    const element = (
        <CacheProvider value={cache}>
            <ResearchHomepage />
        </CacheProvider>
    )

    let { html, css, ids } = extractCritical(renderToString(element))

    return `<style data-emotion="${key} ${ids.join(' ')}" data-s>${css}</style>\n<div id="research-homepage" class="research-cms-root-page">${html}</div>`

}
