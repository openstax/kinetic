import { Analysis, Study } from '@api';
import { React, Box, useNavigate } from '@common';
import { Icon, ResearcherButton, Tooltip } from '@components';
import { ColumnDef } from '@tanstack/react-table';
import { colors } from '@theme';

export const AnalysisDashboard:FC<{analyses: Analysis[]}> = ({ analyses }) => {
    const nav = useNavigate()
    return (
        <Box className='analysis-overview' direction='column' width='100%' gap='large'>
            <Box align='center' justify='between'>
                <h3>Analysis</h3>
                <ResearcherButton onClick={() => nav(`/analysis/edit/new`)}>
                    + Create New Analysis
                </ResearcherButton>
            </Box>


        </Box>
    )
}

const useAnalysisTable = (analyses: Analysis[]) => {
    const columns = React.useMemo<ColumnDef<Study>[]>(() => [
        {
            accessorKey: 'title',
            header: () => 'Title',
            size: 300,
            meta: { type: 'text' },
            cell: (info) => info.getValue() as string,
        },
        {
            accessorKey: 'finishedAt',
            header: () => (
                <Box gap>
                    <span>Last run on</span>
                    <Tooltip tooltip='Total number of study completions' className='d-flex'>
                        <Icon css={{ color: colors.tooltipBlue }} icon='questionCircleFill' height={14}/>
                    </Tooltip>
                </Box>
            ),
            sortingFn: 'alphanumeric',
            cell: (info) => {
                return (
                    <span>
                        {(info.cell.getValue() as string) || '-'}
                    </span>
                )
            },
        },
        {
            accessorKey: 'category',
            header: () => 'Study Type',
            meta: { type: 'text' },
            cell: (info) => {
                return (
                    info.getValue()
                )
            },
        },
        {
            id: 'researchTeam',
            header: () => 'Research Team',
            meta: { type: 'text' },
            cell: ({ row }) => {
                const isMyStudy = !!row.original.researchers?.find(r => r.userId == currentResearcher?.userId)
                return (
                    isMyStudy ? 'Your Team' : 'Shared on Kinetic'
                )
            },
        },
    ], [])
}
