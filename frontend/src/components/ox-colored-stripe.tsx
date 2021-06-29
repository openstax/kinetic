import { React } from '../common'
import { colors } from '../theme'

export const OXColoredStripe = () => (
    <div
        className="ox-colored-stripe"
        css={{ height: '10px', display: 'flex' }}
    >
        <div css={{ flex: 1,  backgroundColor: colors.orange  }} />
        <div css={{ flex: 1,  backgroundColor: colors.darkBlue  }} />
        <div css={{ flex: 1,  backgroundColor: colors.red  }} />
        <div css={{ flex: 1,  backgroundColor: colors.teal  }} />
    </div>
)
