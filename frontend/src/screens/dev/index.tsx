import { React, useEffect, useState, useNavigate } from '@common'
import { capitalize } from '@lib'
import { useCurrentUser } from '@lib'
import { AvailableUsers } from './users'
import { ChevronDoubleLeft } from '@emotion-icons/bootstrap'
import { LinkButton } from '@components'

interface UserCardProps {
    users: AvailableUsers
    type: 'admins' | 'researchers' | 'users'
    becomeUser: (ev: React.MouseEvent<HTMLAnchorElement>) => void
}

const UserCard:React.FC<UserCardProps> = ({ users, type, becomeUser }) => {

    if (!users[type]?.length) return null
    return (
        <div className="col-6">
            <div className="card">
                <h5 className="card-header">{capitalize(type)}</h5>
                <div className="list-group list-group-flush">
                    {users[type].map(u => (
                        <a
                            key={u.id}
                            href='#'
                            data-user-id={u.id}
                            onClick={becomeUser}
                            className="list-group-item"
                        >
                            <b>{u.name}</b> ({u.id})
                        </a>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default function Dev() {
    const [users, setUsers] = useState<AvailableUsers>(new AvailableUsers())
    const currentUser = useCurrentUser()
    const nav = useNavigate()
    useEffect(() => {
        AvailableUsers.fetch().then(setUsers)
    }, [])

    const becomeUser = async (ev: React.MouseEvent<HTMLAnchorElement>) => {
        const userId = ev.currentTarget.dataset.userId
        ev.preventDefault()
        if (userId) {
            await currentUser.become(userId)
            nav('/')
        }
    }

    return (
        <div className="dev-console">
            <nav className="navbar fixed-top navbar-light py-1 bg-light">
                <div className="container">
                    <LinkButton secondary to="/">
                        Home
                    </LinkButton>
                </div>
            </nav>
            <div className="container mt-8">

                {currentUser?.isValid && <h3>Logged in as: {currentUser.id}</h3>}
                <div className="row">
                    <UserCard users={users} type="admins" becomeUser={becomeUser} />
                    <UserCard users={users} type="researchers" becomeUser={becomeUser} />
                    <UserCard users={users} type="users" becomeUser={becomeUser} />
                </div>
            </div>
        </div>
    )
}
