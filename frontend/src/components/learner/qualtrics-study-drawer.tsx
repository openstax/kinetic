import React, { FC } from 'react'
import { Button, Drawer } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';

export const QualtricsStudyDrawer: FC<{isOpen: boolean, url: string | undefined}> = ({ isOpen, url }) => {
    const [opened, { close }] = useDisclosure(isOpen);

    if (!url) return null

    return (
        <Drawer size='xl' position='left' opened={opened} onClose={close} transitionProps={{ transition: 'rotate-left', duration: 150, timingFunction: 'linear' }}>
            <Drawer.Content style={{ overflow: 'hidden' }}>
                <Drawer.Body p={0} h='100%' style={{ overflow: 'hidden' }}>
                    <iframe height='100%' width='100%' src={url} />
                </Drawer.Body>
            </Drawer.Content>
        </Drawer>
    )
}
