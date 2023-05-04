import { Box, styled, useEffect, useState } from '@common';
import { colors } from '@theme';
import { useNotificationStore } from '@store';
import { useRef } from 'react';
import { Toast } from 'bootstrap';
import React from 'react';
// TODO Remove this
const NotificationContainer = styled(Box)({
    backgroundColor: colors.white,
    border: `1px solid ${colors.lightGray}`,
    padding: '10px 15px',
    boxShadow: `0px 2px 4px rgba(0, 0, 0, 0.2)`,
    borderRadius: 5,
    marginBottom: `1rem`,
})

export const Notifications: FC<{}> = () => {
    const { notifications, dismissNotification } = useNotificationStore()
    const notification = notifications[0];

    if (!notification) {
        return null
    }


    return (
        <div></div>
    // <NotificationContainer>
    //     <Col sm={1} align='start'>
    //         {notification.type === 'success' && <Icon icon="checkCircle" color={colors.green} height={25} />}
    //         {notification.type === 'error' && <Icon icon="xCircle" color={colors.red} height={25} />}
    //         {notification.type === 'info' && <Icon icon="questionCircleFill" color={colors.yellow} height={25} />}
    //     </Col>
    //     <Col sm={10}>
    //         <span>{notification.message}</span>
    //     </Col>
    //     <Col sm={1} align='end'>
    //         <Icon icon="x" height={25} onClick={() => dismissNotification()} />
    //     </Col>
    // </NotificationContainer>
    )
}
