import { React } from '@common'
import { createRoot, hydrateRoot } from 'react-dom/client'

import { ResearchHomepage } from './research-homepage'
import { SSRProvider } from '@restart/ui/ssr';

window.addEventListener('DOMContentLoaded', () => {
    const rootEl = document.getElementById('research-homepage')
    if (!rootEl) {
        throw 'root element was not found'
    }

    if (rootEl.childElementCount == 0) {
        createRoot(rootEl).render(<SSRProvider><ResearchHomepage /></SSRProvider>)
    } else {
        hydrateRoot(rootEl, <SSRProvider><ResearchHomepage /></SSRProvider>)
    }

});
