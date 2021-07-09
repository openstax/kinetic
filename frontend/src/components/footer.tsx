import { React, cx } from '../common'
import { Box } from 'boxible'
import styled from '@emotion/styled'

const FooterWrapper = styled(Box)`
    border-top: 1px solid #ced4da;
    margin-top: 1rem;
    padding-top: 1rem;
`

export const Footer: React.FC<{ className?: string }> = ({ className, children }) => {
    return (
        <FooterWrapper className={cx('footer', className)} justify="end" gap>
            {children}
        </FooterWrapper>
    )
}
