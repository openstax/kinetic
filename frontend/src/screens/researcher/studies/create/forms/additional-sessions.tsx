import { EditingStudy } from '@models';
import { Box, React, useState } from '@common';
import { Icon } from '@components';
import { colors } from '@theme';
import { Col, InputField } from '@nathanstitt/sundry';

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

            {additionalSession && <MoreSessions />}
        </Box>
    )
}

const MoreSessions: FC<{}> = () => {
    return (
        <Col
            direction='column'
            sm={8}
            css={{ border: `1px solid ${colors.lightGray}`, borderRadius: 10 }}
        >
            <div css={{ backgroundColor: colors.gray, padding: `1rem`, borderRadius: `10px 10px 0 0` }}>
                <h4>Session 2</h4>
            </div>

            <Box direction='column' css={{ padding: '1rem' }} gap='xlarge'>
                <Box gap='xlarge'>
                    <Col sm={4} direction='column' gap>
                        <h6>Duration & points*</h6>
                    </Col>

                    <Col sm={6} gap>
                        <Box gap>
                            <input type='radio' id='pts' readOnly={true} name='pointsAndDuration'  />
                            <label htmlFor="pts">35 points</label>
                        </Box>
                    </Col>
                </Box>

                <Box gap='xlarge'>
                    <Col sm={4} direction='column' gap>
                        <h6>Participant Feedback*</h6>
                        <small>Share with participants what type of feedback to expect at the end of the study. Preferred feedback indicated.</small>
                    </Col>

                    <Col sm={6} direction='column' gap='medium'>
                        <Box direction='column'>
                            <Box gap>
                                <input type='checkbox' id='score' name='feedbackScore' />
                                <label htmlFor="score">Score</label>
                            </Box>
                            <Box gap>
                                <input type='checkbox' id='debrief' name='feedbackDebrief' />
                                <label htmlFor="debrief">Debrief</label>
                            </Box>
                            <Box gap>
                                <input type='checkbox' id='personalized' name='feedbackPersonalized' />
                                <label htmlFor="personalized">Personalized</label>
                            </Box>
                            <Box gap>
                                <input type='checkbox' id='general' name='feedbackGeneral' />
                                <label htmlFor="general">General</label>
                            </Box>
                        </Box>
                    </Col>
                </Box>
            </Box>


        </Col>
    )
}
