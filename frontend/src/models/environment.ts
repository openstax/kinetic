import { API_CONFIGURATION, ENV } from '@lib'
import { Environment as ApiEnv, DefaultApi } from '@api'
import dayjs from 'dayjs'
import { retry } from '../lib/util'
import { User } from './user'

export interface UserInfo {
    id: string
    full_name: string
    contact_infos: Array<{ type: string, value: string }>
}

export class Environment {

    static async bootstrap() {
        const api = new DefaultApi(API_CONFIGURATION)
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

        return `${url}/i/login/?r=${encodeURIComponent(window.location.href)}`
    }

    get accounts_url() {
        if (ENV.IS_DEV_MODE) return '/dev/user'
        if (this.config.accountsEnvName == 'production') {
            return 'https://openstax.org/accounts'
        }
        return `https://${this.config.accountsEnvName}.openstax.org/accounts`
    }

    get accounts_api_url() {
        if (ENV.IS_DEV_MODE) return `${ENV.API_ADDRESS}/development/user/api/user`
        return `${this.accounts_url}/api/user`
    }

    get currentRewardSegment() {
        const now = dayjs()
        return this.config.rewardsSchedule.find(s => (
            dayjs(s.startAt).isBefore(now) && dayjs(s.endAt).isAfter(now)
        ))
    }

    async fetchUserInfo(): Promise<UserInfo> {
        const resp = await fetch(`${this.accounts_api_url}`, { credentials: 'include' })
        return resp.json()
    }

}
