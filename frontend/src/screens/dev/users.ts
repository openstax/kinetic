import { ENV } from '../../lib'
import { User, UserPayload } from '@models'

interface UsersPayload {
    admins: UserPayload[]
    researchers?: UserPayload[]
    users: UserPayload[]
}


export class AvailableUsers {

    static async fetch() {
        await fetch(`${ENV.API_ADDRESS}/development/users/ensure_users_exist`, { method: 'PUT', credentials: 'include' })
        const reply = await fetch(`${ENV.API_ADDRESS}/development/users`)
        if (reply.ok) {
            return new AvailableUsers(await reply.json())
        }
        return new AvailableUsers()
    }

    admins: User[] = []
    users: User[] = []
    researchers: User[] = []

    constructor({ admins, users, researchers }: UsersPayload = { admins: [], users: [], researchers: [] }) {
        this.admins = admins.map(u => new User({ ...u, isAdmin: true }))
        this.users = users.map(u => new User({ ...u }))
        if (researchers) {
            this.researchers = researchers.map(u => new User({ ...u, isResearcher: true }))
        }
    }
}
