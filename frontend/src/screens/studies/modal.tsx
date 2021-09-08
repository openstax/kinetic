import { React, useEffect, useState } from '@common'
import { ParticipantStudy, Study } from '@api'
import { useStudyApi } from '@lib'
import { Modal, LoadingAnimation } from '@components'
import { isParticipantStudy } from '@models'


interface StudyModalProps {
    study?: Study | ParticipantStudy
    onHide: () => void
}

const Iframe:React.FC<{ url?: string, onClose: StudyModalProps['onHide'] }> = ({ url, onClose }) => {
    useEffect(() => {
        if (!url) return

        const handler = (event: MessageEvent) => {
            try {
                const data = JSON.parse(event.data)
                if (data.closeStudyModal) {
                    onClose()
                }
            } catch (e) { }
        }

        window.addEventListener('message', handler)

        // clean up
        return () => window.removeEventListener('message', handler)
    }, [url]) // empty array => run only once

    if (!url) return null

    return <iframe id="study" css={{ height: 525, width: '100%' }} src={url} />
}

export const StudyModal:React.FC<StudyModalProps> = ({ onHide, study }) => {
    const api = useStudyApi()
    const [studyUrl, setStudyUrl] = useState('')
    const isPreview = !isParticipantStudy(study)
    useEffect(() => {
        if (!study) return

        api.launchStudy({
            id: study.id,
            preview: isPreview,
        }).then((launch) => setStudyUrl(launch.url!))
    }, [study?.id])
    if (!study) { return null }

    const title = isParticipantStudy(study) ? study.title : study.titleForParticipants

    return (
        <Modal
            large show={true}
            onHide={() => onHide?.()}
            closeBtn={!!onHide}
            title={title}
            data-is-study-preview-modal={isPreview}
        >
            <Modal.Body>
                {!studyUrl && <LoadingAnimation />}
                <Iframe url={studyUrl} onClose={onHide} />
            </Modal.Body>
        </Modal>
    )
}
