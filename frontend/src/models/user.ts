import { ENV } from '@lib'
import { EnvironmentUser } from '@api'
import { analytics } from '../lib/analytics'


export interface UserPayload {
    user_id: string
    is_admin: boolean
    is_researcher: boolean
}

export class User {

    static bootstrap(env: EnvironmentUser) {
        window._MODELS = window._MODELS || {}
        const user = window._MODELS.user || (window._MODELS.user = new User())
        user.id = env.userId
        user.isAdmin = env.isAdministrator || false
        user.isResearcher = env.isResearcher || false
        if (user.id) {
            analytics.identify(user.id)
        }
        return user
    }

    id?: string = ''
    isAdmin: boolean = false
    isResearcher: boolean = false
    name: string = ''

    constructor(attrs?:any) {
        if (attrs) {
            this.update(attrs)
        }
    }

    update(attrs: any) {
        Object.assign(this, attrs)
        if (attrs.user_id != null) this.id = attrs.user_id
        if (attrs.is_researcher != null) this.isResearcher = attrs.is_researcher
        if (attrs.is_admin != null) this.isAdmin = attrs.is_admin
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
            this.update(payload)
        }
    }

    async logout() {
        await fetch(`${ENV.API_ADDRESS}/development/users/log_out`, {
            method: 'DELETE', credentials: 'include',
        })
        this.id = ''
        this.isAdmin = this.isResearcher = false
    }
}

export const ANON_USER = new User()
window._MODELS = window._MODELS || {}
window._MODELS.user = ANON_USER
