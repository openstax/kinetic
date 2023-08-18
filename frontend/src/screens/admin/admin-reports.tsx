import { Main } from './grid';
import { React, useState } from '@common';
import { Button, Center, Group, NumberInput, Stack, Title } from '@mantine/core';
import { ENV } from '@lib';

export function AdminReports() {
    return (
        <Main className='container'>
            <LearnerActivity />
        </Main>
    )
}

const LearnerActivity = () => {
    const [monthsAgo, setMonthsAgo] = useState<number | ''>(1)
    return (
        <Center p='lg'>
            <Stack>
                <Title order={6}>Learner Activity Report</Title>
                <Group align='end'>
                    <NumberInput label='Last N months for report' hideControls required defaultValue={1} value={monthsAgo} onChange={setMonthsAgo}/>
                    <Button component='a' target='_blank' href={`${ENV.API_ADDRESS}/api/v1/admin/reports/learner-activity?months_ago=${monthsAgo}`}>
                        Generate Report
                    </Button>
                </Group>
            </Stack>
        </Center>
    )
}
