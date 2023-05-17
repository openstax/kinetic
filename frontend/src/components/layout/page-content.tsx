import { cx, React, styled } from '@common';
import { colors } from '@theme';
import { TopNavBar } from '../top-navbar';
import { Footer } from '../footer';
import { Global } from '@emotion/react';

export const PageContent: FCWC<{className?: string}> = ({ className, children }) => {
    return (
        <div className={cx('container-lg', 'py-4', className)}>
            {children}
        </div>
    )
}

const PageWrapper = styled.div<{backgroundColor: string}>`
    background-color: ${(props) => props.backgroundColor}
`

export const Page: FCWC<{
    className?: string,
    backgroundColor?: string,
    hideBanner?: boolean,
    hideFooter?: boolean
}> = ({
    backgroundColor = colors.pageBackground,
    hideBanner = false,
    hideFooter = false,
    className,
    children,
}) => {
    return (
        <PageWrapper backgroundColor={backgroundColor} className={cx(className)}>
            <Global styles={{
                body: { background: `${backgroundColor} !important` },
            }} />
            <TopNavBar hideBanner={hideBanner}/>
            <PageContent>
                {children}
            </PageContent>
            {!hideFooter && <Footer />}
        </PageWrapper>
    )
}
