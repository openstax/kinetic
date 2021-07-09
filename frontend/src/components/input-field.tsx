import { React, styled, useMemo, cx } from '../common'
import { useField } from 'formik'
import { isNil } from '../lib/util'
import { FloatingField } from './floating-field'
import { useFormContext } from './form'

import { FloatingFieldProps } from './floating-field'
const toggleStyle = {
    padding: 0,
    width: '25px',
    height: '25px',
    margin: '0 5px 0 0',
}
const checkbox = styled.input(toggleStyle)
const radio = styled.input(toggleStyle)
const textarea = styled.textarea(({ height = '110' }: any) => ({
    '&.form-control': { minHeight: `${height}px` },
}))
const INPUTS = { checkbox, radio, textarea }

const CheckWrapper = styled(FloatingField)({
    display: 'flex',
    alignItems: 'center',
    height: '100%',
})

export interface InputProps extends FloatingFieldProps {
    type?: 'checkbox' | 'radio' | 'textarea' | 'text' | 'password' | 'email' | 'number' | 'tel'
    autoComplete?: string
    readOnly?: boolean
    onBlur?: any
    autoFocus?: boolean
    innerRef?: React.Ref<HTMLInputElement>
    rows?: string | number
}

export const InputField: React.FC<InputProps> = ({
    id,
    innerRef,
    label,
    onBlur: propsOnBlur,
    readOnly: propsReadonly,
    type = 'text',
    ...props
}) => {
    const [field, meta] = useField({ type, ...props })
    const hasError = Boolean(meta.touched && meta.error)
    const InputComponent:any = (INPUTS as any)[type] || 'input'
    const formContext = useFormContext()
    const isCheckLike = type == 'radio' || type == 'checkbox'
    const Wrapper = isCheckLike ? CheckWrapper : FloatingField
    const labelEl = <label htmlFor={id} className="col-form-label">{label}</label>
    const readOnly = propsReadonly == null ? formContext.readOnly : propsReadonly
    const onBlur = useMemo(() => (e: React.FocusEvent<HTMLInputElement>) => {
        field.onBlur(e)
        propsOnBlur && propsOnBlur(e)
    }, [field.onBlur, propsOnBlur])

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
            <InputComponent
                {...field}
                {...props}
                disabled={readOnly}
                onBlur={onBlur}
                readOnly={readOnly}
                placeholder={label || 'placeholder'}
                value={isNil(field.value) ? '' : field.value}
                type={type}
                id={id}
                ref={innerRef}
                className={cx('form-control', {
                    'is-invalid': hasError,
                    'form-check-input': isCheckLike,
                })}
            />
        </Wrapper>
    )
}
