import { useState, useEffect } from 'react'
import { API_CONFIGURATION, ENV } from '@lib'
import { Environment as ApiEnv, MiscApi } from '@api'
import dayjs from 'dayjs'

export class Environment {

    static async fetch() {
        const api = new MiscApi(API_CONFIGURATION)
        const env = await api.getEnvironment()
        return new Environment(env)
    }

    config: ApiEnv

    constructor(config: ApiEnv) {
        this.config = config
    }

    get loginURL() {
        const url = this.accounts_url
        if (ENV.IS_DEV_MODE) return url

        return `${url}/accounts/i/login/?r=${encodeURIComponent(window.location.href)}`
    }

    get accounts_url() {
        if (ENV.IS_DEV_MODE) return '/dev/user'
        if (this.config.accountsEnvName == 'production') {
            return 'https://openstax.org'
        }
        return `https://${this.config.accountsEnvName}.openstax.org`
    }

    get currentRewardSegment() {
        const now = dayjs()
        return this.config.rewardsSchedule.find(s => (
            dayjs(s.startAt).isBefore(now) && dayjs(s.endAt).isAfter(now)
        ))
    }
}

export const useEnv = () => {
    const [env, setEnv] = useState<Environment>()
    useEffect(() => {
        Environment.fetch().then(e => setEnv(e))
    }, [])
    return env
}
