import { React, useMemo, useState, useCallback, cx, dayjs } from '@common'
import { useField } from 'formik'
import { useFormContext } from './form'
import FlatPickr from 'react-flatpickr'
import { FloatingField, FloatingFieldProps } from './floating-field'
import { FloatingLabel } from './label'
import { toDayJS } from '@lib'
import { Icon } from './icon'


interface DateTimeProps extends FloatingFieldProps {
    id: string,
    format?: string
    name: string
    readOnly?: boolean
    options?: any
    withTime?: boolean
    innerRef?: React.Ref<HTMLInputElement>
    align?: 'center' | 'end' | 'start' | 'baseline' | 'stretch'
}

export interface DateFieldProps extends React.FC<DateTimeProps> {
    formats: {
        shortDate: string
        shortDateTime: string
    }
}

export const DateField: DateFieldProps = ({
    id,
    innerRef,
    label,
    withTime,
    format = withTime ? DateField.formats.shortDateTime : DateField.formats.shortDate,
    readOnly: propsReadonly,
    options = {},
    ...props
}) => {
    const [fp, setFP] = useState()
    const [field, meta, helpers] = useField(props as any)
    const [isFocused, setFocused] = useState(false)
    const formContext = useFormContext()
    const hasValue = !!field.value
    const value = useMemo(() => hasValue && toDayJS(field.value).toDate(), [hasValue, field.value])
    const strValue = useMemo(() => value ? dayjs(value).format(format) : '', [hasValue, value, format])

    const readOnly = propsReadonly == null ? formContext.readOnly : propsReadonly
    const hasError = Boolean(meta.touched && meta.error)

    const pickrProps = {
        ...field,
        ...props,
        onBlur: undefined,
    }

    const onClose = useCallback((newValue: Date[]) => {
        if (!newValue.length || (
            value && value.getMilliseconds() == newValue[0].getTime()
        )) {
            helpers.setTouched(true)
            setFocused(false)
        }
    }, [value])
    const onChange = useCallback((value: Date[]) => {
        helpers.setTouched(true)
        setFocused(false)
        field.onChange({
            target: {
                ...field,
                value: value.length ? value[0] : null,
            },
        })
    }, [setFocused, field, helpers])
    const onOpen = useCallback(() => setFocused(true), [setFocused])

    return (
        <FloatingField
            css={{
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
            }}
            data-field-name={field.name}
            label={(
                <FloatingLabel isRaised={hasValue || isFocused || readOnly}>
                    {label}
                </FloatingLabel>)}
            className={cx('form-control', {
                valued: hasValue,
                'is-invalid': hasError,
            })}
            id={id}
            meta={meta}
            {...props}
        >
            <div className="controls">
                <FlatPickr
                    {...pickrProps as any}
                    id={id}
                    value={value || ''}
                    data-enable-time={withTime}
                    onOpen={onOpen}
                    options={{
                        disableMobile: true,
                        clickOpens: false,
                        ...options,
                    }}
                    onClose={onClose}
                    onChange={onChange}
                    onCreate={(fp: any) => setFP(fp)}
                    render={({ className, value, ...inputProps }, ref) => {
                        return (
                            <input
                                disabled={readOnly}
                                ref={ref}
                                className={cx('form-control', 'flatpickr-input', className)}
                                {...inputProps as any}
                                readOnly
                                type="text"
                                onClick={() => !readOnly && (fp as any).open()}
                                value={strValue}
                            />
                        )
                    }}
                />
                {(hasValue && !readOnly) && (
                    <Icon onClick={() => onChange([])} icon="cancel" color="#cbcccb" />
                )}
            </div>
        </FloatingField>
    )
}

DateField.formats = {
    shortDate: 'll' ,
    shortDateTime: 'lll',
}
