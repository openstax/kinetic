import { useState, useEffect } from 'react'
import { ENV } from '@lib'

export interface EnviromentApiPayload {
    accounts_env_name?: 'string'
    homepage_url: string
}

export class Environment {

    static async fetch() {
        const reply = await fetch(`${ENV.API_PATH}/environment`, {
            credentials: 'include',
        })
        return new Environment(await reply.json())
    }

    accounts_env_name: string
    homepage_url: string

    constructor(payload: EnviromentApiPayload) {
        this.accounts_env_name = payload.accounts_env_name || 'dev'
        this.homepage_url = payload.homepage_url
    }

    get loginURL() {
        const url = this.accounts_url
        if (ENV.IS_DEV_MODE) return url

        return `${url}/accounts/i/login/?r=${encodeURIComponent(window.location.href)}`
    }

    get accounts_url() {
        if (ENV.IS_DEV_MODE) return '/dev/user'
        if (this.accounts_env_name == 'production') {
            return 'https://openstax.org'
        }
        return `https://${this.accounts_env_name}.openstax.org`
    }

}

export const useEnv = () => {
    const [env, setEnv] = useState<Environment>()
    useEffect(() => {
        Environment.fetch().then(e => setEnv(e))
    }, [])
    return env
}
