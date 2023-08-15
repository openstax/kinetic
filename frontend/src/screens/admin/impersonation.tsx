import { React, useState } from '@common'
import { Main } from './grid';
import { useFetchResearchers } from '@models';
import { Button, Center, Select, Stack, Title } from '@mantine/core';
import { LoadingAnimation } from '@components';
import { Researcher } from '@api';
import { useApi, useFetchEnvironment } from '@lib';

export function Impersonation() {
    return (
        <Main className='container'>
            <ResearcherImpersonation />
        </Main>
    )
}

const ResearcherImpersonation = () => {
    const api = useApi()
    const { refetch } = useFetchEnvironment()
    const { data: researchers, isLoading } = useFetchResearchers()
    const [selectedResearcher, setSelectedResearcher] = useState<Researcher | null>(null)
    if (isLoading || !researchers) return <LoadingAnimation />

    const becomeResearcher = (researcherId: number) => {
        api.impersonateResearcher({ id: researcherId }).then(
            () => refetch()
        )
    }

    return (
        <Center mt='lg'>
            <Stack w={400}>
                <Title order={4}>Become a researcher here</Title>
                <Select
                    label='Select a researcher to impersonate'
                    searchable
                    nothingFound='No results'
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
                    <Button color='blue' onClick={() => becomeResearcher(selectedResearcher?.id)}>
                        Become {selectedResearcher.firstName} {selectedResearcher.lastName}
                    </Button>
                }
            </Stack>
        </Center>
    )
}
