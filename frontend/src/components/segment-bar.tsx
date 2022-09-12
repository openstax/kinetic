import { React, cx } from '@common'
import { colors } from '../theme'
import styled from '@emotion/styled'
import { Box } from 'boxible'
import { CSSObject } from '@emotion/react'

interface SegmentProps {
    percentage: number
    className?: string
}

const segmentWidth = 80
const barWidth = 7
const circleDiameter = 20
const segmentTitlePadding = (segmentWidth * 0.5) - (circleDiameter * 0.75)

const segmentStyle: CSSObject = {
    position: 'absolute',
    width: segmentWidth,
    top: `-${barWidth}px`,
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    '&:first-of-type': {
        '.title': {
            paddingLeft: segmentTitlePadding,
        },
    },
    '&:last-of-type': {
        '.title': {
            paddingRight: segmentTitlePadding,
        },
    },
}

const SegmentWrapper = styled.div(segmentStyle)

export const Segment: FCWC<SegmentProps> = ({ children, className, percentage }) => {
    return <SegmentWrapper className={cx('segment', className)} css={{ left: `calc(${percentage}% - ${segmentWidth / 2}px)` }
    }> {children}</SegmentWrapper >
}

export const segmentCircleStyle: CSSObject = {
    height: circleDiameter,
    width: circleDiameter,
    borderRadius: circleDiameter / 2,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 0,
    margin: 0,

    '.tooltip-inner': { width: '180px' },

    '&:before': {
        padding: 0,
        margin: 0,
    },

    '&.achieved': {
        background: colors.purple,
        '&:before': {
            content: '"✓"',
            color: 'white',
        },
    },
    '&.future': {
        background: colors.lightGray,
    },
    '&.current': {
        background: 'white',
        border: `3px solid ${colors.purple}`,
        '&.achieved': {
            background: 'white',
            '&:before': {
                color: colors.purple,
            },
        },
        '.explanation': {
            color: 'black',
        },
    },
    '&.past:not(.achieved)': {
        background: colors.lightGray,
        '&:before': {
            color: colors.darkGray,
            content: '"✕"',
        },
    },
}

const CircleDiv = styled.div(segmentCircleStyle)

interface SegmentCircleProps {
    past?: boolean
    achieved?: boolean
    future?: boolean
    current?: boolean

}
export const SegmentCircle: FC<SegmentCircleProps> = ({ past, future, current, achieved }) => {
    if (!past && !future) {
        current = true
    }
    return (
        <CircleDiv className={
            cx({
                past,
                future,
                current,
                achieved,
            })
        } />
    )
}

export const SegmentLabel: React.FC<{ active: boolean, lines: string[] }> = ({ lines, active }) => {
    return (
        <Box
            direction="column"
            justify='center'
            align='center'
            className="explanation" css={{
                fontSize: 12,
                color: active ? 'black' : colors.darkGray,
            }}>
            {lines.map((txt, i) => <span key={i}>{txt}</span>)}
        </Box>
    )
}

interface SegmentedBarProps {
    className?: string
    completedPercentage: number
}

export const SegmentedBar: FCWC<SegmentedBarProps> = ({ className, children, completedPercentage }) => {

    return (
        <div
            className={cx('segmented-bar', className)}
            css={{
                height: `${barWidth}px`,
                flex: 1,
                borderRadius: '4px',
                background: colors.lightGray,
                position: 'relative',
                marginRight: '20px',
            }}
        >
            <span
                data-test-id="progress-indicator"
                data-percentage-complete={completedPercentage}
                css={{
                    height: '100%',
                    width: `${completedPercentage}% `,
                    position: 'absolute',
                    borderRadius: '4px 0 0 4px',
                    background: colors.purple,
                }}
            />
            {children}
        </div>
    )
}
