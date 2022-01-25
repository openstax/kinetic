import { React, cx } from '../common'
import { CSSObject } from '@emotion/serialize'
import { Box } from 'boxible'

const BOTTOM:CSSObject = {
    borderTop: '1px solid #ced4da',
    padding: '1rem',
    backgroundColor: 'rgb(255 255 255 / 90%)',
}

const WITH_LINE:CSSObject = {
    borderTop: '1px solid #ced4da',
    marginTop: '1rem',
    paddingTop: '1rem',

}

export const Footer: React.FC<{ className?: string, isBottom?: boolean }> = ({ className, isBottom, children }) => {
    return (
        <Box
            gap
            className={cx('footer', className)}
            justify={isBottom ? 'center' : 'end'}
            css={isBottom ? BOTTOM : WITH_LINE}
        >
            {children}
        </Box>
    )
}
