import React, { useState } from 'react'
import { Button, Modal, Stack, Text, Title } from '@mantine/core';
import { colors } from '@theme';

export const LearnerWelcomeModal: FC = () => {
    const [open, setOpen] = useState(true)
    const onClose = () => {
        setOpen(false)
    }
    return (
        <Modal centered opened={open} onClose={onClose} size='70%'>
            <Modal.Body>
                <Stack justify='center' align='center' gap='xl'>
                    <Title order={2}>Welcome to OpenStax Kinetic!</Title>
                    <Text ta='center'>
                        Take part in the latest learning research for free at the comfort of your home. With each study, you will gather more insight about yourself as a person and student, and understand the learning techniques that work best for you.
                    </Text>
                    <Text ta='center'>
                        <em>Bonus:</em> Earn points with each study and join thousands of learners in exciting monthly prize draws!
                    </Text>
                    <Button c={colors.purple} color={colors.white}>
                        Let's go!
                    </Button>
                </Stack>
            </Modal.Body>
        </Modal>
    )
}
