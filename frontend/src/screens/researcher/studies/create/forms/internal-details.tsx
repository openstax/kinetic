import { EditingStudy } from '@models';
import { React, Box, useState } from '@common';
import { Icon } from '@components';
import { colors } from '@theme';
import { Col, InputField, SelectField } from '@nathanstitt/sundry';

const studyTypes = [
    { value: 'Cognitive Tasks & Assessments', label: 'Cognitive Tasks & Assessments' },
    { value: 'Survey', label: 'Survey' },
    { value: 'Research', label: 'Research' },
    { value: 'Learner-characteristics', label: 'Learner-characteristics' },
    { value: 'Transfer of Learning', label: 'Transfer of Learning' },
];

export const InternalDetails: FC<{study: EditingStudy}> = ({ study }) => {
    const [studyType, setStudyType] = useState('')

    return (
        <Box className='mt-6' direction='column' gap='xlarge'>
            <Box gap='xlarge'>
                <h3 className='fw-bold'>Internal Details</h3>
                <Box gap align='center'>
                    <Icon height={20} color={colors.kineticResearcher} icon='clockFill'/>
                    <span>ETA: 2 min</span>
                </Box>
            </Box>

            <Box gap='xlarge'>
                <Col sm={3} direction='column' gap>
                    <h6>Internal Study Title*</h6>
                    <small>This is an internal title only visible to researchers. It can adopt a more technical language</small>
                </Col>

                <Col sm={4} direction='column' gap>
                    <InputField
                        name='titleForResearchers'
                        type='textarea'
                    />
                </Col>
            </Box>

            <Box gap='xlarge'>
                <Col sm={3} direction='column' gap>
                    <h6>Study Type (optional)</h6>
                    <small>Internal tags only visible to researchers</small>
                </Col>

                <Col sm={4} direction='column' gap>
                    <SelectField
                        name="studyType"
                        isClearable={true}
                        onChange={(value: string) => setStudyType(value)}
                        // value={study.studyType}
                        defaultValue={studyType}
                        options={studyTypes}
                    />
                </Col>
            </Box>
        </Box>
    )
}
