import { formatDate, React, useCallback, useEffect, useId, useState } from '@common'
import { Col, ColProps, EditingForm, FormSubmitHandler, Icon, InputField, Section, useFormContext } from '@components'
import { ResponseExport, Stage, Study } from '@api'
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

type SetResponses = (responses: ResponseExport[]) => void

const Boolean:FC<{val?: boolean}> = ({ val }) => {
    if (val) {
        return <Icon icon="checkCircle" />
    }
    return <Icon icon="emptyCircle"/>

}

type ResponsesProps = {
    responses: ResponseExport[]
    setResponses: SetResponses
}

const Responses:FC<ResponsesProps> = ({ responses, setResponses }) => {
    const api = useApi()
    const onDelete = (id: number) => {
        api.adminDestroyResponse({ id }).then(resp => setResponses(resp.data || []))
    }
    return (
        <table className="table table-striped table-hover">
            <thead>
                <tr>
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
    setResponses: SetResponses
}

type StageFormValues = Stage & {
    isTest: boolean
    newResponse?: FileList
}


const EditStage: FC<StageProps> = ({ stage, setResponses }) => {
    const api = useApi()

    const onSubmit: FormSubmitHandler<StageFormValues> = useCallback((v, fc) => {
        const file = v.newResponse?.item(0) || undefined
        api.adminAddResponses({
            stageId: v.id,
            file,
            isTesting: v.isTest,
        })
            .then(resp => setResponses(resp.data || []))
            .catch((err) => fc.setFormError(err))
    }, [api])

    return (
        <EditingForm
            className="row"
            name="responses"
            defaultValues={{ ...stage, isTest: true }}
            onSubmit={onSubmit}
        >
            <b>Add response file</b>
            <FileInput size={6} name="newResponse" className="mb-1" />
            <InputField size={6} name="isTest" label="Is Testing Data?" type="checkbox" />
        </EditingForm>

    )
}


export function EditStudy({ study }: EditProps) {
    const api = useApi()

    const [responses, setResponses] = useState<Array<ResponseExport>>([])

    useEffect(() => {
        api.adminResponsesForStudy({ id: study.id }).then((res) => {
            setResponses(res.data || [])
        })
    }, [])

    return (
        <div className="container">
            <h3>Data for {study.titleForResearchers}</h3>
            <Section heading="Responses" id="">
                <Responses responses={responses} setResponses={setResponses} />
                {study.stages?.map((stage,i ) => <EditStage index={i} key={stage.id} setResponses={setResponses}  stage={stage}  />)}
            </Section>
        </div>
    )
}
