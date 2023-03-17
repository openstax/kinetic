import { Box, React, useState } from '@common';
import { Icon } from '@components';
import { colors } from '@theme';
import { Col, InputField } from '@nathanstitt/sundry';

export default function ResearchTeam() {
    const [piMyself, setPiMyself] = useState<boolean>(false)
    const [leadMyself, setLeadMyself] = useState<boolean>(false)

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

                <Col sm={5} direction='column' align='start' gap>
                    <Box gap='medium'>
                        <input type="checkbox" checked={piMyself} onChange={() => setPiMyself(!piMyself)}/>
                        <span>This will be myself</span>
                    </Box>

                    {/*<InputField name='researcher_pi' disabled={piMyself} type='text'/>*/}
                </Col>

                <Col sm={3} direction='column' align='start' gap='large'>
                    <Box gap='medium'>
                        <input type="checkbox" checked={piMyself} onChange={() => setPiMyself(!piMyself)}/>
                        <span>This will be myself</span>
                    </Box>
                </Col>
            </Box>
        </Box>
    )
}
