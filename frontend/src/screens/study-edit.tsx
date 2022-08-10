import { React, useEffect, useParams, useNavigate, useState } from '@common'
import * as Yup from 'yup'
import { useField } from 'formik'
import { uniqBy, omit } from 'lodash-es'
import {
    LoadingAnimation, Alert, EditingForm as Form, Modal,
    InputField, SelectField, DateTimeField, Row, Col, Icon,
    LinkButton, Button, Box,
} from '@components'
import { StudyValidationSchema, TagLabels, isNewStudy, EditingStudy, isStudy } from '@models'
import { Study, Stage } from '@api'
import { useApi, errorToString, useForceUpdate, pick, remove } from '@lib'
import { StudyModal } from './studies/modal'


const TAG_OPTIONS = Object.keys(TagLabels).map((t) => ({
    label: t, value: t,
}))
const QualtricsFields = () => (
    <React.Fragment>
        <InputField name="survey_id" id="id" label="Survey ID" type="text" hint="part of the URL, string like “SV_6xGQzj4OBJnxGuy”" />
        <InputField name="secret_key" id="key" label="Secret Key" />
    </React.Fragment>
)

const AvailableStageFields = {
    qualtrics: {
        component: QualtricsFields,
        withoutConfig(fields: any): any {
            return omit(fields, 'survey_id', 'secret_key')
        },
        toConfig(fields: any): any {
            return { type: 'qualtrics', ...pick(fields, 'survey_id', 'secret_key') }
        },
    },
}

const LaunchStudyButton: React.FC<{ study: EditingStudy }> = ({ study }) => {
    const [showingModal, setShowing] = useState(false)
    if (!isStudy(study) || !study.stages?.length) {
        return null
    }

    return (
        <>
            {showingModal && <StudyModal onHide={() => setShowing(false)} study={study} />}
            <Button
                secondary data-test-id="preview-study-btn"
                onClick={() => setShowing(true)}
                icon="search"
            >
                Preview
            </Button>
        </>
    )
}


const DeleteStudyButton: React.FC<{ study: EditingStudy }> = ({ study }) => {
    const api = useApi()
    const nav = useNavigate()
    const [isPending, setPending] = useState(false)
    if (!isStudy(study) || study.firstLaunchedAt) {
        return null
    }
    const deleteStudy = async () => {
        setPending(true)
        await api.deleteStudy({ studyId: study.id })
        nav('/studies')
    }
    return (
        <Button
            secondary
            onClick={deleteStudy}
            icon="trash"
            data-test-id="delete-study-btn"
            busyMessage="Deleting"
            busy={isPending}
        >
            Delete
        </Button>

    )
}


type StageType = keyof typeof AvailableStageFields

const AddStageModalIcon: React.FC<{ study: Study, onCreate(): void }> = ({ study, onCreate }) => {
    const api = useApi()
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
            const reply = await api.addStage({
                studyId: study.id, addStage: {
                    stage: {
                        ...StageFields.withoutConfig(stage),
                        config: StageFields.toConfig(stage),
                    },
                },
            })
            helpers.resetForm()
            setShowingModal(false)
            study.stages?.push(reply)
            onCreate()
        }
        catch (err) {
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
                            title: Yup.string().required(),
                            survey_id: Yup.string().required(),
                            secret_key: Yup.string().required(),
                            availableAfterDays: Yup.number().required(),
                        })}
                        initialValues={{
                            type: stageType,
                            url: '',
                            secret_key: '',
                            availableAfterDays: 0,
                        }}
                    >
                        <Alert warning={true} onDismiss={() => setError('')} message={error}></Alert>
                        <InputField name="title" id="title" label="Title" />
                        <InputField name="description" id="description" label="Description" type="textarea" />
                        <InputField name="availableAfterDays" id="available_after"
                            type="number" label="Available After Days" hint="0 == immediately available" />
                        <SelectField
                            name="type" id="stage-type" label="Stage Type"
                            onChange={(opt) => setStageType(opt as StageType)}
                            options={[{ value: 'qualtrics', label: 'Qualtrics' }]}
                        />
                        <StageFields.component />
                    </Form>
                </Modal.Body>
            </Modal>

            <Icon height={15} icon="plusCircle" data-test-id="add-stage" onClick={addNewStage} />
        </React.Fragment>
    )
}

const StageRow: React.FC<{ stage: Stage, onDelete(s: Stage): void }> = ({ stage, onDelete }) => {
    return (
        <tr className="stage">
            <td>{stage.title}</td>
            <td>{stage.description}</td>
            <td>{stage.availableAfterDays}</td>
            <td>
                <Icon icon="trash" onClick={(ev) => {
                    ev.preventDefault()
                    onDelete(stage)
                }} />
            </td>
        </tr>
    )
}

const StudyLandingUrl: React.FC<{ study: Study }> = ({ study }) => {

    return <pre>{`${window.location.origin}/study/land/${study.id}`}</pre>
}

export const StudyStages: React.FC<{ study: EditingStudy, onUpdate(): void }> = ({ study, onUpdate }) => {
    const api = useApi()
    const [, meta] = useField({
        type: 'array',
        name: 'stages',
        value: isStudy(study) ? (study?.stages || []).map(s => String(s.id)) : [],
    })

    if (!isStudy(study)) { return null }

    const deleteStage = async (stage: Stage) => {
        await api.deleteStage({ id: stage.id })
        remove(stage, study.stages || [])
        onUpdate()
    }
    return (
        <React.Fragment>
            <Row><Col><p className="lead">This study's return url is:</p></Col></Row>
            <Row><Col><StudyLandingUrl study={study} /></Col></Row>

            <Row className="mb-2">
                <Col sm={11}><h5>Stages</h5></Col>
                <Col sm={1}>
                    <AddStageModalIcon onCreate={onUpdate} study={study} />
                </Col>
            </Row>
            <Row className="mb-2 stages-listing">
                {!study.stages?.length && (
                    <Col css={{ fontWeight: 'bold', color: meta.error ? 'red' : 'unset' }}>No stages have been defined</Col>
                )}
                <table className="table col-sm-12">
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Description</th>
                            <th>After Days</th>
                            <td></td>
                        </tr>
                    </thead>
                    <tbody>
                        {(study.stages || [])?.map(stage =>
                            <StageRow onDelete={deleteStage} key={stage.id} stage={stage} />)}
                    </tbody>
                </table>
            </Row>
        </React.Fragment>
    )
}


function EditStudy() {
    const nav = useNavigate()
    const api = useApi()

    const [error, setError] = useState('')
    const reRender = useForceUpdate()
    const [study, setStudy] = useState<EditingStudy | null>()
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
                participationPoints: '' as any,
                tags: [],
            })
            setTimeout(() => { document.querySelector<HTMLInputElement>('#participants-title')?.focus() }, 100)
            return
        }

        api.getStudies().then(studies => {
            const study = studies.data?.find(s => s.id == Number(id))
            if (study) {
                setStudy(study)
            }
            else {
                setError('study was not found')
            }
        })
    }, [id])

    if (!study) {
        return <LoadingAnimation message="Loading study" />
    }
    const onCancel = () => {
        nav('/studies')
    }
    const saveStudy = async (study: EditingStudy) => {
        try {
            if (isNew) {
                const savedStudy = await api.addStudy({ addStudy: { study: study as any } })
                setStudy(savedStudy)
                nav(`/study/edit/${savedStudy.id}`)
            } else {
                await api.updateStudy({ id: Number(id), updateStudy: { study: study as any } })
            }
        }
        catch (err) {
            setError(await errorToString(err))
        }
    }

    const editingValidationSchema = isNewStudy(study) ? StudyValidationSchema.clone() : StudyValidationSchema.concat(
        Yup.object().shape({
            stages: Yup.array().min(1).required(),
        })

    )

    const tag_options = uniqBy(TAG_OPTIONS.concat(
        study?.tags?.map(sto => ({ label: sto, value: sto }))
    ), 'value')
    return (
        <div className="container studies mt-8">

            <nav className="navbar fixed-top navbar-light py-1 bg-dark">
                <div className="container d-flex justify-content-between">
                    <LinkButton icon="back" data-test-id="back-to-studies" secondary to="/studies">
                        Studies
                    </LinkButton>
                    <Box gap>
                        <DeleteStudyButton study={study} />
                        <LaunchStudyButton study={study} />
                    </Box>
                </div>
            </nav>

            <Form
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
                <InputField name="participationPoints" id="points" label="Participation Points" type="number" />
                <InputField name="isMandatory" id="is-mandatory" label="Mandatory study" hint="(must be completed before any others)" type="checkbox" />
                <StudyStages study={study} onUpdate={reRender} />
                <SelectField
                    name="tags" id="tags" label="Tags"
                    allowCreate isMulti
                    options={tag_options}
                />

                <DateTimeField name="opensAt" id="opens-at" label="Opens At" md={6} />
                <DateTimeField name="closesAt" id="closes-at" label="Closes At" md={6} />
                <InputField name="shortDescription" id="short-desc" type="textarea" label="Short description" />
                <InputField name="longDescription" id="long-desc" type="textarea" label="Long description" />
            </Form>

        </div>
    )
}

export default EditStudy
