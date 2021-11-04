import { React, cx, useState, useCallback } from '@common'
import { colors } from '../theme'
import { isNil } from '../lib/util'
import ReactSelect, { Props as ReactSelectProps, ActionMeta } from 'react-select'
import ReactSelectCreate from 'react-select/creatable'

export type SelectOptionType = { [key: string]: any }

// https://github.com/JedWatson/react-select/blob/master/packages/react-select/src/styles.js
const stdStyles = {
    container: (provided: any) => ({
        ...provided,
    }),
    control: (provided: any, state: any) => ({
        ...provided,
        minWidth: '150px',
        background: 'transparent',
        boxShadow: state.isFocused ? null : null,
    }),
    indicatorSeparator: (provided: any, state: any) => ({
        ...provided,
        backgroundColor: state.isDisabled ? 'transparent' : provided.backgroundColor,
    }),
    singleValue: (provided: any) => ({
        ...provided,
        color: colors.text,
    }),
    multiValueRemove: (provided: any, state: any) => ({
        ...provided,
        display: state.isDisabled ? 'none' : provided.display,
    }),
    dropdownIndicator: (provided: any, state: any) => ({
        ...provided,
        color: state.isDisabled ? 'transparent' : provided.color,
    }),
    menu: (provided: any) => ({
        ...provided,
        zIndex: 5,
    }),
}

const smallStyles = {
    ...stdStyles,

    control: (provided: any, state: any) => {
        const base = stdStyles.control(provided, state)
        return {
            ...base,
            background: '#fff',
            borderColor: colors.input.border,
            minHeight: '30px',
            height: '30px',
            minWidth: '100px',
            boxShadow: state.isFocused ? null : null,
        }
    },

    valueContainer: (provided:any) => ({
        ...provided,
        height: '30px',
        padding: '0 6px',
    }),
    input: (provided: any) => ({
        ...provided,
        margin: '0px',
    }),
    indicatorSeparator: () => ({
        display: 'none',
    }),
    multiValueLabel: (provided:any) => ({
        ...provided,
        padding: 0,
        fontSize: '70%',
    }),
    indicatorsContainer: (provided:any) => ({
        ...provided,
        height: '30px',
        padding: 0,
    }),
    dropdownIndicator: (provided:any) => ({
        ...provided,
        padding: 2,
    }),
    clearIndicator: (provided:any) => ({
        ...provided,
        padding: 2,
    }),
}

const tinyStyles = {
    ...smallStyles,
    control: (provided: any, state: any) => {
        const base = smallStyles.control(provided, state)
        return {
            ...base,
            minHeight: '30px',
            height: '30px',
            minWidth: '80px',
            boxShadow: state.isFocused ? null : null,
        }
    },

}

export type SelectValue = Array<string | number> | string | number
export type SelectOption = { label: string, value: string | number } | null
export type SelectOptions = { label: string, value: string | number }[]

const optionForValue = (value: SelectValue | undefined, options: SelectOptions) => {
    if (isNil(value)) return null
    const v = Array.isArray(value) ?
        options.filter(o => o && value.includes(o.value)) :
        options.find(o => o?.value == value)

    return isNil(v) ? null : v
}

export interface SelectProps extends Omit<ReactSelectProps, 'isMulti' | 'onChange' | 'name'> {
    defaultValue?: SelectValue
    value?: SelectValue
    isMulti?: boolean
    isClearable?: boolean
    options: SelectOptions
    onChange?(
        value: null | SelectValue,
        option: SelectOption,
        meta: ActionMeta<SelectOptionType>
    ): void
    small?: boolean
    tiny?: boolean
    allowCreate?: boolean
    className?: string
    name?: string
}


export const Select: React.FC<SelectProps> = ({
    small, tiny, defaultValue, value, onChange, options: providedOptions, className, allowCreate, ...props
}) => {
    const [createdOptions, setCreatedOptions] = useState<SelectOptions>([])
    const options:SelectOptions = [...providedOptions, ...createdOptions]

    // eslint-disable-next-line max-len
    const onChangeHandler = useCallback((selectedOptions: SelectOption, meta: ActionMeta<SelectOptionType>) => {
        onChange
        if (selectedOptions) {
            const value = Array.isArray(selectedOptions) ? selectedOptions.map(o => o?.value) : selectedOptions.value

            if (allowCreate){
                const missing = Array.isArray(selectedOptions) ?
                    selectedOptions.find(so => !options.find(o => o.value == so.value)) :
                    !options.find(o => o.value == selectedOptions.value)
                if (missing) {
                    setCreatedOptions(createdOptions.concat(missing))
                }
            }
            onChange?.(value, selectedOptions, meta)
        } else {
            onChange?.(props.isMulti ? [] : null, selectedOptions, meta)
        }
    }, [onChange, providedOptions])

    const S = (allowCreate ? ReactSelectCreate : ReactSelect) as any

    return (
        <S
            className={cx('select', className)}
            options={options}
            styles={tiny ? tinyStyles : small ? smallStyles : stdStyles}
            {...props}
            value={optionForValue(value, options)}
            defaultValue={optionForValue(defaultValue, options)}
            onChange={onChangeHandler}
        />
    )
}
