import { EditingStudy } from '@models';
import { Box, React, useState } from '@common';
import { Icon } from '@components';
import { colors } from '@theme';
import { Button, Col, useFormContext } from '@nathanstitt/sundry';
import { AddStage, NewStage, Stage } from '@api';
import { uniqueId } from 'lodash-es';

export const AdditionalSessions: FC<{study: EditingStudy}> = ({ study }) => {
    const [additionalSession, setAdditionalSession] = useState<boolean>(!!study.stages && study.stages.length > 1)
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
                                <input
                                    type='radio'
                                    id='yes'
                                    checked={additionalSession}
                                    onChange={() => setAdditionalSession(!additionalSession)}
                                />
                                <label htmlFor="yes">Yes</label>
                            </Box>
                            <Box gap>
                                <input
                                    type='radio'
                                    id='no'
                                    checked={!additionalSession}
                                    onChange={() => setAdditionalSession(!additionalSession)}
                                />
                                <label htmlFor="no">Not right now</label>
                            </Box>
                        </Box>
                    </Box>
                </Col>
            </Box>

            {additionalSession && <MoreSessions study={study}/>}
        </Box>
    )
}

const MoreSessions: FC<{study: EditingStudy}> = ({ study }) => {
    const initialSessions: (Stage | NewStage)[] = (study.stages || []).slice(1)
    // populate with empty stage to render
    initialSessions.push({
        order: initialSessions.length,
        config: {},
    })
    // Don't include the first session here
    const [sessions, setSessions] = useState<(Stage | NewStage)[]>(initialSessions)
    // const [numSessions, setNumSessions] = useState<number>(additionalSessions.length)
    const { watch } = useFormContext()
    // const sessions = watch('stages')
    // console.log(sessions);


    const addSession = () => {
        setSessions(prev => ([
            ...prev,
            {
                order: prev.length,
                config: {},
            } as NewStage,
        ]))
    }

    const removeSession = (index: number) => {
        setSessions(prev => prev.filter((_, i) => i !== index))
    }

    console.log(sessions);
    return (
        <Col direction='column' sm={8} gap='large'>
            {sessions.map((stage, index) => (
                <AdditionalSession key={uniqueId('stage_')} index={index} onDelete={removeSession} />
            ))}

            <Button
                icon='plus'
                align='center'
                css={{
                    border: `1px solid ${colors.lightGray}`,
                    padding: 12,
                }}
                onClick={() => addSession()}
            >
                Add another session
            </Button>
        </Col>
    )
}


const AdditionalSession: FC<{ index: number, onDelete: (index: number) => void }> = ({ index, onDelete }) => {
    const { register } = useFormContext()

    return (
        <Col direction='column' css={{ border: `1px solid ${colors.lightGray}`, borderRadius: 10 }}>
            <Box css={{ backgroundColor: colors.gray, padding: `1rem`, borderRadius: `10px 10px 0 0` }} justify='between'>
                <h4>Session {index}</h4>
                <Icon color={colors.red} icon='trash' onClick={() => onDelete(index) } />
            </Box>

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
                                <input
                                    type='checkbox'
                                    id='score'
                                    {...register(`stages.${index + 1}.feedbackTypes`, { shouldUnregister: true })}
                                />
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
