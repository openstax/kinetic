import { Box, React } from '../common'
import { colors } from '@theme'

export const OXColoredStripe = () => (
    <Box height="10" className="ox-colored-stripe">
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
    </Box>
)
