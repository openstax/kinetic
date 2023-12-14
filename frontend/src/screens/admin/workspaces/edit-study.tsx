import { formatDate, React, useCallback, useEffect, useId, useState } from '@common'
import { Col, ColProps, EditingForm, FormSubmitHandler, Icon, InputField, Section, useFormContext } from '@components'
import { AdminStudyFilesListing, AnalysisInfo, ResponseExport, Stage, Study } from '@api'
import { useApi } from '@lib'


type EditProps = {
    study: Study
}

type FileInputProps = ColProps & {
    name: string, id?: string,
    label?: string
}

const FileInput:FC<FileInputProps> = ({ id: providedId, name, label, ...props }) => {
    const autoId = useId()
    const id = providedId || autoId
    const { register } = useFormContext()

    return (
        <Col {...props}>
            {label && <label htmlFor={id} className="form-label">{label}</label>}
            <input className="form-control" type="file" id={id} {...register(name)} css={{ lineHeight: '40px' }} />
        </Col>

    )
}

type SetFiles = (files: AdminStudyFilesListing) => void

const Boolean:FC<{val?: boolean}> = ({ val }) => {
    if (val) {
        return <Icon icon="checkCircle" />
    }
    return <Icon icon="circle"/>

}

type InfosProps = {
    infos: AnalysisInfo[]
    setFiles: SetFiles
    stages: Stage[]
}

const Infos:FC<InfosProps> = ({ infos, setFiles, stages }) => {
    const api = useApi()
    const onDelete = (id: number) => {
        api.adminDestroyInfo({ id }).then(resp => setFiles(resp))
    }

    if (!infos.length) return null

    return (
        <table className="table table-striped table-hover">
            <thead>
                <tr>
                    <th scope="col">Stage #</th>
                    <th scope="col">Uploaded</th>
                    <th scope="col">Download</th>
                    <th scope="col"></th>
                </tr>
            </thead>
            <tbody>
                {infos.map(info => (
                    <tr key={info.id}>
                        <th>{(stages.find(s => s.id == info.stageId)?.order || 0)+ 1}</th>
                        <th scope="row">{formatDate(info.createdAt)}</th>
                        <td>
                            <a href={info.url} target="_blank"><Icon icon="cloudDownload" /></a>
                        </td>
                        <td><Icon icon="trash" onClick={() => onDelete(info.id)} /></td>
                    </tr>))}
            </tbody>
        </table>
    )
}

type ResponsesProps = {
    responses: ResponseExport[]
    setFiles: SetFiles
    stages: Stage[]
}

const Responses:FC<ResponsesProps> = ({ responses, stages, setFiles }) => {
    const api = useApi()
    const onDelete = (id: number) => {
        api.adminDestroyResponse({ id }).then(resp => setFiles(resp))
    }

    if (!responses.length) return null

    return (
        <table className="table table-striped table-hover">
            <thead>
                <tr>
                    <th scope="col">Stage #</th>
                    <th scope="col">Date</th>
                    <th scope="col">Complete?</th>
                    <th scope="col">Testing?</th>
                    <th scope="col">Download</th>
                    <th scope="col"></th>
                </tr>
            </thead>
            <tbody>
                {responses.map(r => (
                    <tr key={r.id}>
                        <th>{(stages.find(s => s.id == r.stageId)?.order || 0)+ 1}</th>
                        <th scope="row">{formatDate(r.cutoffAt)}</th>
                        <td><Boolean val={r.isComplete} /></td>
                        <td><Boolean val={r.isTesting} /></td>
                        <td>
                            {r.urls.map(u => <a key={u} href={u} target="_blank"><Icon icon="cloudDownload" /></a>)}
                        </td>
                        <td><Icon icon="trash" onClick={() => onDelete(r.id)} /></td>
                    </tr>))}
            </tbody>
        </table>
    )
}

type StageProps = {
    index: number
    stage: Stage
    setFiles: SetFiles
}

type StageFormValues = Stage & {
    isTest: boolean
    newResponse?: FileList
}


const EditStageResponses: FC<StageProps> = ({ stage, setFiles }) => {
    const api = useApi()

    const onSubmit: FormSubmitHandler<StageFormValues> = useCallback((v, fc) => {
        const file = v.newResponse?.item(0) || undefined
        api.adminAddResponses({
            stageId: v.id,
            file,
            isTesting: v.isTest,
        })
            .then(resp => setFiles(resp))
            .catch((err) => fc.setFormError(err))
    }, [api])

    return (
        <EditingForm
            className="row"
            name="responses"
            defaultValues={{ ...stage, isTest: true }}
            onSubmit={onSubmit}
        >
            <b>Add response file for stage #{(stage.order||0) + 1}</b>
            <FileInput size={6} name="newResponse" className="mb-1" />
            <InputField size={6} name="isTest" label="Is Testing Data?" type="checkbox" />
        </EditingForm>

    )
}

const EditStageInfo: FC<StageProps> = ({ stage, setFiles }) => {
    const api = useApi()

    const onSubmit: FormSubmitHandler<StageFormValues> = useCallback((v, fc) => {
        const file = v.newResponse?.item(0) || undefined
        api.adminAddInfo({
            stageId: v.id,
            file,
        })
            .then((resp) => {
                setFiles(resp)
                fc.reset()
            })
            .catch((err) => fc.setFormError(err))
    }, [api])

    return (
        <EditingForm
            className="row"
            name="info"
            defaultValues={{ ...stage, isTest: true }}
            onSubmit={onSubmit}
        >
            <b>Add help file for stage #{(stage.order||0) + 1}</b>
            <FileInput size={6} name="newResponse" className="mb-1" />
        </EditingForm>

    )
}


export function EditStudy({ study }: EditProps) {
    const api = useApi()

    const [files, setFiles] = useState<AdminStudyFilesListing>({ infos: [], responses: [] })

    useEffect(() => {
        api.adminFilesForStudy({ id: study.id }).then((res) => {
            console.log(res)
            setFiles(res)
        })
    }, [])

    return (
        <div className="container">
            <h3>Data for {study.titleForResearchers}</h3>
            <Section heading="Responses" id="resp">
                <Responses responses={files.responses} setFiles={setFiles} stages={study?.stages || []} />
                {study.stages?.map((stage,i ) => <EditStageResponses index={i} key={stage.id} setFiles={setFiles} stage={stage}  />)}
            </Section>
            <Section heading="Info Files" id="help">
                <Infos infos={files.infos} setFiles={setFiles} stages={study?.stages || []} />
                {study.stages?.map((stage,i ) => <EditStageInfo index={i} key={stage.id} setFiles={setFiles} stage={stage}  />)}
            </Section>
        </div>
    )
}
