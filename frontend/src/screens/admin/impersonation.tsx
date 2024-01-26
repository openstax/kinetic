import { React, useState } from '@common'
import { Main } from './grid';
import { useFetchResearchers } from '@models';
import { Button, Center, Select, Stack, Title } from '@mantine/core';
import { LoadingAnimation } from '@components';
import { Researcher } from '@api';
import { ENV } from '@lib';

export function Impersonation() {
    return (
        <Main className='container'>
            <ResearcherImpersonation />
        </Main>
    )
}

const ResearcherImpersonation = () => {
    const { data: researchers, isLoading } = useFetchResearchers()
    const [selectedResearcher, setSelectedResearcher] = useState<Researcher | null>(null)
    if (isLoading || !researchers) return <LoadingAnimation />

    return (
        <Center mt='lg'>
            <Stack w={400}>
                <Title order={4}>View kinetic as another researcher</Title>
                <Select
                    label='Select a researcher to view as'
                    searchable
                    nothingFoundMessage='No results'
                    onChange={(value) => {
                        if (!value) return setSelectedResearcher(null)
                        const researcher = researchers.find(r => r.id == +value)
                        if (!researcher) return setSelectedResearcher(null)
                        setSelectedResearcher(researcher)
                    }}
                    data={researchers.map(r => ({
                        value: `${r.id}`,
                        label: `${r.firstName} ${r.lastName}`,
                    }))}
                />
                {selectedResearcher &&
                    <Button color='blue' component='a' href={`${ENV.API_ADDRESS}/api/v1/admin/impersonate/researcher/${selectedResearcher.id}`}>
                        View as {selectedResearcher.firstName} {selectedResearcher.lastName}
                    </Button>
                }
            </Stack>
        </Center>
    )
}
