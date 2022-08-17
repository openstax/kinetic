import { React, styled, useMemo, cx } from '../common'
import { useField } from 'formik'
import { isNil } from '../lib/util'
import { FloatingField, FloatingFieldProps } from './floating-field'
import { useFormContext } from './form'
import { uniqueId } from 'lodash-es'
import { useCallback } from 'react'

const inputFieldToggleStyle = {
    padding: 0,
    width: '25px',
    height: '25px',
    margin: '0 5px 0 0',
}
export const InputFieldCheckbox = styled.input(inputFieldToggleStyle)
export const InputFieldRadio = styled.input(inputFieldToggleStyle)
export const InputFieldTextarea = styled.textarea(({ height = '110' }: any) => ({
    '&.form-control': { minHeight: `${height}px` },
}))
const INPUTS = {
    checkbox: InputFieldCheckbox,
    radio: InputFieldRadio,
    textarea: InputFieldTextarea,
}

export const CheckboxFieldWrapper = styled(FloatingField)({
    display: 'flex',
    alignItems: 'center',
    height: '100%',
    padding: '0.375rem 0.75rem', // styles mimic form-control
    color: '#212529',
    backgroundColor: '#fff',
    border: '1px solid #ced4da',
    borderRadius: '0.25rem',
    label: {
        flex: 1,
    },
})

export interface InputProps extends
    Omit<React.HTMLProps<HTMLInputElement>, 'height' | 'width' | 'wrap' | 'label'>,
    Omit<FloatingFieldProps, 'label' | 'id'> {
    type?: 'checkbox' | 'radio' | 'textarea' | 'text' | 'password' | 'email' | 'number' | 'tel' | 'url'
    autoComplete?: string
    readOnly?: boolean
    onBlur?: any
    autoFocus?: boolean
    rows?: number
    id?: string
    label?: React.ReactNode,
}

export const InputField = React.forwardRef<HTMLInputElement | HTMLTextAreaElement, InputProps>((
    forwardedProps, ref
) => {

    const {
        label,
        name,
        id: providedId,
        onBlur: propsOnBlur,
        readOnly: propsReadonly,
        type = 'text',
        onChange: onChangeProp,
        ...props
    } = forwardedProps

    const id = useMemo(() => providedId || uniqueId('date-time-field'), [providedId])
    const [field, meta] = useField({ type, name, ...props as any })
    const hasError = Boolean(meta.touched && meta.error)
    const InputComponent: any = (INPUTS as any)[type] || 'input'
    const formContext = useFormContext()
    const isCheckLike = type === 'radio' || type === 'checkbox'
    const Wrapper = isCheckLike ? CheckboxFieldWrapper : FloatingField
    const labelEl = <label htmlFor={id} className='col-form-label'>{label}</label>
    const readOnly = propsReadonly == null ? formContext.readOnly : propsReadonly
    const onBlur = useMemo(() => (e: React.FocusEvent<HTMLInputElement>) => {
        field.onBlur(e)
        propsOnBlur && propsOnBlur(e)
    }, [field, propsOnBlur])
    const onChange = useCallback((ev: React.ChangeEvent<HTMLInputElement>) => {
        field.onChange(ev)
        onChangeProp?.(ev)
    }, [onChangeProp, field])

    const input = (
        <InputComponent
            {...field}
            {...props}
            ref={ref}
            onChange={onChange}
            disabled={readOnly}
            onBlur={onBlur}
            readOnly={readOnly}
            placeholder={label == null ? 'placeholder' : label}
            value={isNil(field.value) ? '' : field.value}
            type={type}
            id={id}

            className={cx({
                'form-control': !isCheckLike,
                'form-check-input': isCheckLike,
                'is-invalid': hasError,
            })}
        />
    )
    if (!label) {
        return input
    }
    return (
        <Wrapper
            id={id}
            meta={meta}
            {...props}
            label={labelEl}
            className={cx({
                'form-floating': !isCheckLike,
            })}
        >
            {input}
        </Wrapper>
    )
})

InputField.displayName = 'InputField'
