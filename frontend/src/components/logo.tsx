import * as React from 'react';

// @ts-ignore
import logoURL from '../images/kinetic-logo.png'

export const Logo = (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
    <img {...props} src={logoURL} />
)
