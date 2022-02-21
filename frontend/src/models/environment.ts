import { API_CONFIGURATION, ENV } from '@lib'
import { Environment as ApiEnv, EnvironmentApi } from '@api'
import dayjs from 'dayjs'
import { retry } from '../lib/util'
import { User } from './user'

export class Environment {

    static async bootstrap() {
        const api = new EnvironmentApi(API_CONFIGURATION)
        const envData = await retry(() => api.getEnvironment())
        return new Environment(envData)
    }

    config: ApiEnv

    user: User

    constructor(config: ApiEnv) {
        this.config = config
        this.user = User.bootstrap(config.user)
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
