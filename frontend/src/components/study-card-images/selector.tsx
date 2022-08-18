import React from 'react';
import { Box } from 'boxible'
import { components, OptionProps, SingleValueProps } from 'react-select';
import { SelectField, SelectFieldProps } from '../select-field'
import { CardImage, CardImages } from './images'

type ImageOption = { value: string, ci: CardImage, label: string }

const imageOptions: ImageOption[] = []

const SingleValue = ({
    children,
    ...props
}: SingleValueProps<ImageOption>) => (

    <components.SingleValue {...props}>
        <Box gap>
            <props.data.ci.image height="30px" />
            <span>{props.data.label}</span>
        </Box>
    </components.SingleValue>
)

const Option = (props: OptionProps<ImageOption>) => {
    return (
        <components.Option {...props} >
            <Box align='center' gap>
                <props.data.ci.image height="80px" />
                <div css={{ fontSize: 20 }}>{props.data.label}</div>
            </Box>
        </components.Option>
    )
}

for (const [value, ci] of Object.entries(CardImages)) {
    imageOptions.push({ value, ci, label: ci.title })
}

interface CardImagesSelectorProps extends Omit<SelectFieldProps<ImageOption>, 'options'> {

}

export const CardImagesSelector: React.FC<CardImagesSelectorProps> = (props) => (
    <SelectField
        {...props}
        components={{ Option, SingleValue } as any}
        options={imageOptions}
    />
);
