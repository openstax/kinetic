import { ENV } from '@lib'

export interface UserPayload {
    name: string
    user_id: string
    is_admin: boolean
    is_researcher: boolean
}

export class User {

    static async fetchCurrentUser() {
        window._MODELS = window._MODELS || {}
        window._MODELS.user = new User()
        const reply = await fetch(`${ENV.API_PATH}/whoami`, {
            credentials: 'include',
        })
        return window._MODELS.user.update(await reply.json())
    }

    id: string = ''
    is_admin: boolean = false
    is_researcher: boolean = false
    name: string = ''

    constructor(attrs?:UserPayload) {
        if (attrs) {
            this.update(attrs)
        }
    }

    update(attrs: UserPayload) {
        this.id = attrs.user_id
        this.name = attrs.name
        this.is_admin = attrs.is_admin || false
        this.is_researcher = attrs.is_researcher || false
        return this
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

    async logout() {
        await fetch(`${ENV.API_ADDRESS}/development/users/log_out`, {
            method: 'DELETE', credentials: 'include',
        })
        this.id = ''
        this.is_admin = this.is_researcher = false
    }
}
