import { EditingStudy } from '@models';
import { Box, React, useState } from '@common';
import { Icon } from '@components';
import { colors } from '@theme';
import { Col } from '@nathanstitt/sundry';

export const AdditionalSessions: FC<{study: EditingStudy}> = ({ study }) => {
    const [additionalSession, setAdditionalSession] = useState<boolean>(false)
    return (
        <Box className='mt-6' direction='column' gap='xlarge'>
            <Box gap direction='column'>
                <Box gap='xlarge'>
                    <h3 className='fw-bold'>Additional sessions (optional)</h3>
                    <Box gap align='center'>
                        <Icon height={20} color={colors.kineticResearcher} icon='clockFill'/>
                        <span>ETA: 10 min</span>
                    </Box>
                </Box>

                <p>You can skip this part if you don’t have any other session to add. Feel free to come back at any time to add session(s).</p>
            </Box>

            <Box gap='xlarge'>
                <Col sm={3} direction='column' gap>
                    <h6>Do you want another session? </h6>
                    <small>This is intended for a delayed measure for longitudinal study, choose yes if you want.</small>
                </Col>

                <Col sm={4} direction='column' gap>
                    <Box gap='medium'>
                        <Box direction='column'>
                            <Box gap>
                                <input type='radio' id='yes' checked={additionalSession} onChange={() => setAdditionalSession(!additionalSession)} />
                                <label htmlFor="yes">Yes</label>
                            </Box>
                            <Box gap>
                                <input type='radio' id='no' checked={!additionalSession} onChange={() => setAdditionalSession(!additionalSession)} />
                                <label htmlFor="no">Not right now</label>
                            </Box>
                        </Box>
                    </Box>
                </Col>
            </Box>
        </Box>
    )
}
