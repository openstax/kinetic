import { React, cx } from '../common'
import { CSSObject } from '@emotion/serialize'
import { Box } from 'boxible'

const FIXED:CSSObject = {
    borderTop: '1px solid #ced4da',
    padding: '1rem',
    position: 'fixed',
    bottom: '0',
    left: '0',
    right: '0',
}

const WITH_LINE:CSSObject = {
    borderTop: '1px solid #ced4da',
    marginTop: '1rem',
    paddingTop: '1rem',
}

export const Footer: React.FC<{ className?: string, isBottomFixed?: boolean }> = ({ className, isBottomFixed, children }) => {
    return (
        <Box
            className={cx('footer', className)} justify="center" gap
            css={isBottomFixed ? FIXED : WITH_LINE}
        >
            {children}
        </Box>
    )
}
