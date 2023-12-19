import React, { useState } from 'react'
import { Button, Modal, Stack, Text, Title } from '@mantine/core';
import { colors } from '@theme';
import { useEnvironment } from '@lib';
import Waves from '@images/waves.svg';
import { NavLink } from 'react-router-dom';
import { noop } from 'lodash-es';

export const UnsupportedCountryModal: FC = () => {
    const [open] = useState(true)
    const env = useEnvironment()

    return (
        <Modal.Root opened={open} onClose={noop} size='70%' centered closeOnEscape={false} closeOnClickOutside={false}>
            <Modal.Overlay />
            <Modal.Content >
                <Modal.Body style={{ backgroundImage: `url(${Waves}`, backgroundSize: 'cover' }} p='xl'>
                    <Stack justify='center' align='center' gap='4rem' c='white'>
                        <Title order={2}>We’re sorry Kinetic isn’t yet in your country!</Title>
                        <Text ta='center'>
                            Thank you for your interest in Kinetic! Kinetic is currently designed exclusively for participants residing in the United States mainland, territories, and minor outlying islands. We do however look forward to expanding Kinetic services to your home country and others in the future.
                        </Text>
                        <NavLink to={env.homepageUrl}>
                            <Button c={colors.purple} color={colors.white}>
                                Take me back
                            </Button>
                        </NavLink>
                    </Stack>
                </Modal.Body>
            </Modal.Content>
        </Modal.Root>
    )
}
