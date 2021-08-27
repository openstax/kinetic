import { React, useEffect, useParams, useHistory, useState } from '@common'
import * as Yup from 'yup'
import { useField } from 'formik'
import {
    LoadingAnimation, Alert, EditingForm as Form, Modal,
    InputField, SelectField, DateField, Row, Col, Icon,
    LinkButton, Button,
} from '@components'
import { StudyValidationSchema, LaunchStudy } from '@models'
import { NewStudy, Study, Stage, StudyUpdate, NewStudyCategoryEnum } from '@api'
import { useStudyApi, errorToString, useForceUpdate, pick, remove, isNil } from '@lib'

type EditingStudy = NewStudy | Study

function isNewStudy(study: EditingStudy): study is NewStudy {
    return isNil((study as Study).id)
}

const QualtricsFields = () => (
    <React.Fragment>
        <InputField name="url" id="url" label="URL" type="url" />
        <InputField name="secret_key" id="key" label="Secret Key"  />
    </React.Fragment>
)

const AvailableStageFields = {
    qualtrics: {
        component: QualtricsFields,
        toConfig(fields: any): any {
            return { type: 'qualtrics', ...pick(fields, 'url', 'secret_key') }
        },
    },
}

const LaunchStudyButton: React.FC<{ study: EditingStudy }> = ({ study }) => {
    const api = useStudyApi()
    if (isNewStudy(study) || !study.stages?.length) {
        return null
    }
    return (
        <Button secondary onClick={() => LaunchStudy(api, study)}>
            Test Launch
        </Button>
    )
}


type StageType = keyof typeof AvailableStageFields

const AddStageModalIcon: React.FC<{ study: Study, onCreate():void }> = ({ study, onCreate }) => {
    const api = useStudyApi()
    const [isShowingModal, setShowingModal] = useState(false)
    const [stageType, setStageType] = useState<StageType>('qualtrics')
    const [error, setError] = useState('')
    const addNewStage = (ev: React.MouseEvent<HTMLButtonElement>) => {
        ev.preventDefault() // needed to prevent formik from submitting
        setShowingModal(true)
    }
    const onHide = () => setShowingModal(false)
    const StageFields = AvailableStageFields[stageType]

    const saveStage = async (stage: any, helpers: any) => {
        setError('')
        try {
            const reply = await api.addStage({ id: study.id, stage: {
                config: StageFields.toConfig(stage),
            } })
            helpers.resetForm()
            setShowingModal(false)
            study.stages?.push(reply)
            onCreate()
        }
        catch(err) {
            setError(await errorToString(err))
        }
    }

    return (
        <React.Fragment>
            <Modal
                onHide={onHide}
                show={isShowingModal}
                title="Add stage to study"
                data-test-id="add-stage-modal"
            >
                <Modal.Body>
                    <Form
                        onSubmit={saveStage}
                        showControls
                        onCancel={onHide}
                        validationSchema={Yup.object().shape({
                            url: Yup.string().url().required(),
                            secret_key: Yup.string().required(),
                        })}
                        initialValues={{
                            type: stageType,
                            url: '',
                            secret_key: '',
                        }}
                    >
                        <Alert warning={true} onDismiss={() => setError('')} message={error}></Alert>
                        <SelectField
                            name="type" id="stage-type" label="Stage Type"
                            onChange={(opt) => setStageType(opt as StageType)}
                            options={[ { value: 'qualtrics', label: 'Qualtrics' } ]}
                        />
                        <StageFields.component />
                    </Form>
                </Modal.Body>
            </Modal>

            <Icon height="1.5rem" icon="plusCircle" data-test-id="add-stage" onClick={addNewStage} />
        </React.Fragment>
    )
}

const StageRow:React.FC<{stage: Stage, onDelete(s: Stage): void}> = ({ stage, onDelete }) => {
    return (
        <Row className="my-2 stage">
            <Col sm={1}>{stage.order}</Col>
            <Col sm={2}>{(stage.config as any)?.type }</Col>
            <Col sm={8}
                css={{ overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100%' }}
            >{JSON.stringify(stage.config)}</Col>
            <Col sm={1}><Icon icon="trash" onClick={(ev) => {
                ev.preventDefault()
                onDelete(stage)
            }} />
            </Col>
        </Row>
    )
}

export const StudyStages: React.FC<{ study: EditingStudy, onUpdate(): void }> = ({ study, onUpdate }) => {
    const api = useStudyApi()
    const [, meta] = useField({
        type: 'array',
        name: 'stages',
        value: !isNewStudy(study) ? (study?.stages || []).map(s => String(s.id)) : [],
    })

    if (isNewStudy(study)) { return null }

    const deleteStage = async (stage: Stage) => {
        await api.deleteStage({ id: stage.id })
        remove(stage, study.stages || [])
        onUpdate()
    }
    return (
        <React.Fragment>
            <Row className="mb-2">
                <Col sm={11}><h5>Stages</h5></Col>
                <Col sm={1}>
                    <AddStageModalIcon onCreate={onUpdate} study={study} />
                </Col>
            </Row>
            <Row className="mb-2 stages-listing">
                {!study.stages?.length && (
                    <Col css={{ fontWeight: 'bold', color: meta.error ? 'red': 'unset' }}>No stages have been defined</Col>
                )}
                {(study.stages || [])?.map(stage => <StageRow onDelete={deleteStage} key={stage.id} stage={stage} />)}
            </Row>
        </React.Fragment>
    )
}


export function EditStudy() {
    const history = useHistory()
    const api = useStudyApi()
    const [error, setError] = useState('')
    const reRender = useForceUpdate()
    const [ study, setStudy ] = useState<EditingStudy|null>()
    const id = useParams<{ id: string }>().id
    const isNew = 'new' === id
    useEffect(() => {
        if (isNew) {
            setStudy({
                titleForParticipants: '',
                isMandatory: false,
                shortDescription: '',
                longDescription: '',
                durationMinutes: '' as any,
                category: NewStudyCategoryEnum.ResearchStudy as any,
            })
            setTimeout(() => { document.querySelector<HTMLInputElement>('#participants-title')?.focus() }, 100)
            return
        }
        api.getStudies().then(studies => {
            const study = studies.data?.find(s => s.id == Number(id))
            if (study) {
                setStudy(study) }
            else {
                setError('study was not found')
            }
        })
    }, [id])

    if (!study) {
        return <LoadingAnimation message="Loading study" />
    }
    const onCancel = () => {
        history.push('/studies')
    }
    const saveStudy = async (study: EditingStudy) => {
        try {
            if (isNew) {
                const savedStudy = await api.addStudy({ study: study as any as NewStudy })
                setStudy(savedStudy)
                history.push(`/studies/${savedStudy.id}`)
            } else {
                await api.updateStudy({ id: Number(id), study: study as any as StudyUpdate })
                onCancel()
            }
        }
        catch(err) {
            setError(await errorToString(err))
        }
    }

    const editingValidationSchema = isNewStudy(study) ? StudyValidationSchema.clone() : StudyValidationSchema.concat(
        Yup.object().shape({
            stages: Yup.array().min(1).required(),
        })
    )


    return (
        <div className="container studies mt-8">

            <nav className="navbar fixed-top navbar-light py-1 bg-dark">
                <div className="container-fluid d-flex justify-content-between">
                    <LinkButton icon="back" secondary to="/studies">
                        Studies
                    </LinkButton>
                    <LaunchStudyButton study={study} />
                </div>
            </nav>

            <Form<EditingStudy>
                onSubmit={saveStudy}
                showControls
                onCancel={onCancel}
                initialValues={study}
                validationSchema={editingValidationSchema}
            >
                <Alert warning={true} onDismiss={() => setError('')} message={error}>on</Alert>
                <InputField name="titleForParticipants" id="participants-title" label="Title for participants" />
                <InputField name="titleForResearchers" id="researchers-title" label="Title for researchers" />
                <InputField name="durationMinutes" id="duration-mins" label="Duration Minutes" type="number" />
                <InputField name="isMandatory" id="is-mandatory" label="Mandatory study" hint="(must be completed before any others)" type="checkbox" />
                <StudyStages study={study} onUpdate={reRender} />
                <SelectField
                    name="category" id="category" label="Category"
                    options={[
                        { label: 'Research Study', value: 'research_study' },
                        { label: 'Cognitive Task', value: 'cognitive_task' },
                        { label: 'Survey', value: 'survey' },
                    ]}
                />
                <DateField name="opensAt" id="opens-at" label="Opens At" />
                <DateField name="closesAt" id="closes-at" label="Closes At" />
                <InputField name="shortDescription" id="short-desc" type="textarea" label="Short description"/>
                <InputField name="longDescription" id="long-desc" type="textarea" label="Long description"/>
            </Form>

        </div>
    )
}
