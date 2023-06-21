import { Box, React, useEffect, useMemo, useState, Yup } from '@common';
import {
    Col,
    FieldErrorMessage,
    FieldTitle,
    Icon,
    SelectField,
    SelectOption,
    StepHeader,
    useFormContext,
} from '@components';
import { IRB } from '../../../account/researcher-account-page';
import { useApi } from '@lib';
import { Researcher, Study } from '@api';
import { components, DropdownIndicatorProps } from 'react-select';

export const researcherValidation = () => {
    return {
        researcherPi: Yup.mixed().when('step', {
            is: 1,
            then: (s: Yup.BaseSchema) => s.required('Required'),
        }),
        researcherLead: Yup.mixed().when('step', {
            is: 1,
            then: (s: Yup.BaseSchema) => s.required('Required'),
        }),
    }
}

const DropdownIndicator = (props: DropdownIndicatorProps) => {
    return (
        <components.DropdownIndicator {...props}>
            <Icon icon='search' />
        </components.DropdownIndicator>
    );
};

export const ResearchTeam: FC<{study: Study}> = ({ study }) => {
    const api = useApi()
    const [researchers, setResearchers] = useState<Researcher[]>([])
    const { setValue, getValues } = useFormContext()

    useEffect(() => {
        api.getResearchers().then(researchers => {
            setResearchers(researchers.data || [])
        })
    }, [])

    const researcherOptions: SelectOption[] = useMemo(() => {
        return researchers.map(r => ({
            label: `${r.firstName} ${r.lastName}`,
            value: r.id,
        }))
    }, [researchers])

    const updateResearchers = () => {
        if (!study.researchers) {
            study.researchers = []
        }

        const members = study.researchers.filter(r => r.role === 'member');
        // TODO build members with form fields in the future, when we support that feature
        const updatedResearchers = [...members]

        const pi = researchers.find(r => r.id === getValues('researcherPi'))
        pi && updatedResearchers.push({ ...pi, role: 'pi' })

        const lead = researchers.find(r => r.id === getValues('researcherLead'))
        lead && updatedResearchers.push({ ...lead, role: 'lead' })

        setValue('researchers', updatedResearchers)
    }

    return (
        <Box className='mt-6' direction='column' gap='xlarge'>
            <StepHeader title='Research Team' eta={2} />

            <Box gap='xlarge'>
                <Col sm={3} direction='column' gap>
                    <FieldTitle required>Study PI</FieldTitle>
                    <small>Select your study PI from the pool of Kinetic researchers, and enable them to view and manage the study from their own account</small>
                </Col>

                <Col sm={4} justify='center' gap>
                    <SelectField
                        name='researcherPi'
                        options={researcherOptions}
                        isClearable
                        placeholder='Search for a researcher by name'
                        components={{ DropdownIndicator }}
                        onChange={updateResearchers}
                    />
                    <small>An email invitation will be sent once you click “Continue’</small>
                    <FieldErrorMessage name='researcherPi' />
                </Col>
            </Box>

            <Box gap='xlarge'>
                <Col sm={3} direction='column' gap>
                    <FieldTitle required>Study Lead</FieldTitle>
                    <small>Select your study lead from the pool of Kinetic researchers, and enable them to view and manage the study from their own account</small>
                </Col>

                <Col sm={4} justify='center' gap>
                    <SelectField
                        name='researcherLead'
                        options={researcherOptions}
                        isClearable
                        placeholder='Search for a researcher by name'
                        components={{ DropdownIndicator }}
                        onChange={updateResearchers}
                    />
                    <small>An email invitation will be sent once you click “Continue’</small>
                    <FieldErrorMessage name='researcherLead' />
                </Col>
            </Box>

            <Box gap='xlarge'>
                <Col sm={3} direction='column' gap>
                    <FieldTitle>IRB Detail</FieldTitle>
                    <small>Rice University remains the IRB of record until further notice</small>
                </Col>

                <Col sm={4} direction='column' align='start' gap>
                    <IRB/>
                </Col>
            </Box>
        </Box>
    )
}
