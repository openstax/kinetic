import { Box, React } from '../common'
import { colors } from '../theme'

export const OXColoredStripe = () => (
    <Box height="10" className="ox-colored-stripe">
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
            backgroundColor: colors.teal,
            flex: 1.5,
        }}></span>
    </Box>
)
