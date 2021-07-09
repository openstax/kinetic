import { ENV } from '../../lib/env'
import { modelize, field, hydrateModel } from '../../common'
import { computed } from 'mobx'

interface UserPayload {
    name: string
    user_id: string
    role?: string
}

interface UsersPayload {
    admins: UserPayload[]
    researchers?: UserPayload[]
}


export class User {

    static async fetchCurrentUser() {
        const reply = await fetch(`${ENV.API_URL}/development/users/whoami`, {
            credentials: 'include',
        })
        return hydrateModel(User, await reply.json())
    }

    @field id: string
    @field role: string
    @field name: string

    constructor({ user_id, name, role }: UserPayload) {
        this.id = user_id
        this.name = name
        this.role = role || 'unknown'
        modelize(this)
    }

    @computed get isValid() {
        return Boolean(this.id)
    }

}


export class AvailableUsers {

    static async fetch() {
        await fetch(`${ENV.API_URL}/development/users/ensure_an_admin_exists`, { method: 'PUT', credentials: 'include' })
        const reply = await fetch(`${ENV.API_URL}/development/users`)
        if (reply.ok) {
            return new AvailableUsers(await reply.json())
        }
        return new AvailableUsers()
    }

    static async become(user_id: string, name: string) {
        await fetch(`${ENV.API_URL}/development/users/${user_id}/log_in`, {
            method: 'PUT', credentials: 'include',
        })
        return new User({ user_id, name })
    }

    admins: User[] = []
    researchers: User[] = []

    constructor({ admins, researchers }: UsersPayload = { admins: [], researchers: [] }) {
        this.admins = admins.map(u => new User({ ...u, role: 'admin' }))
        if (researchers) {
            this.researchers = researchers.map(u => new User({ ...u, role: 'researcher' }))
        }
    }

}
