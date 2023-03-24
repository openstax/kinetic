import { Box, React, useState } from '@common';
import { Icon } from '@components';
import { colors } from '@theme';
import { Button, Col, InputField, useFormContext } from '@nathanstitt/sundry';
import { IRB } from '../../../account/researcher-account-page';
import { EditingStudy } from '@models';
import { useCurrentResearcher, useCurrentUser, useUserInfo } from '@lib';

export const ResearchTeam: FC<{study: EditingStudy}> = ({ study }) => {
    const [piMyself, setPiMyself] = useState<boolean>(false)
    const [leadMyself, setLeadMyself] = useState<boolean>(false)
    const { watch, setValue } = useFormContext()
    const userEmail = useUserInfo()?.contact_infos.find(info => info.type === 'EmailAddress')?.value

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

                    <InputField
                        name='researcherPi'
                        readOnly={piMyself}
                        type='text'
                        placeholder='Institutional Email Address'
                    />
                </Col>

                <Col sm={4} direction='column' align='start' justify='center' gap='large'>
                    <InviteCollaborator disabled={piMyself || !watch('researcherPi')}/>
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
                    <InputField
                        name='researcherLead'
                        readOnly={leadMyself}
                        type='text'
                        placeholder='Institutional Email Address'
                    />

                </Col>

                <Col sm={4} direction='column' align='start' justify='center' gap='large'>
                    <InviteCollaborator disabled={leadMyself || !watch('researcherLead')}/>
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

const InviteCollaborator: FC<{disabled: boolean}> = ({ disabled }) => {
    const invite = () => {

    }
    return (
        <div>
            <Button className='btn-researcher-secondary' disabled={disabled} onClick={() => invite()}>
                Invite Collaborator
            </Button>

        </div>
    )
}
