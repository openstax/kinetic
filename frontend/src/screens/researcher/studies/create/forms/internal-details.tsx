import { Box, React, Yup } from '@common';
import { Col, FieldErrorMessage, FieldTitle, InputField, ResearcherDetailedCheckbox, StepHeader } from '@components';
import { Study } from '@api';

export const internalDetailsValidation = (allOtherStudies: Study[]) => {
    return {
        titleForResearchers: Yup.string().when('step', {
            is: 0,
            then: (s: Yup.BaseSchema) => s.required('Required').max(45)
                .test(
                    'Unique',
                    'This study title is already in use. Please change your study title to make it unique on Kinetic.',
                    (value?: string) => {
                        if (!allOtherStudies.length) {
                            return true
                        }
                        return allOtherStudies.every(study => study.titleForResearchers?.toLowerCase().trim() !== value?.toLowerCase().trim())
                    }
                ),
        }),
        internalDescription: Yup.string().max(250, 'Max 250 Characters').when('step', {
            is: 0,
            then: (s: Yup.BaseSchema) => s.required('Required'),
        }),
        category: Yup.string().when('step', {
            is: 0,
            then: (s: Yup.BaseSchema) => s.required('Required'),
        }),
    }
}

export const InternalDetails: FC = () => {
    return (
        <Box className='mt-6' direction='column' gap='xlarge'>
            <StepHeader title='Internal Details' eta={2} />

            <Box gap='xlarge'>
                <Col sm={3} direction='column' gap>
                    <FieldTitle required>Internal Study Title</FieldTitle>
                    <small>
                        This is an internal title only visible to researchers. Feel free to use technical language that is meaningful.
                    </small>
                </Col>

                <Col sm={4} direction='column' gap>
                    <InputField
                        name='titleForResearchers'
                        type='textarea'
                    />
                    <FieldErrorMessage name='titleForResearchers' liveCountMax={45}/>
                </Col>
            </Box>

            <Box gap='xlarge'>
                <Col sm={3} direction='column' gap>
                    <FieldTitle required>Internal Description</FieldTitle>
                    <small>Brief description of what this study investigates</small>
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
                    <FieldTitle required>Study Type</FieldTitle>
                    <small>Pick a category that best describes your study</small>
                </Col>

                <Col sm={4} direction='column' gap>
                    <ResearcherDetailedCheckbox
                        name='category'
                        label='Cognitive Task & Assessment'
                        desc='Measures of human cognition, such as working memory, reasoning, and problem-solving, as well as prior knowledge and skills'
                        radio
                    />
                    <ResearcherDetailedCheckbox
                        name='category'
                        label='Learner Characteristics'
                        desc='Individual differences measures related to learning and education that provide insight into who is the learner'
                        radio
                    />
                    <ResearcherDetailedCheckbox
                        name='category'
                        label='Educational Research'
                        desc='Learning and educational studies, such as A/B/N tests, quasi experiments, and single-domain interventional research'
                        radio
                    />
                    <ResearcherDetailedCheckbox
                        name='category'
                        label='Product & Organizational Research'
                        desc='Surveys, assessments, and/or interventions related to understanding learner needs, such as product development and UX design'
                        radio
                    />
                    <ResearcherDetailedCheckbox
                        name='category'
                        label='Transfer of Learning'
                        desc='Interventions that assess learning or other outcomes across domains'
                        radio
                    />
                </Col>
            </Box>
        </Box>
    )
}
