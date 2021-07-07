import { React } from '../common'
import { colors } from '../theme'
import { isNil } from '../lib/util'
//import { isNil, isArray, filter, map } from 'lodash-es'
import ReactSelect, { Props as ReactSelectProps, ActionMeta, OptionTypeBase } from 'react-select'
import ReactSelectCreate from 'react-select/creatable'


// https://github.com/JedWatson/react-select/blob/master/packages/react-select/src/styles.js
const stdStyles = {
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
    indicatorsContainer: (provided:any) => ({
        ...provided,
        height: '30px',
    }),
}

type ValueT = Array<string | number> | string | number
export type OptionT = { label: string, value: string | number } | null
export type OptionsT = Array<OptionT>

const optionForValue = (value: ValueT | undefined, options: OptionsT) => {
    if (isNil(value)) return value
    return Array.isArray(value) ?
        options.filter(o => o && value.includes(o.value)) :
        options.find(o => o?.value == value)
}

export interface SelectProps extends Omit<ReactSelectProps, 'isMulti'> {
    defaultValue?: ValueT
    value?: ValueT
    isMulti?: boolean
    isClearable?: boolean
    options: OptionsT
    onChange?(value: null | ValueT , meta: ActionMeta<OptionTypeBase>): void

}

export const Select: React.FC<SelectProps> = ({
    small, defaultValue, value, onChange, options, onCreateOption: onC, ...props
}) => {
    const onChangeHandler = onChange ? (option: OptionT, meta: ActionMeta<OptionTypeBase>) => {
        if (option) {
            onChange(Array.isArray(option) ? option.map(o => o?.value) : option.value, meta)
        } else {
            onChange(props.isMulti ? [] : null, meta)
        }
    } : null

    const S = (onC ? ReactSelectCreate : ReactSelect) as any
    const onCreateOption = onC ? ((value: ValueT) => onC(value, onChangeHandler)) : undefined

    return (
        <S
            options={options}
            styles={small ? smallStyles : stdStyles}
            {...props}
            onCreateOption={onCreateOption}
            value={optionForValue(value, options)}
            defaultValue={optionForValue(defaultValue, options)}
            onChange={onChangeHandler}
        />
    )
}
