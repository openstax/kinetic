import { React, useEffect } from '@common'
import { ParticipantStudy, Study } from '@api'
import { isNil } from '@lib'


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

    return <iframe id="study" css={{ minHeight: 'calc(100vh - 130px)', width: '100%', overflow: 'scroll' }} src={url} />
}
