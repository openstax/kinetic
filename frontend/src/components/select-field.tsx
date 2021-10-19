import { React, styled, useState, cx } from '../common'
import { useField } from 'formik'
import { FloatingFieldProps, FloatingField } from './floating-field'
import { FloatingLabel } from './label'
import { useFormContext } from './form'
import { Select, SelectOption, SelectProps, SelectValue } from './select'


export interface SelectFieldProps extends SelectProps, Omit<FloatingFieldProps, 'name'> {
    id: string,
    readOnly?: boolean
    display?: string
    innerRef?: any,
}

export const SelectWrapper = styled(FloatingField)`
    display: flex;
    height: 58px;
    padding-top: 0;
    padding-bottom: 0;
    flex-direction: column-reverse;
    .select-field > * {
        border: 0;
        > * {
            padding-left: 0;
        }
    }
    &.is-invalid { background-position: right 0.5rem top 0.5rem; }
    .xtra {
        flex-direction: row;
        padding-top: 5px;
        height: initial;
        .invalid {
           margin: 0 20px 0 5px;
        }
    }
`

export const SelectField: React.FC<SelectFieldProps> = ({
    id,
    innerRef,
    label,
    isMulti,
    readOnly: propsReadonly,
    isClearable,
    menuPlacement,
    noOptionsMessage,
    onChange: propsOnChange,
    options = [],
    className,
    theme,
    allowCreate,
    ...props
}) => {
    const [isFocused, setFocusState] = useState(false)
    const [field, meta] = useField(props as any)
    const formContext = useFormContext()
    const hasError = Boolean(meta.touched && meta.error)
    const v = field.value
    const hasValue = Array.isArray(v) ? v.length > 0 : !!v
    const readOnly = propsReadonly == null ? formContext.readOnly : propsReadonly
    const onFocus = () => {
        setFocusState(true)
    }
    const onBlur = () => {
        setFocusState(false)
        field.onBlur({ target: { name: field.name } })
    }
    const labelEl = (
        <FloatingLabel
            displayHigh={!!isMulti}
            isRaised={hasValue || isFocused || readOnly}
        >
            {label}
        </FloatingLabel>
    )
    const onChange = (value: SelectValue, option: SelectOption, meta: any) => {
        field.onChange({ target: { ...field, value } })
        propsOnChange?.(value, option, meta)
    }

    return (
        <SelectWrapper
            label={labelEl}
            className={cx('form-control', className, {
                valued: hasValue,
                'is-invalid': hasError,
            })}
            id={id} meta={meta}
            data-field-name={field.name}
            {...props}
        >

            <Select
                {...field}
                {...props}
                allowCreate={allowCreate}
                isDisabled={readOnly}
                id={id}
                isMulti={isMulti}
                noOptionsMessage={noOptionsMessage}
                isClearable={isClearable}
                menuPlacement={menuPlacement}
                placeholder={<span />}
                onFocus={onFocus}
                onBlur={onBlur}
                className={cx('select-field', { 'is-invalid': hasError })}
                onChange={onChange}
                options={options}
            />
        </SelectWrapper>
    )
}
