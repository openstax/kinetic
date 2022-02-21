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
        window._MODELS.user = new User()
        const user = new User()
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
            Object.assign(this, attrs)
        }
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
        this.isAdmin = this.isResearcher = false
    }
}

export const ANON_USER = new User()
