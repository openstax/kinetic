import { ENV } from '@lib'

export interface EnviromentApiPayload {
    accounts_env_name?: 'string'
}

export class Environment {

    static async fetch() {
        const reply = await fetch(`${ENV.API_PATH}/environment`, {
            credentials: 'include',
        })
        return new Environment(await reply.json())
    }

    accounts_env_name: string

    constructor(payload: EnviromentApiPayload) {
        this.accounts_env_name = payload.accounts_env_name || 'dev'
    }

    get loginURL() {
        const url = this.accounts_url
        if (ENV.IS_DEV_MODE) return url

        return `${url}/accounts/i/login/?r=${encodeURIComponent(window.location.href)}`
    }

    get accounts_url() {
        if (ENV.IS_DEV_MODE) return '/dev/user'
        if (this.accounts_env_name == 'production') {
            return 'https://accounts.openstax.org'
        }
        return `https://accounts-${this.accounts_env_name}.openstax.org`
    }

}
