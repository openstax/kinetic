import { useMediaMatch } from 'rooks'
import { screenSizes } from '@theme'

// TODO: maybe we should check for more attributes other than screensize
export const useIsMobileDevice = () => {
    return useMediaMatch(`only screen and (max-width: ${screenSizes.md - 1}px)`)
}

export const useIsTabletDevice = () => {
    return useMediaMatch(`only screen and (min-width: ${screenSizes.md}px) and (max-width: ${screenSizes.xl - 1}px)`)
}