import { React, useNavigate } from '@common'
import { Box, Page } from '@components'
import { StudyStatus } from '@models'
import { colors } from '@theme';
import 'bootstrap/js/dist/dropdown'
import { StudiesTable } from './studies-table';
import { StudyStatusEnum } from '@api';
import { useParams } from 'react-router-dom';
import { Button, Tabs, Title } from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';

const FilterTabText: FC<{text: string, active: boolean}> = ({ text, active }) => {
    if (active) {
        return (
            <Title order={4} c='blue' style={{
                textDecoration: 'underline',
                textUnderlineOffset: '.5rem',
            }}>
                {text}
            </Title>
        )
    }

    return (
        <Title order={4} c={colors.text}>
            {text}
        </Title>
    )
}

export default function ResearcherStudies() {
    const nav = useNavigate()
    const { studyStatus = 'launched' } = useParams();

    return (
        <Page className='studies-dashboard' hideFooter>
            <Box align="center" justify="between">
                <h3 className='fw-bold' data-testid='studies-table-header'>
                    Studies
                </h3>
                <Button
                    color='blue'
                    data-testid="add-study"
                    onClick={() => nav('/study/create')}
                    leftSection={<IconPlus />}
                >
                    Create New Study
                </Button>
            </Box>
            <Tabs variant='unstyled' value={studyStatus} onChange={(value) => nav(`/studies/status/${value}`)} styles={{
                tab: {
                    padding: '1rem 2rem 1rem 0',
                },
            }}>
                <Tabs.List>
                    <Tabs.Tab value="launched">
                        <FilterTabText text='Launched' active={studyStatus == 'launched'} />
                    </Tabs.Tab>
                    <Tabs.Tab value="draft">
                        <FilterTabText text='Draft' active={studyStatus == 'draft'} />
                    </Tabs.Tab>
                    <Tabs.Tab value="completed">
                        <FilterTabText text='Completed' active={studyStatus == 'completed'} />
                    </Tabs.Tab>
                </Tabs.List>

                <Tabs.Panel value='launched'>
                    <StudiesTable
                        initialFilters={[StudyStatusEnum.Active, StudyStatusEnum.Paused, StudyStatusEnum.Scheduled]}
                        currentStatus={StudyStatus.Launched}
                    />
                </Tabs.Panel>

                <Tabs.Panel value='draft'>
                    <StudiesTable
                        initialFilters={[StudyStatusEnum.Draft, StudyStatusEnum.WaitingPeriod, StudyStatusEnum.ReadyForLaunch]}
                        currentStatus={StudyStatus.Draft}
                    />
                </Tabs.Panel>

                <Tabs.Panel value='completed'>
                    <StudiesTable
                        initialFilters={[StudyStatusEnum.Completed]}
                        currentStatus={StudyStatus.Completed}
                    />
                </Tabs.Panel>
            </Tabs>
        </Page>
    )
}
