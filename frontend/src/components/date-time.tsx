import { React, useMemo, useState, useEffect, useCallback, cx } from '@common'
import FlatPickr from 'flatpickr'
import { Box } from 'boxible'
import { rangePlugin } from '../lib/range-plugin'
import { uniqueId, compact } from 'lodash-es'
import { useFormContext } from './form'
import { toDateTime } from '../lib/date'

export interface DateTimeProps {
    id?: string
    format?: string
    readOnly?: boolean
    options?: FlatPickr.Options.Options

    onOpen?: FlatPickr.Options.Hook;
    onClose?: FlatPickr.Options.Hook;
    onChange?: FlatPickr.Options.Hook;

    rangeNames?: [string, string]
    withTime?: boolean
    name: string,
    className?: string
    innerRef?: React.Ref<HTMLInputElement>
    align?: 'center' | 'end' | 'start' | 'baseline' | 'stretch'
}

export const DateTimeFormats = {
    shortDate: 'M j, Y',
    shortDateTime: 'M j, Y h:i K',
}


export const DateTime: React.FC<DateTimeProps> = ({
    id: providedId,
    name,
    className,
    withTime,
    format = withTime ? DateTimeFormats.shortDateTime : DateTimeFormats.shortDate,
    readOnly: propsReadonly,
    rangeNames,
    onOpen: onOpenProp,
    onClose: onCloseProp,
    onChange: onChangeProp,
    options = {},
}) => {
    const form = useFormContext()
    const { setFieldValue, getFieldHelpers } = form
    const readOnly = propsReadonly == null ? form.readOnly : propsReadonly
    const id = useMemo(() => providedId || uniqueId('date-time'), [providedId])
    const [flatpickrEl, setFlatpickrEl] = useState<HTMLInputElement | null>(null)
    const [endRangePickrEl, setEndRangePickrEl] = useState<HTMLInputElement | null>(null)
    const [flatpickr, setFlatpickr] = useState<FlatPickr.Instance | null>(null)

    const fieldNames = useMemo<string[]>(() => Array.isArray(rangeNames) ? rangeNames : [name], [rangeNames, name])
    const values = useMemo(() => compact(fieldNames.map(fn => form.getFieldProps(fn).value)).map(toDateTime), [form, fieldNames])

    const onChange = useCallback((newDates: Date[], a: any, b: any, c: any) => {
        for (let i = 0; i < fieldNames.length; i++) {
            if (newDates[i] && (newDates[i].getTime() !== values[i]?.getTime())) {
                setFieldValue(fieldNames[i], newDates[i], true)
            }
        }
        onChangeProp?.(newDates, a, b, c)
    }, [fieldNames, setFieldValue, onChangeProp, values])

    const onClose = useCallback((newDates: Date[], a: any, b: any, c: any) => {
        let wasChanged = false
        for (let i = 0; i < fieldNames.length; i++) {
            if (newDates[i] && (newDates[i].getTime() !== values[i]?.getTime())) {
                setFieldValue(fieldNames[i], newDates[i], true)
                wasChanged = true
            }
            getFieldHelpers(fieldNames[i])?.setTouched(true)
        }
        if (wasChanged) onChangeProp?.(newDates, a, b, c)
        onCloseProp?.(newDates, a, b, c)
    }, [fieldNames, setFieldValue, getFieldHelpers, onCloseProp, onChangeProp, values])


    useEffect(() => {
        if (!flatpickrEl) return

        const newOptions = {
            ...options,
            dateFormat: format,
            enableTime: withTime,
        }

        if (flatpickr) {
            flatpickr.set(newOptions)
            flatpickr.set('onChange', onChange)
            flatpickr.set('onClose', onClose)
            flatpickr.set('onOpen', onOpenProp)

            if (!values.length) {
                flatpickr.clear()
            } else {
                if (values.find((dt, i) => dt.getTime() !== flatpickr.selectedDates[i]?.getTime())) {
                    flatpickr.setDate(values, true)
                }
            }
        } else {
            const f = FlatPickr(flatpickrEl, {
                defaultDate: values.length > 1 ? values : values[0],
                disableMobile: true,
                clickOpens: !readOnly,
                mode: rangeNames ? 'range' : 'single',
                plugins: endRangePickrEl ? [rangePlugin({ input: endRangePickrEl })] : [],
                ...newOptions,
                onChange: onChange,
                onClose,
                onOpen: onOpenProp,
            });
            setFlatpickr(f)
            fieldNames.forEach((fldName) => {
                form.registerField(fldName, {})
            })
        }
        return () => {
            fieldNames.forEach((fldName) => {
                form.unregisterField(fldName)
            })
        }
    }, [
        flatpickrEl, fieldNames, rangeNames, readOnly, withTime, flatpickr,
        form, format, options, onClose, onOpenProp, onChange, endRangePickrEl, values,
    ])


    return (
        <Box align='baseline' gap flex>
            <input
                id={id}
                disabled={readOnly}
                ref={setFlatpickrEl}
                className={cx('form-control', 'flatpickr-input', className)}
                readOnly
                type="text"
            />
            {fieldNames.length > 1 && (
                <input
                    id={`${id}-2nd`}
                    disabled={readOnly}
                    ref={setEndRangePickrEl}
                    className={cx('form-control', 'flatpickr-input', className)}
                    readOnly
                    type="text"
                />
            )}
        </Box>
    )
}
