import { Box, React, useEffect, useNavigate, useParams, useState } from '@common'
import { useApi } from '@lib';
import { EditingStudy } from '@models';
import { Icon, LoadingAnimation, TopNavBar } from '@components';
import { ProgressBar } from './progress-bar';
import { ExitButton } from './researcher-study-landing';
import { Button, Col, Form, Yup } from '@nathanstitt/sundry';
import { ResearchTeam } from './forms/research-team';
import { Link } from 'react-router-dom';
import { InternalDetails } from './forms/internal-details';

export type StepKey =
    'research-team' |
    'internal-details' |
    'participant-view' |
    'additional-sessions' |
    'waiting-period' |
    'finalize-study'

export interface Step {
    index: number
    text: string
    key: StepKey
    optional?: boolean
    disabled?: boolean
}

export const steps: Step[] = [
    { index: 0, text: 'Research Team', key: 'research-team' },
    { index: 1, text: 'Internal Details', key: 'internal-details' },
    { index: 2, text: 'Participant View', key: 'participant-view' },
    { index: 3, text: 'Additional Sessions (optional)', key: 'additional-sessions', optional: true },
    { index: 4, text: 'Waiting Period', key: 'waiting-period', disabled: true },
    { index: 5, text: 'Finalize Study', key: 'finalize-study', disabled: true },
]

const renderCurrentStep = (index: number, study: EditingStudy) => {
    switch(index) {
        case 0:
            return <ResearchTeam study={study} />
        case 1:
            return <InternalDetails study={study} />
        case 2:
            return
        case 3:
            return
        case 4:
            return
        case 5:
            return
    }
}

export default function EditStudy() {
    const [stepIndex, setStepIndex] = useState<number>(0)

    const nav = useNavigate()
    const api = useApi()
    const [study, setStudy] = useState<EditingStudy | null>()
    const id = useParams<{ id: string }>().id
    const isNew = 'new' === id

    useEffect(() => {
        // TODO
        if (isNew) {
            setStudy({
                titleForParticipants: '',
                isMandatory: false,
                shortDescription: '',
                longDescription: '',
                tags: [],
            })
            return
        }

        api.getStudies().then(studies => {
            const study = studies.data?.find(s => s.id == Number(id))
            if (study) {
                setStudy(study)
            }
            else {
                // setError('study was not found')
            }
        })
    }, [id])

    if (!study) {
        return <LoadingAnimation message="Loading study details" />
    }

    return (
        <Box direction='column' className='edit-study vh-100'>
            <TopNavBar hideBanner/>
            <div className="container-lg py-4">
                <Box justify='between'>
                    <Col sm={1}>
                        <span></span>
                    </Col>
                    <Col sm={10}>
                        <ProgressBar currentStep={steps[stepIndex]} setStepIndex={setStepIndex}/>
                    </Col>
                    <Col sm={1}>
                        <ExitButton/>
                    </Col>
                </Box>

                <StudyForm study={study}>
                    {renderCurrentStep(stepIndex, study)}
                </StudyForm>
            </div>
            <ActionFooter currentStep={steps[stepIndex]} setStepIndex={setStepIndex}/>
        </Box>
    )
}

const StudyForm: FCWC<{study: EditingStudy}> = ({ study, children }) => {
    return (
        <Form
            validationSchema={Yup.object()}
            defaultValues={study}
            onSubmit={() => {}}
            onCancel={() => {}}
        >
            {children}
        </Form>
    )
}

const ActionFooter: FC<{
    currentStep: Step,
    setStepIndex: (index: number) => void
}> = ({ currentStep, setStepIndex }) => {
    const nextStep = () => {
        setStepIndex(currentStep.index + 1)
    }

    const prevStep = () => {
        setStepIndex(currentStep.index - 1)
    }
    return (
        <Box className='mt-auto ' css={{ height: 80, boxShadow: `0px -3px 10px rgba(219, 219, 219, 0.5)` }}>
            <Box className='container-lg' align='center' justify='between'>
                {currentStep.index !== 0 ? <Link to=''>
                    <Box align='center' gap='small' onClick={() => {prevStep()}}>
                        <Icon icon='chevronLeft'></Icon>
                        <span>Back</span>
                    </Box>
                </Link> : <span></span>}

                <Box align='center' gap='large'>
                    <Button
                        className='btn-researcher-secondary'
                        css={{ width: 170, justifyContent: 'center' }}
                        onClick={() => {}}
                    >
                        Save as draft
                    </Button>
                    <Button
                        className='btn-researcher-primary'
                        css={{ width: 170, justifyContent: 'center' }}
                        onClick={() => nextStep()}
                    >
                        Continue
                    </Button>
                </Box>
            </Box>
        </Box>
    )
}
