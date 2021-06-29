import { ENV } from '../../lib/env'
import { modelize, field, hydrateModel } from '../../common'
import { computed } from 'mobx'

export class User {

    static async fetchCurrentUser() {
        const reply = await fetch(`${ENV.API_URL}/development/users/whoami`, {
            credentials: 'include',
        })
        return hydrateModel(User, await reply.json())
    }

    @field id?: string

    constructor({ user_id }: { user_id?: string } = {}) {
        this.id = user_id
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

    static async become(user_id: string) {
        await fetch(`${ENV.API_URL}/development/users/${user_id}/log_in`, {
            method: 'PUT', credentials: 'include',
        })
        return new User({ user_id })
    }

    admins: User[]

    constructor({ admins }: { admins: string[] } = { admins: [] }) {
        this.admins = admins.map(uid => new User({ user_id: uid }))
    }

}
