import { React } from '@common'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { ResearchHomepage } from './research-homepage'
import { whenDomReady } from '@lib'
import createCache from '@emotion/cache'
import { CacheProvider, EmotionCache } from '@emotion/react'

const Root: React.FC<{ cache: EmotionCache }> = ({ cache }) => (
    <CacheProvider value={cache}>
        <ResearchHomepage />
    </CacheProvider>
)

whenDomReady().then(() => {
    const rootEl = document.getElementById('research-homepage')
    if (!rootEl) {
        throw 'root element was not found'
    }

    const cache = createCache({
        key: 'css',
        container: rootEl,
    })

    if (rootEl.childElementCount == 0) {
        createRoot(rootEl).render(<Root cache={cache} />)
    } else {
        hydrateRoot(rootEl, <Root cache={cache} />)
    }
})
