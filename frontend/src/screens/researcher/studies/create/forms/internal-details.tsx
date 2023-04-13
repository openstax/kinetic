import { EditingStudy } from '@models';
import { Box, React } from '@common';
import { CharacterCount, FieldErrorMessage, Icon } from '@components';
import { colors } from '@theme';
import { Col, InputField, SelectField, useFormContext } from '@nathanstitt/sundry';
import { components, OptionProps } from 'react-select';

const studyTypes = [
    {
        value: 'Cognitive Tasks & Assessments',
        label: 'Cognitive Tasks & Assessments',
        desc: 'Measures of human cognition, such as working memory, reasoning, and problem-solving, as well as prior knowledge and skills',
    },
    {
        value: 'Learner Characteristics',
        label: 'Learner Characteristics',
        desc: 'Individual differences measures related to learning and education that provide insight into who is the learner',
    },
    {
        value: 'Research',
        label: 'Research',
        desc: 'Learning and educational studies, such as A/B/N tests, quasi experiments, and single-domain interventional research',
    },
    {
        value: 'Survey',
        label: 'Survey',
        desc: 'Self-report measures related to understanding learner needs, such as product development, UX design, and marketing research',
    },
    {
        value: 'Transfer of Learning',
        label: 'Transfer of Learning',
        desc: 'Interventions that assess learning or other outcomes across domains',
    },
];

interface StudyOption {
    readonly value: string;
    readonly label: string;
    readonly desc: string;
}

const Option: FC<OptionProps<StudyOption>> = (props: OptionProps<StudyOption>) => {
    return (
        <components.Option {...props}>
            <Box direction='column' gap='small'>
                <h6 className='fw-bold'>{props.data.label}</h6>
                <small>{props.data.desc}</small>
            </Box>
        </components.Option>
    );
};

export const InternalDetails: FC<{study: EditingStudy}> = ({ study }) => {
    return (
        <Box className='mt-6' direction='column' gap='xlarge'>
            <Box gap='xlarge'>
                <h3 className='fw-bold'>Internal Details</h3>
                <Box gap align='center'>
                    <Icon height={20} color={colors.kineticResearcher} icon='clockFill'/>
                    <span>ETA: 5 min</span>
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
                    <FieldErrorMessage name='titleForResearchers' />
                    <CharacterCount max={100} name={'titleForResearchers'} />
                </Col>
            </Box>

            <Box gap='xlarge'>
                <Col sm={3} direction='column' gap>
                    <h6>Internal Description*</h6>
                    <small>This is an internal description only visible to researchers. It can adopt a more technical language</small>
                </Col>

                <Col sm={4} direction='column' gap>
                    <InputField
                        name='internalDescription'
                        type='textarea'
                    />
                    <FieldErrorMessage name='internalDescription' />
                    <CharacterCount max={250} name={'internalDescription'} />
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
                        defaultValue={study.studyType}
                        options={studyTypes}
                        components={{ Option } as any}
                    />
                </Col>
            </Box>
        </Box>
    )
}
