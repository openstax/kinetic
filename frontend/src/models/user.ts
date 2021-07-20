import { ENV } from '@lib'
import { useEffect, useState } from '@common'

export interface UserPayload {
    name: string
    user_id: string
    role?: string
}

export class User {

    static async fetchCurrentUser() {
        const reply = await fetch(`${ENV.API_PATH}/whoami`, {
            credentials: 'include',
        })
        return new User(await reply.json())
    }

    id: string
    role: string
    name: string

    constructor({ user_id, name, role }: UserPayload) {
        this.id = user_id
        this.name = name
        this.role = role || 'unknown'
    }

    get isValid() {
        return Boolean(this.id)
    }

    async become(id: string) {
        const result = await fetch(`${ENV.API_ADDRESS}/development/users/${id}/log_in`, {
            method: 'PUT', credentials: 'include',
        })
        if (result.ok) {
            this.id = id
        }
    }
}
