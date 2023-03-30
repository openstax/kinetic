import { Box, React, useEffect, useMemo, useState } from '@common';
import { Icon } from '@components';
import { colors } from '@theme';
import { Col, InputField, Select, SelectField, SelectOption, useFormContext } from '@nathanstitt/sundry';
import { IRB } from '../../../account/researcher-account-page';
import { EditingStudy } from '@models';
import { useApi, useUserInfo } from '@lib';
import { Researcher } from '@api';
import { components, OptionProps } from 'react-select';

interface ResearcherOptionI {
    readonly researcher: Researcher;
}

const ResearcherOption: FC<OptionProps<ResearcherOptionI>> = (props: OptionProps<ResearcherOptionI>) => {
    return (
        <components.Option {...props}>
            <small>
                {props.data.researcher.firstName} {props.data.researcher.lastName}
            </small>
        </components.Option>
    );
};

export const ResearchTeam: FC<{study: EditingStudy}> = ({ study }) => {
    const api = useApi()
    const [researchers, setResearchers] = useState<Researcher[]>([])
    const [piMyself, setPiMyself] = useState<boolean>(false)
    const [leadMyself, setLeadMyself] = useState<boolean>(false)
    const { watch, setValue } = useFormContext()
    const userEmail = useUserInfo()?.contact_infos.find(info => info.type === 'EmailAddress')?.value

    useEffect(() => {
        api.getResearchers().then(researchers => {
            setResearchers(researchers.data || [])
        })
    }, [researchers.length])

    const researcherOptions: SelectOption[] = useMemo(() => {
        // TODO Add email to label once we have it available
        return researchers.map(r => ({
            label: `${r.firstName} ${r.lastName}`,
            value: r.id,
        }))
    }, [researchers])

    console.log(watch())

    return (
        <Box className='mt-6' direction='column' gap='xlarge'>
            <Box gap='xlarge'>
                <h3 className='fw-bold'>Research Team</h3>
                <Box gap align='center'>
                    <Icon height={20} color={colors.kineticResearcher} icon='clockFill'/>
                    <span>ETA: 2 min</span>
                </Box>
            </Box>

            <Box gap='xlarge'>
                <Col sm={3} direction='column' gap>
                    <h6>Study PI*</h6>
                    <small>Invite the study PI as a collaborator, and enable them to view and manage the study from their own account</small>
                </Col>

                <Col sm={4} direction='column' gap='large'>
                    <Box gap='medium'>
                        <input type="checkbox" checked={piMyself} onChange={() => {
                            setPiMyself(!piMyself)
                            setValue('researcherPi', piMyself ? '' : userEmail)
                        }}/>
                        <span>This will be myself</span>
                    </Box>

                    <SelectField
                        name='researcherPi'
                        options={researcherOptions}
                        isDisabled={piMyself}
                        isClearable
                        placeholder='Search by name or email address'
                    />
                </Col>
            </Box>

            <Box gap='xlarge'>
                <Col sm={3} direction='column' gap>
                    <h6>Postdoc/Student Lead*</h6>
                    <small>Invite the study lead as a collaborator, and enable them to view and manage the study from their own account</small>
                </Col>

                <Col sm={4} direction='column' gap='large'>
                    <Box gap='medium'>
                        <input type="checkbox" checked={leadMyself} onChange={() => {
                            setLeadMyself(!leadMyself)
                            setValue('researcherLead', leadMyself ? '' : userEmail)
                        }}/>
                        <span>This will be myself</span>
                    </Box>
                    <SelectField
                        name='researcherLead'
                        options={researcherOptions}
                        isDisabled={leadMyself}
                        isClearable
                        placeholder='Search by name or email address'
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
