import { React, styled, useEffect, useState } from '@common'
import { Study } from '@api'
import { useApi, useParamId } from '@lib'
import { Main, Sidebar } from './grid'
import { EditStudy } from './workspaces/edit-study'
import { NavLink } from 'react-router-dom'

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
            <Sidebar className="list-group nav flex-column">
                <h3 className="ms-2 py-2">Studies</h3>
                <hr />
                <ul className="list-group nav flex-column flex-nowrap">
                    {studies.map(s => (
                        <li key={s.id} className="nav-item">
                            <Nav
                                to={`/admin/workspaces/${s.id}`}
                                className="nav-link"
                            >
                                {s.titleForResearchers}
                            </Nav>
                        </li>
                    ))}
                </ul>
            </Sidebar>
            <Main style={{ marginTop: '2rem' }}>
                {study ? <EditStudy study={study} /> : <WelcomeMsg />}
            </Main>
        </>
    )
}
