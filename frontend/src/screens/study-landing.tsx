
import { useRouteMatch } from 'react-router-dom'
import { React } from '@common'
import { IncorrectUser } from '@components'
import { useCurrentUser, useStudyApi } from '@lib'
import { useEffect } from 'react'


export default function UsersStudies() {
    const { params: { studyId } } = useRouteMatch<{ studyId: string }>();
    const api = useStudyApi()
    const user = useCurrentUser()

    if (!user) {
        return <IncorrectUser />
    }

    useEffect(() => {
        api.landStudy({ id: Number(studyId) })
    }, [ studyId ])

    return (

        <div className="container studies mt-8">
            <h3>Thank you for completing the study</h3>
            <h5>your response has been recorded</h5>
            <a href="https://openstax.org/">Return to OpenStax</a>
        </div>
    )

}
