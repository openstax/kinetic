import { Box, React, styled, useState } from '@common';
import { Icon } from '@components';
import { colors } from '../../../../theme';
import { Col } from '@nathanstitt/sundry';

export type NotificationType = 'error' | 'success' | 'info'
interface Notification {
    type: NotificationType,
    message: string,
}

export const useActionNotifications = () => {
    const [notifications, setNotifications] = useState<Notification[]>([])

    const addNotification = (message: string, type: NotificationType = 'success') => {
        setNotifications(old => [{ message, type }, ...old])
    }

    const dismissNotification = () => {
        setNotifications(old => old.slice(1))
    }

    return { notifications, addNotification, dismissNotification }
}

const NotificationContainer = styled(Box)({
    backgroundColor: colors.white,
    border: `1px solid ${colors.lightGray}`,
    padding: '10px 15px',
    boxShadow: `0px 2px 4px rgba(0, 0, 0, 0.2)`,
    borderRadius: 5,
    marginBottom: `1rem`,
})

export const ActionNotification: FC<{
    notifications: Notification[],
    onDismiss: () => void
}> = ({ notifications, onDismiss }) => {
    const notification = notifications[0];

    if (!notification) {
        return null
    }

    return (
        <NotificationContainer>
            <Col sm={1} align='start'>
                {notification.type === 'success' && <Icon icon="checkCircle" color={colors.green} height={25} />}
                {notification.type === 'error' && <Icon icon="xCircle" color={colors.red} height={25} />}
                {notification.type === 'info' && <Icon icon="questionCircleFill" color={colors.yellow} height={25} />}
            </Col>
            <Col sm={10}>
                <span>{notification.message}</span>
            </Col>
            <Col sm={1} align='end'>
                <Icon icon="x" height={25} onClick={() => onDismiss()} />
            </Col>
        </NotificationContainer>
    )
}
