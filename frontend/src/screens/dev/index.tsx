import { useEffect, useState } from 'react'
import { React } from '../../common'
import { User, AvailableUsers } from './users'
import { ChevronDoubleLeft } from '@emotion-icons/bootstrap'
import { LinkButton } from '../../components/primitives'

export default function Dev() {
    const [users, setUsers] = useState<AvailableUsers>(new AvailableUsers())
    const [currentUser, setCurrentUser] = useState<User|null>(null)

    useEffect(() => {
        User.fetchCurrentUser().then((u) => {
            if (u.isValid) { setCurrentUser(u) }
        })
        AvailableUsers.fetch().then(setUsers)
    }, [])

    const becomeUser = async (ev: React.MouseEvent<HTMLAnchorElement>) => {
        const userId = ev.currentTarget.dataset.userId
        if (userId) {
            const user = await AvailableUsers.become(userId)
            setCurrentUser(user)
        }
    }

    return (
        <div className="dev-console">
            <nav className="navbar fixed-top navbar-light py-1 bg-light">
                <div className="container-fluid">
                    <LinkButton secondary to="/">
                        <ChevronDoubleLeft height="16" />
                        Home
                    </LinkButton>
                </div>
            </nav>
            <div className="container mt-8">

                {currentUser?.isValid && <h3>Logged in as: {currentUser.id}</h3>}
                <div className="row">
                    <div className="col-8">
                        <div className="card">
                            <h5 className="card-header">Admins</h5>
                            <ul className="list-group list-group-flush">
                                {users.admins.map(u => (
                                    <a
                                        key={u.id}
                                        href='#'
                                        data-user-id={u.id}
                                        onClick={becomeUser}
                                        className="list-group-item"
                                    >
                                        {u.id}
                                    </a>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
