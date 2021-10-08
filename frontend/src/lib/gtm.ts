import loadjs from 'loadjs'
import { ENV } from './env'

if (ENV.GTAG_ID) {
    loadjs([`https://www.googletagmanager.com/gtag/js?id=${ENV.GTAG_ID}`], () => {
        window.dataLayer = window.dataLayer || [];
        window.gtag = (...args:any[]) => window.dataLayer?.push(args)
        window.gtag('js', new Date());
        window.gtag('config', ENV.GTAG_ID);
    })
}
