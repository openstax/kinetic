import { React, useEffect, useState } from '@common'
import { ParticipantStudy, Study } from '@api'
import { useApi, isNil } from '@lib'
import { Modal, LoadingAnimation } from '@components'
import { isParticipantStudy } from '@models'


interface StudyModalProps {
    study?: Study | ParticipantStudy
    onHide: () => void
}

const Iframe:React.FC<{ url?: string, onClose: StudyModalProps['onHide'] }> = ({ url, onClose }) => {
    useEffect(() => {
        if (isNil(url)) return

        const handler = (event: MessageEvent) => {
            try {
                const data = JSON.parse(event.data)
                if (data.closeStudyModal) {
                    onClose()
                }
            } catch (e) { }
        }
        window.addEventListener('message', handler)
        return () => window.removeEventListener('message', handler)
    }, [url])

    if (isNil(url)) return null

    return <iframe id="study" css={{ height: '100%', width: '100%', overflow: 'scroll' }} src={url} />
}

export const StudyModal:React.FC<StudyModalProps> = ({ onHide, study }) => {
    const api = useApi()
    const [studyUrl, setStudyUrl] = useState('')
    const isPreview = !isParticipantStudy(study)
    useEffect(() => {
        if (!study) return

        api.launchStudy({
            id: study.id,
            preview: isPreview,
        }).then((launch) => {
            setStudyUrl(launch.url!)
        })
    }, [study?.id])
    if (!study) { return null }

    const title = isParticipantStudy(study) ? study.title : study.titleForParticipants

    return (
        <Modal
            xlarge
            show={true}
            onHide={isPreview ? () => onHide?.() : undefined}
            closeBtn={isPreview}
            title={title}
            data-is-study-preview-modal={isPreview}
        >
            <Modal.Body css={{ padding: 0, minHeight: 'calc(100vh - 130px)' }}>
                {isNil(studyUrl) && <LoadingAnimation />}
                <Iframe url={studyUrl} onClose={onHide} />
            </Modal.Body>
        </Modal>
    )
}
