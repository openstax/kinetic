import { ENV } from '@lib'
import { useEffect, useState } from '@common'

export interface UserPayload {
    name: string
    user_id: string
    role?: string
}

export class User {

    static async fetchCurrentUser() {
        const reply = await fetch(`${ENV.API_URL}/development/users/whoami`, {
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

    become(id: string) {
        this.id = id
    }
}
