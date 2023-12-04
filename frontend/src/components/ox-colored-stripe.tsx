import { React } from '../common'
import { colors } from '@theme'
import { Flex } from '@mantine/core';

export const OXColoredStripe = () => (
    <Flex h="10px" className="ox-colored-stripe">
        <span css={{
            backgroundColor: colors.osOrange,
            flex: 3.5,
        }}></span>
        <span css={{
            backgroundColor: colors.osBlue,
            flex: 1.5,
        }}></span>
        <span css={{
            backgroundColor: colors.osRed,
            flex: 1,
        }}></span>
        <span css={{
            backgroundColor: colors.osYellow,
            flex: 2.5,
        }}></span>
        <span css={{
            backgroundColor: colors.osTeal,
            flex: 1.5,
        }}></span>
    </Flex>
)
