import { Main } from './grid';
import { React, useState } from '@common';
import { notifications } from '@mantine/notifications';
import { Button, Center, Group, NumberInput, Stack, Title } from '@mantine/core';
import { useCurrentUser } from '@lib';
import { ENV } from '@lib';

export function AdminReports() {
    return (
        <Main className='container'>
            <LearnerActivity />
        </Main>
    )
}

const LearnerActivity = () => {
    const [monthsAgo, setMonthsAgo] = useState<string | number>(1)
    const user = useCurrentUser()
    const email = user.contactInfos?.find(e => e.type == 'EmailAddress')?.value
    
    return (
        <Center p='lg'>
            <Stack>
                <Title order={6}>Learner Activity Report</Title>
                <Group align='end'>
                    <NumberInput label='Last N months for report'
                        hideControls
                        required
                        defaultValue={1}
                        value={monthsAgo}
                        onChange={setMonthsAgo}
                    />
                    <Button onClick={async () => {
                        try {
                            const response = await fetch(
                                `${ENV.API_ADDRESS}/api/v1/admin/reports/learner-activity?months_ago=${monthsAgo}&email=${email}`,
                                {
                                    method: 'GET',
                                    credentials: 'include',
                                    headers: {
                                        'Content-Type': 'application/json',
                                    },
                                }
                            );
                            if (response.ok) {
                                notifications.show({
                                    message: 'Report was emailed successfully.',
                                    color: 'green',
                                    withBorder: true,
                                });
                            } else {
                                notifications.show({
                                    message: 'Failed to send report. Please try again.',
                                    color: 'red',
                                    withBorder: true,
                                });
                            }
                        } catch (error) {
                            notifications.show({
                                message: 'An error occurred while sending the report.',
                                color: 'red',
                                withBorder: true,
                            });
                        }
                    }}
                    >
                        Email Report
                    </Button>
                </Group>
            </Stack>
        </Center>
    )
}
