import { React, cx } from '@common'
import { BoxProps } from 'boxible'
import { Col, ColProps } from './col'
import { ExtraInfo } from './label'

export interface FloatingFieldProps extends BoxProps, ColProps {
    id: string
    label: React.ReactNode,
    name?: string
    feedback?: string
    hint?: string
    className?: string
    wrapperClassName?: string
    reversed?: boolean
    meta?: any
    marginBottom?: boolean | number
}


export const FloatingField: FCWC<FloatingFieldProps> = ({
    id,
    name,
    reversed,
    hint,
    meta,
    label,
    children,
    className,
    marginBottom,
    wrapperClassName,
    ...props
}) => {
    return (
        <Col
            className={cx('field-wrapper', wrapperClassName, {
                [`mb-${marginBottom || 2}`]: marginBottom !== false,
            })} {...props}
        >
            <div
                className={cx(className)}
                css={{
                    flex: 1,
                    position: 'relative',
                    '.form-control[readonly]': {
                        backgroundColor: 'inherit',
                    },
                }}
            >
                {children}
                {label}
                <ExtraInfo>
                    {hint && <span className="hint">{hint}</span>}
                    {meta.error && meta.touched && <span className="invalid">{meta.error}</span>}
                </ExtraInfo>
            </div>
        </Col>
    )
}
