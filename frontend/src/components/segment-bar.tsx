import { React, cx } from '@common'
import { colors } from '../theme'
import styled from '@emotion/styled'
import { Box, BoxProps } from 'boxible'
import { CSSObject } from '@emotion/react'

interface SegmentProps extends BoxProps {
    percentage: number
    className?: string
    isFinal?: boolean
}

const barWidth = 7
const circleDiameter = 20

export const SegmentTitle: FCWC<{ className?: string }> = ({ children, className }) => <div className={cx('title', 'small', className)} css={{
    marginTop: '5px',
    lineHeight: '18px',
}}>{children}</div>

const segmentStyle: CSSObject = {
    '.title': {
        textAlign: 'center',
    },
    '&:first-of-type': {
        '.title': {
            textAlign: 'left',
        },
    },
    '&:last-of-type': {
        '.title': {
            textAlign: 'right',
        },
    },
}

const SegmentWrapper = styled(Box)(segmentStyle)

export const Segment: FCWC<SegmentProps> = ({
    children,
    className,
    percentage,
    isFinal,
    ...boxProps
}) => {
    return <SegmentWrapper
        flex={{ grow: false, shrink: false, basis: `${percentage}%` }}
        className={cx('segment', className)}
        direction="column"
        align={isFinal ? 'end' : 'center'}
        {...boxProps}
    > {children}</SegmentWrapper >
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
export const SegmentCircle: FCWOC<SegmentCircleProps> = ({ children, past, future, current, achieved }) => {
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
        }
        >{children}</CircleDiv>
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
        <Box direction='column' flex>
            <div
                className={cx('segmented-bar', className)}
                css={{
                    minHeight: `${barWidth}px`,
                    maxHeight: `${barWidth}px`,
                    borderRadius: '4px',
                    background: colors.lightGray,
                    zIndex: -1,
                    position: 'relative',
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
            </div>
            <div css={{
                marginTop: -1 * ((barWidth + circleDiameter) * 0.5),

                display: 'flex',
                flex: 1,
            }}>
                {children}
            </div>
        </Box >
    )
}
