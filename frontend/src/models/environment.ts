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

    get accounts_url() {
        if (ENV.IS_DEV_MODE) return '/dev/user'
        if (this.accounts_env_name == 'production') {
            return 'https://accounts.openstax.org'
        }
        // TODO: add return to param once:
        // 1) we figure out what it is https://openstax.slack.com/archives/C6NRD0CCQ/p1626814810461300
        // 2) accounts is configured to allow labs as a valid return
        return `https://accounts-${this.accounts_env_name}.openstax.org`
    }

}
