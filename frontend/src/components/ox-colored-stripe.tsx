import { React } from '../common'
import { colors } from '../theme'
import { Box } from '@common';

export const OXColoredStripe = () => (
    <Box css={{ height: 10 }}>
        <span css={{
            backgroundColor: colors.orange,
            flex: 3.5,
        }}></span>
        <span css={{
            backgroundColor: colors.primaryBlue,
            flex: 1.5,
        }}></span>
        <span css={{
            backgroundColor: colors.red,
            flex: 1,
        }}></span>
        <span css={{
            backgroundColor: colors.yellow,
            flex: 2.5,
        }}></span>
        <span css={{
            backgroundColor: colors.lightBlue,
            flex: 1.5,
        }}></span>
    </Box>
)
