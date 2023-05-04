import { create } from 'zustand';

type NotificationState = {
    notifications: Notification[]
    addNotification: (message: string, type: NotificationType) => void,
    dismissNotification: () => void
}

export type NotificationType = 'error' | 'success' | 'info'
interface Notification {
    type: NotificationType,
    message: string,
}

export const useNotificationStore = create<NotificationState>((set) => ({
    notifications: [],
    addNotification: (message: string, type: NotificationType = 'success') => {
        set((state) => ({
            notifications: [
                { message, type },
                ...state.notifications,
            ],
        }))
    },
    dismissNotification: () => {
        set((state) => ({
            notifications: state.notifications.slice(1),
        }))
    },
}))
