import { Box, React, styled } from '@common';
import { Icon, useFormContext, Col } from '@components';
import { colors } from '@theme';
import { uniqueId } from 'lodash-es';
import { InputField } from '../index';

export const StepHeader: FCWOC<{
    title: string,
    eta: number,
}> = ({ title, eta, children }) => {
    return (
        <Col gap sm={8}>
            <Box gap='xlarge'>
                <h3 className='fw-bold'>{title}</h3>
                <Box gap align='center'>
                    <Icon height={20} color={colors.kineticResearcher} icon='clockFill'/>
                    <span>ETA: {eta}min</span>
                </Box>
            </Box>
            {children}
        </Col>
    )
}

export const ResearcherCheckbox = styled(InputField)({
    '.form-check-input, &.form-check-input': {
        height: 16,
        width: 16,
        '&:checked': {
            backgroundColor: colors.kineticResearcher,
            borderColor: colors.kineticResearcher,
        },
    },
})

export const ResearcherDetailedCheckbox: FC<{
    name: string,
    value: string,
    label: string,
    desc: string,
    radio?: boolean
}> = ({ name, value, label, desc, radio }) => {
    const { register } = useFormContext()
    const id = uniqueId(name)
    return (
        <Box gap align='start'>
            <input
                {...register(name)}
                css={{ marginTop: 5 }}
                type={radio ? 'radio' : 'checkbox'}
                id={id}
                value={value}
            />
            <label htmlFor={id}>
                <Box direction='column' gap='small'>
                    <span className='fw-semibold'>{label}</span>
                    <small css={{ color: colors.grayText }}>{desc}</small>
                </Box>
            </label>
        </Box>
    )
}
