import { Main } from './grid';
import { React, useState } from '@common';
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
                    <Button onClick={() => {
                        {`${ENV.API_ADDRESS}/api/v1/admin/reports/learner-activity?months_ago=${monthsAgo}?email=${email}`}
                    }}>
                        Email Report
                    </Button>
                </Group>
            </Stack>
        </Center>
    )
}
