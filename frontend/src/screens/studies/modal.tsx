import { React, useEffect, useState } from '@common'
import { ParticipantStudy, Study } from '@api'
import { useStudyApi } from '@lib'
import { Modal, LoadingAnimation } from '@components'
import { isParticipantStudy } from '@models'


interface StudyModalProps {
    study?: Study | ParticipantStudy
    onHide?: () => void
}
export const StudyModal:React.FC<StudyModalProps> = ({ onHide, study }) => {
    const api = useStudyApi()
    const [studyUrl, setStudyUrl] = useState('')
    useEffect(() => {
        if (!study) return
        api.launchStudy({
            id: study.id,
            preview: !isParticipantStudy(study),
        }).then((launch) => setStudyUrl(launch.url!))
    }, [study?.id])
    if (!study) { return null }

    const title = isParticipantStudy(study) ? study.title : study.titleForParticipants

    return (
        <Modal large show={true} onHide={() => onHide?.()} closeBtn={!!onHide} title={title}>
            <Modal.Body>
                {!studyUrl && <LoadingAnimation />}
                {studyUrl && <iframe css={{ height: 525, width: '100%' }} src={studyUrl} />}
            </Modal.Body>
        </Modal>
    )
}
