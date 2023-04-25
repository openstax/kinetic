import { Box, React, useEffect, useMemo, useState } from '@common';
import { colors } from '@theme';
import { Icon, Col, SelectField, SelectOption, useFormContext } from '@components';
import { IRB } from '../../../account/researcher-account-page';
import { EditingStudy } from '@models';
import { useApi } from '@lib';
import { Researcher } from '@api';
import { components, DropdownIndicatorProps } from 'react-select';

const DropdownIndicator = (props: DropdownIndicatorProps) => {
    return (
        <components.DropdownIndicator {...props}>
            <Icon icon='search' />
        </components.DropdownIndicator>
    );
};

export const ResearchTeam: FC<{study: EditingStudy}> = ({ study }) => {
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
            <Box gap='xlarge'>
                <h3 className='fw-bold'>Research Team</h3>
                <Box gap align='center'>
                    <Icon height={20} color={colors.kineticResearcher} icon='clockFill'/>
                    <span>ETA: 5 min</span>
                </Box>
            </Box>

            <Box gap='xlarge'>
                <Col sm={3} direction='column' gap>
                    <h6>Study PI*</h6>
                    <small>Invite the study PI as a collaborator, and enable them to view and manage the study from their own account</small>
                </Col>

                <Col sm={4} justify='center'>
                    <SelectField
                        name='researcherPi'
                        options={researcherOptions}
                        isClearable
                        placeholder='Search for a researcher by name'
                        components={{ DropdownIndicator }}
                        onChange={updateResearchers}
                    />
                </Col>
            </Box>

            <Box gap='xlarge'>
                <Col sm={3} direction='column' gap>
                    <h6>Postdoc/Student Lead*</h6>
                    <small>Invite the study lead as a collaborator, and enable them to view and manage the study from their own account</small>
                </Col>

                <Col sm={4} justify='center'>
                    <SelectField
                        name='researcherLead'
                        options={researcherOptions}
                        isClearable
                        placeholder='Search for a researcher by name'
                        components={{ DropdownIndicator }}
                        onChange={updateResearchers}
                    />
                </Col>
            </Box>

            <Box gap='xlarge'>
                <Col sm={3} direction='column' gap>
                    <h6>IRB Detail</h6>
                </Col>

                <Col sm={4} direction='column' align='start' gap>
                    <IRB/>
                </Col>
            </Box>
        </Box>
    )
}
