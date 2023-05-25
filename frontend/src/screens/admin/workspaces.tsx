import { React, useEffect, useState, styled } from '@common'
import { Study } from '@api'
import { useApi, useParamId } from '@lib'
import { Main, Sidebar } from './grid'
import { EditStudy } from './workspaces/edit-study'
import { NavLink, useParams } from 'react-router-dom'

const Nav = styled(NavLink)({
    display: 'flex',
    align: 'center',
    '&.active': {
        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)',
        border: '1px solid darkGray',
    },
})

const WelcomeMsg = () => (
    <>
        <h1>Welcome</h1>
        <p>Click a study on the left to edit it's settings</p>
    </>
)

export function AdminWorkspaces() {
    const api = useApi()
    const [studies, setStudies] = useState<Array<Study>>([])

    useEffect(() => {
        api.adminQueryStudies({ status: 'all' }).then((res) => {
            setStudies(res.data || [])
        })
    }, [])

    const studyId = useParamId('studyId', false)

    const study = studies.find(s => s.id == studyId)

    return (
        <>
            <Sidebar as="ul" className="list-group nav flex-column pt-5">
                {studies.map(s=>(
                    <li key={s.id} className="nav-item">
                        <Nav
                            to={`/admin/workspaces/${s.id}`}
                            className="nav-link"
                        >
                            {s.titleForResearchers}
                        </Nav>
                    </li>
                ))}
            </Sidebar>
            <Main centered>
                {study ? <EditStudy study={study} /> : <WelcomeMsg />}
            </Main>
        </>
    )
}
