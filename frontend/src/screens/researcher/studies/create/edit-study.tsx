import { Box, React, useEffect, useNavigate, useParams, useState } from '@common'
import { useApi, useQueryParam } from '@lib';
import { EditingStudy } from '@models';
import { Icon, LoadingAnimation, TopNavBar } from '@components';
import { ProgressBar } from './progress-bar';
import { ExitButton } from './researcher-study-landing';
import { Button, Col, Form, Yup } from '@nathanstitt/sundry';
import { Link } from 'react-router-dom';
import { ResearchTeam } from './forms/research-team';
import { InternalDetails } from './forms/internal-details';
import { ParticipantView } from './forms/participant-view';
import { AdditionalSessions } from './forms/additional-sessions';
import { Study } from '@api';

export type StepKey =
    'research-team' |
    'internal-details' |
    'participant-view' |
    'additional-sessions' |
    'waiting-period' |
    'finalize-study'

interface Action {
    text: string
    action?: Function
}

export interface Step {
    index: number
    text: string
    key: StepKey
    optional?: boolean
    disabled?: boolean
    primaryAction?: Action
    secondaryAction?: Action
    backAction?: () => void
    saveAsDraft?: (study: EditingStudy, isNew: boolean) => void
}

const getValidationSchema = (studies: Study[]) => {
    return Yup.object().shape({
        researcherPi: Yup.string().email(),
        researcherLead: Yup.string().email(),
        titleForResearchers: Yup.string().max(45).required()
            .test(
                'Unique',
                'This study title is already in use. Please change your study title to make it unique.',
                (value) => {
                    if (!studies.length) {
                        return true
                    }
                    return studies?.every(study => study.titleForResearchers?.toLowerCase() !== value?.toLowerCase())
                }
            ),
        titleForParticipants: Yup.string().max(45).required()
            .test(
                'Unique',
                'This study title is already in use. Please change your study title to make it unique.',
                (value) => {
                    if (!studies.length) {
                        return true
                    }
                    return studies.every(study => study.titleForParticipants?.toLowerCase() !== value?.toLowerCase())
                }
            ),
    })
}

const renderCurrentStep = (index: number, study: EditingStudy) => {
    switch(index) {
        case 0:
            return <ResearchTeam study={study} />
        case 1:
            return <InternalDetails study={study} />
        case 2:
            return <ParticipantView study={study} />
        case 3:
            return <AdditionalSessions study={study} />
        case 4:
            return
        case 5:
            return
    }
}

export default function EditStudy() {
    const [stepIndex, setStepIndex] = useState<number>(+useQueryParam('step') || 0)

    const nav = useNavigate()
    const api = useApi()
    const [study, setStudy] = useState<EditingStudy | null>()
    const [allStudies, setAllStudies] = useState<Study[]>([])
    const id = useParams<{ id: string }>().id
    const isNew = 'new' === id

    const saveAsDraft = async (study: EditingStudy, isNew: boolean) => {
        if (isNew) {
            const savedStudy = await api.addStudy({
                addStudy: {
                    study: study as any,
                },
            })
            nav(`/study/edit/${savedStudy.id}?step=${stepIndex}`)
        } else {
            await api.updateStudy({ id: Number(id), updateStudy: { study: study as any } })
        }
    }

    useEffect(() => {
        api.getStudies().then(studies => {
            setAllStudies(studies.data || [])
            if (isNew) {
                setStudy({
                    titleForParticipants: '',
                    titleForResearchers: '',
                    isMandatory: false,
                    shortDescription: '',
                    longDescription: '',
                    tags: [],
                })
                return
            }
            const study = studies.data?.find(s => s.id == Number(id))
            if (study) {
                setStudy(study)
            } else {
                // setError('study was not found')
            }
        })
    }, [id])

    if (!study) {
        return <LoadingAnimation message="Loading study details" />
    }

    const steps: Step[] = [
        {
            index: 0,
            text: 'Research Team',
            key: 'research-team',
            backAction: undefined,
            saveAsDraft: saveAsDraft,
            primaryAction: {
                text: 'Continue',
                action: () => {
                    // save study?
                    setStepIndex(1)
                },
            },
        },
        {
            index: 1,
            text: 'Internal Details',
            key: 'internal-details',
            saveAsDraft: saveAsDraft,
            primaryAction: {
                text: 'Continue',
                action: () => {
                    // save study?
                    setStepIndex(2)
                },
            },
        },
        {
            index: 2,
            text: 'Participant View',
            key: 'participant-view',
            saveAsDraft: saveAsDraft,
            primaryAction: {
                text: 'Continue',
                action: () => {
                    // save study?
                    setStepIndex(2)
                },
            },
        },
        {
            index: 3,
            text: 'Additional Sessions (optional)',
            key: 'additional-sessions',
            optional: true,
            saveAsDraft: saveAsDraft,
        },
        {
            index: 4,
            text: 'Waiting Period',
            key: 'waiting-period',
            disabled: true,
            saveAsDraft: undefined,
        },
        {
            index: 5,
            text: 'Finalize Study',
            key: 'finalize-study',
            disabled: true,
            saveAsDraft: undefined,
        },
    ]

    return (
        <Box direction='column' className='edit-study vh-100'>
            <TopNavBar hideBanner/>
            <div className="container-lg py-4 mb-10 h-100">
                <Box justify='between'>
                    <Col sm={1}>
                        <span></span>
                    </Col>
                    <Col sm={10}>
                        <ProgressBar steps={steps} currentStep={steps[stepIndex]} setStepIndex={setStepIndex}/>
                    </Col>
                    <Col sm={1}>
                        <ExitButton/>
                    </Col>
                </Box>

                <StudyForm study={study} studies={allStudies}>
                    {renderCurrentStep(stepIndex, study)}
                </StudyForm>
            </div>
            <ActionFooter currentStep={steps[stepIndex]} setStepIndex={setStepIndex}/>
        </Box>
    )
}

const StudyForm: FCWC<{
    study: EditingStudy,
    studies: Study[]
}> = ({ study, studies, children }) => {
    return (
        <Form
            validationSchema={getValidationSchema(studies)}
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
        <Box className='sticky-bottom bg-white' css={{ minHeight: 80, boxShadow: `0px -3px 10px rgba(219, 219, 219, 0.5)` }}>
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
