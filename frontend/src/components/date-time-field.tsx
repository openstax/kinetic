import { React, useMemo, useState, useCallback, cx } from '@common'
import { Box } from 'boxible'
import styled from '@emotion/styled'
import { DateTime, DateTimeProps } from './date-time'
import { uniqueId, compact } from 'lodash-es'
import { useFormContext } from './form'
import { FloatingField, FloatingFieldProps } from './floating-field'
import { FloatingLabel } from './label'
import { Icon } from './icon'

interface DateTimeFieldFieldProps extends DateTimeProps, Omit<FloatingFieldProps, 'id' | 'name' | 'align'> {

}

const Wrapper = styled(FloatingField)({
    display: 'flex',
    paddingTop: 0,
    paddingBottom: 0,
    flexDirection: 'column',
    '.controls': {
        display: 'flex',
        '.form-control': {
            padding: 0,
            display: 'flex',
        },
    },
    '.flatpickr-input': {
        height: 'calc(3.5rem + 2px)',

        border: 0,
        flex: 1,
        '&:focus': {
            outline: 'none',
        },
        '&[readonly]': {
            cursor: 'default',
        },
    },
    '&.valued': {
        '.flatpickr-input': {
            paddingTop: '1.625rem',
            paddingBottom: '0.625rem',
        },
    },
})

export const DateTimeField: React.FC<DateTimeFieldFieldProps> = ({
    id: providedId,
    innerRef,
    label,
    withTime,
    name,
    readOnly,

    rangeNames,

    ...props
}) => {
    const form = useFormContext()
    const id = useMemo(() => providedId || uniqueId('date-time-field'), [providedId])
    const fieldNames = useMemo<string[]>(() => rangeNames ? rangeNames : [name], [rangeNames, name])

    const values = useMemo(() => compact(fieldNames.map(fn => form.getFieldProps(fn).value)), [form, fieldNames])
    const metas = useMemo(() => fieldNames.map(fn => form.getFieldMeta<Date>(fn)), [fieldNames, form])

    const hasValue = values.length > 0
    const meta = useMemo(() => ({
        error: metas.reduce<string | undefined>((acc, m) => acc || m.error, ''),
        touched: metas.reduce((acc, m) => acc || m.touched, false),
    }), [metas])

    const [isFocused, setFocused] = useState(false)
    const onClear = useCallback(() => {

        fieldNames.map(fn => form.getFieldHelpers<Date | undefined>(fn).setValue(null))
    }, [fieldNames, form])

    const onOpen = useCallback(() => setFocused(true), [setFocused])
    const onClose = useCallback(() => setFocused(false), [setFocused])

    return (
        <Wrapper

            data-field-name={name}
            label={(
                <FloatingLabel isRaised={hasValue || isFocused || readOnly}>
                    {label}
                </FloatingLabel>
            )}
            className={cx('form-control', {
                valued: hasValue,
                'is-invalid': !!meta.error,
            })}
            id={id}
            meta={meta}
            {...props}
        >
            <div className="controls">
                <Box flex>
                    <DateTime
                        id={id}
                        name={name}
                        onOpen={onOpen}
                        onClose={onClose}
                        readOnly={readOnly}
                        withTime={withTime}
                        rangeNames={rangeNames}
                        data-enable-time={withTime}
                        {...props}
                    />
                </Box>
                {(hasValue && !readOnly) && (
                    <Icon onClick={onClear} icon="cancel" color="#cbcccb" />
                )}
            </div>
        </Wrapper>
    )
}
