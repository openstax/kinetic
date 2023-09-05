import { React } from '@common'
import { notifications } from '@mantine/notifications';
import { colors } from '@theme';
import { Icon } from '../icon';

export const showResearcherNotification = (message: string) => {
    notifications.show({
        message,
        color: 'blue',
        autoClose: 5000,
        withBorder: true,
        icon: <Icon icon='check' color={colors.white} />,
    })
}

export const showResearcherNotificationError = (message: string) => {
    notifications.show({
        message,
        color: 'red',
        autoClose: 5000,
        withBorder: true,
    })
}
