import { cx, React, styled } from '@common';
import { colors } from '@theme';
import { TopNavBar } from '@components';
import { Footer } from '../footer';
import { Global } from '@emotion/react';
import { Container } from '@mantine/core';

const PageWrapper = styled.div<{backgroundColor: string}>`
    background-color: ${(props) => props.backgroundColor}
`

export const Page: FCWC<{
    className?: string,
    backgroundColor?: string,
    hideFooter?: boolean
}> = ({
    backgroundColor = colors.ash,
    hideFooter = false,
    className,
    children,
}) => {
    return (
        <PageWrapper backgroundColor={backgroundColor} className={cx(className)}>
            <Global styles={{
                body: { background: `${backgroundColor} !important` },
            }} />
            <TopNavBar />
            <Container py='2rem' mb='auto' style={{
                minHeight: `calc(100vh - 81px - ${(hideFooter ? 0 : 120)}px)`,
            }}>
                {children}
            </Container>
            {!hideFooter && <Footer />}
        </PageWrapper>
    )
}
