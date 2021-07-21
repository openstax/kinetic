import { ENV } from '@lib'

export interface UserPayload {
    name: string
    user_id: string
    is_admin: boolean
    is_researcher: boolean
}

export class User {

    static async fetchCurrentUser() {
        const reply = await fetch(`${ENV.API_PATH}/whoami`, {
            credentials: 'include',
        })
        return new User(await reply.json())
    }

    id: string
    is_admin: boolean = false
    is_researcher: boolean = false
    name: string

    constructor(attrs: UserPayload) {
        this.id = attrs.user_id
        this.name = attrs.name
        this.is_admin = attrs.is_admin || false
        this.is_researcher = attrs.is_researcher || false
    }

    get isValid() {
        return Boolean(this.id)
    }

    async become(id: string) {
        const result = await fetch(`${ENV.API_ADDRESS}/development/users/${id}/log_in`, {
            method: 'PUT', credentials: 'include',
        })
        const payload = await result.json()
        if (result.ok) {
            this.id = payload.user_id
            Object.assign(this, payload)
        }
    }
}
