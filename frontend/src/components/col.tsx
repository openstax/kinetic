import { React, cx } from '../common'
import { Box, BoxProps } from 'boxible'

export interface ColProps extends BoxProps {
    className?: string
    auto?: boolean
    sm?: number
    md?: number
    lg?: number
    xl?: number
    xxl?: number
    fluid?: boolean
    offset?: {
        sm?: number
        md?: number
        lg?: number
        xl?: number
        xxl?: number
    }
}

export const Col: React.FC<ColProps> = ({
    children,
    auto,
    sm,
    md,
    lg,
    xl,
    xxl,
    fluid,
    className,
    offset = {},
    ...props
}) => {
    return (
        <Box className={cx(className, {
            'col': auto,
            [`col-sm-${sm}`]: sm,
            [`col-md-${md}`]: md,
            [`col-lg-${lg}`]: lg,
            [`col-xl-${xl}`]: xl,
            [`col-xxl-${xxl}`]: xxl,
            'col-fluid': fluid,
            [`offset-sm-${offset.sm}`]: offset.sm,
            [`offset-md-${offset.md}`]: offset.md,
            [`offset-lg-${offset.lg}`]: offset.lg,
            [`offset-xl-${offset.xl}`]: offset.xl,
            [`offset-xxl-${offset.xxl}`]: offset.xxl,
        } as any)} {...props}>
            {children}
        </Box >
    )
}


export interface RowProps {
    className?: string
}

export const Row: React.FC<RowProps> = ({
    children,
    className,
}) => {
    return (
        <div className={cx('row', className)}>{children}</div>
    )
}
