import { Box, React, useCallback, useEffect, useMemo, useNavigate, useParams, useState, Yup } from '@common'
import { useApi, useQueryParam } from '@lib';
import { EditingStudy, isDraft, useFetchStudy } from '@models';
import {
    Col,
    Form,
    FormSubmitHandler,
    LoadingAnimation,
    Page,
    ResearcherProgressBar,
    Step,
    useFormContext,
    useFormState,
} from '@components';
import { researcherValidation, ResearchTeam } from './forms/research-team';
import { InternalDetails, internalDetailsValidation } from './forms/internal-details';
import { ParticipantView, participantViewValidation } from './forms/participant-view';
import { AdditionalSessions, additionalSessionsValidation } from './forms/additional-sessions';
import { NewStudy, ResearcherRoleEnum, Study } from '@api';
import { ActionFooter } from './action-footer';
import { colors } from '@theme';
import { ReviewStudy, SubmitStudyModal } from './forms/review-study';
import { Toast } from '@nathanstitt/sundry/ui';
import { noop } from 'lodash-es';
import { useLocalstorageState } from 'rooks';
import { ExitStudyFormButton } from '../../../../components/researcher/exit-study-form-button';

const buildValidationSchema = (studies: Study[], study: EditingStudy) => {
    return Yup.object().shape({
        ...internalDetailsValidation(studies, study),
        ...researcherValidation(),
        ...participantViewValidation(studies, study),
        ...additionalSessionsValidation(),
    })
}

const getFormDefaults = (study: EditingStudy, step: StudyStep) => {
    const pi = study.researchers?.find(r => r.role === ResearcherRoleEnum.Pi)?.id
    const lead = study.researchers?.find(r => r.role === ResearcherRoleEnum.Lead)?.id
    return {
        ...study,
        researcherPi: pi,
        researcherLead: lead,
        stages: study.stages,
        step,
    }
}

export default function EditStudy() {
    const nav = useNavigate()
    const id = useParams<{ id: string }>().id
    const { loading, study, setStudy, allStudies } = useFetchStudy(id || 'new')

    if (loading) {
        return <LoadingAnimation />
    }

    if (!study) {
        return useEffect(() => {
            nav('/studies')
        }, [])
    }

    return (
        <Page className='edit-study' backgroundColor={colors.white} hideFooter>
            <StudyForm study={study} studies={allStudies}>
                <FormContent study={study} setStudy={setStudy} />
            </StudyForm>
        </Page>
    )
}

const StudyForm: FCWC<{ study: EditingStudy, studies: Study[] }> = ({ study, studies, children }) => {
    const id = useParams<{ id: string }>().id
    const [studyProgressStep] = useLocalstorageState(`study-progress-${id}`, 0)
    let initialStep = +useQueryParam('step') ||studyProgressStep

    const defaults = useMemo(() => {
        return getFormDefaults(study, initialStep)
    }, [])

    return (
        <Form
            validationSchema={buildValidationSchema(studies, study)}
            defaultValues={defaults}
            onSubmit={noop}
            onCancel={noop}
        >
            {children}
        </Form>
    )
}

export enum StudyStep {
    InternalDetails = 0,
    ResearchTeam = 1,
    ParticipantView = 2,
    AdditionalSessions = 3,
    ReviewStudy = 4,
}

const FormContent: FC<{
    study: EditingStudy,
    setStudy: (study: EditingStudy) => void
}> = ({ study, setStudy }) => {
    const {
        watch,
        setValue,
        getValues,
        reset,
        setFormError,
    } = useFormContext()
    const [showSubmitStudy, setShowSubmitStudy] = useState(false)
    const currentStep = watch('step')
    const id = useParams<{ id: string }>().id
    const isNew = 'new' === id
    const nav = useNavigate()
    const api = useApi()
    const [, setStudyProgressStep] = useLocalstorageState<StudyStep>(`study-progress-${id}`)

    if (!isDraft(study) && !isNew) {
        nav(`/study/overview/${id}`)
    }

    const { isValid, isDirty } = useFormState()

    const setStep = (step: StudyStep) => {
        setValue('step', step, { shouldValidate: true })
        setStudyProgressStep(step)
    }

    const saveStudy = async () => {
        const study = getValues() as EditingStudy
        if (isNew) {
            const savedStudy = await api.addStudy({
                addStudy: { study: study as NewStudy },
            }).catch((err) => setFormError(err))

            if (savedStudy) {
                nav(`/study/edit/${savedStudy.id}?step=${currentStep + 1}`)
                Toast.show({
                    message: `New copy of ${study.titleForResearchers} has been created and saved as a draft. It can now be found under ‘Draft’.`,
                })
                return setStudy(savedStudy)
            }
        }

        if (!isDirty) {
            return;
        }

        const savedStudy = await api.updateStudy({ id: Number(id), updateStudy: { study: study as any } })
        reset(getFormDefaults(savedStudy, currentStep), { keepIsValid: true, keepDirty: false })
        setStudy(savedStudy)
    }

    const steps: Step[] = [
        {
            index: StudyStep.InternalDetails,
            component: <InternalDetails />,
            text: 'Internal Details',
            primaryAction: {
                text: 'Save & Continue',
                disabled: !isValid,
                action: async () => {
                    await saveStudy()
                    setStep(StudyStep.ResearchTeam)
                },
            },
        },
        {
            index: StudyStep.ResearchTeam,
            component: <ResearchTeam study={study} />,
            text: 'Research Team',
            backAction: () => setStep(StudyStep.InternalDetails),
            primaryAction: {
                text: 'Continue',
                disabled: !isValid,
                action: async () => {
                    if (!isDirty) {
                        return setStep(StudyStep.ParticipantView)
                    }

                    await saveStudy()
                    setStep(StudyStep.ParticipantView)
                    Toast.show({
                        message: `Invitations to collaborate on study ${study.titleForResearchers} have successfully been sent.`,
                    })
                },
            },
            secondaryAction: {
                text: 'Save as draft',
                action: saveStudy,
                disabled: !isDirty,
            },
        },
        {
            index: StudyStep.ParticipantView,
            component: <ParticipantView study={study} />,
            text: 'Participant View',
            backAction: () => setStep(StudyStep.ResearchTeam),
            primaryAction: {
                text: 'Continue',
                disabled: !isValid,
                action: async () => {
                    if (!isDirty) {
                        return setStep(StudyStep.AdditionalSessions)
                    }
                    await saveStudy()
                    setStep(StudyStep.AdditionalSessions)
                },
            },
            secondaryAction: {
                text: 'Save as draft',
                action: saveStudy,
                disabled: !isDirty,
            },
        },
        {
            index: StudyStep.AdditionalSessions,
            component: <AdditionalSessions study={study} />,
            text: 'Additional Sessions (optional)',
            backAction: () => setStep(StudyStep.ParticipantView),
            optional: true,
            primaryAction: {
                text: 'Continue',
                disabled: !isValid,
                action: async () => {
                    if (!isDirty) {
                        return setStep(StudyStep.ReviewStudy)
                    }
                    await saveStudy()
                    setStep(StudyStep.ReviewStudy)
                },
            },
            secondaryAction: {
                text: 'Save as draft',
                action: saveStudy,
                disabled: !isDirty,
            },
        },
        {
            index: StudyStep.ReviewStudy,
            component: <ReviewStudy study={study} />,
            text: 'Review Study',
            primaryAction: {
                text: 'Submit Study',
                action: () => {
                    setShowSubmitStudy(true)
                },
            },
        },
    ]

    return (
        <Box direction='column' justify='between'>
            <div className="py-2">
                <Box justify='between' gap='xxlarge'>
                    <Col sm={1}>
                        <span></span>
                    </Col>
                    <Col sm={9}>
                        <ResearcherProgressBar steps={steps} currentStep={steps[currentStep]} />
                    </Col>
                    <Col sm={1}>
                        {currentStep !== StudyStep.InternalDetails && <ExitStudyFormButton study={getValues() as EditingStudy} saveStudy={saveStudy} />}
                    </Col>
                </Box>
                {steps[currentStep].component}
            </div>
            <ActionFooter step={steps[currentStep]} />
            <SubmitStudyModal study={study as Study} show={showSubmitStudy} setShow={setShowSubmitStudy} />
        </Box>
    )
}
