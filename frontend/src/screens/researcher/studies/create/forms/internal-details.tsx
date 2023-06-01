import { EditingStudy } from '@models';
import { Box, React, useMemo, Yup } from '@common';
import { CharacterCount, FieldErrorMessage, Icon,  Col, InputField, SelectField } from '@components';
import { colors } from '@theme';
import { components, OptionProps } from 'react-select';
import { Study } from '@api';

export const internalDetailsValidation = (studies: Study[], study: EditingStudy) => {
    const allOtherStudies = useMemo(() => studies?.filter(s => 'id' in study && s.id !== study.id), [studies])
    return {
        titleForResearchers: Yup.string().when('step', {
            is: 0,
            then: (s: Yup.BaseSchema) => s.required('Required').max(100)
                .test(
                    'Unique',
                    'This study title is already in use. Please change your study title to make it unique.',
                    (value?: string) => {
                        if (!studies.length) {
                            return true
                        }
                        return allOtherStudies.every(study => study.titleForResearchers?.toLowerCase() !== value?.toLowerCase())
                    }
                ),
        }),
        internalDescription: Yup.string().max(250, 'Max 250 Characters').when('step', {
            is: 0,
            then: (s: Yup.BaseSchema) => s.required('Required'),
        }),
        studyType: Yup.string().when('step', {
            is: 0,
            then: (s: Yup.BaseSchema) => s.required('Required'),
        }),
    }
}

const studyTypes = [
    {
        value: 'Cognitive Task & Assessment',
        label: 'Cognitive Task & Assessment',
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
        desc: 'Surveys, assessments, and/or interventions related to understanding learner needs, such as product development and UX design',
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
                    <span>ETA: 2min</span>
                </Box>
            </Box>

            <Box gap='xlarge'>
                <Col sm={3} direction='column' gap>
                    <h6>Internal Study Title*</h6>
                    <small>
                        This is an internal title only visible to researchers. Feel free to use technical language that is meaningful.
                    </small>
                </Col>

                <Col sm={4} direction='column' gap>
                    <InputField
                        name='titleForResearchers'
                        type='textarea'
                    />
                    <FieldErrorMessage name='titleForResearchers' liveCountMax={100}/>
                </Col>
            </Box>

            <Box gap='xlarge'>
                <Col sm={3} direction='column' gap>
                    <h6>Internal Description*</h6>
                    <small>Brief short description of what this study investigates</small>
                </Col>

                <Col sm={4} direction='column' gap>
                    <InputField
                        name='internalDescription'
                        type='textarea'
                    />
                    <FieldErrorMessage name='internalDescription' liveCountMax={250}/>
                </Col>
            </Box>

            <Box gap='xlarge'>
                <Col sm={3} direction='column' gap>
                    <h6>Study Type</h6>
                    <small>Internal tags only visible to researchers</small>
                </Col>

                <Col sm={4} direction='column' gap>
                    <SelectField
                        name="studyType"
                        data-testid='study-type'
                        placeholder='Select Type'
                        defaultValue={study.studyType}
                        options={studyTypes}
                        components={{ Option } as any}
                    />
                </Col>
            </Box>
        </Box>
    )
}
