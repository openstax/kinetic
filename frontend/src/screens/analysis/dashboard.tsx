import { Analysis, Study } from '@api';
import { React, Box, useNavigate, useEffect } from '@common';
import { Icon, ResearcherButton, StyledRow, TableHeader, Tooltip } from '@components';
import {
    ColumnDef, flexRender,
    getCoreRowModel,
    getFilteredRowModel, getPaginationRowModel,
    getSortedRowModel, Row, SortingState,
    Table,
    useReactTable,
} from '@tanstack/react-table';
import { colors } from '@theme';
import { toDayJS, useApi } from '@lib';
import { Link } from 'react-router-dom';

export const AnalysisDashboard: FC<{analyses: Analysis[], fetchAnalyses(): void}> = ({ analyses, fetchAnalyses }) => {
    const nav = useNavigate()
    return (
        <Box className='analysis-overview' direction='column' width='100%' gap='large'>
            <Box align='center' justify='between'>
                <h3>Analysis</h3>
                <ResearcherButton onClick={() => nav(`/analysis/edit/new`)}>
                    + Create New Analysis
                </ResearcherButton>
            </Box>
            <AnalysisTable analyses={analyses} />

        </Box>
    )
}

const AnalysisRow: React.FC<{row: Row<Analysis> }> = ({ row }) => {
    return (
        <StyledRow key={row.id} data-testid={`analysis-row-${row.original.id}`}>
            {row.getVisibleCells().map((cell) => {
                return (
                    <td key={cell.id} css={{
                        maxWidth: 250,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                    }}>
                        <div css={{ height: '1rem' }}>
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </div>
                    </td>
                );
            })}
        </StyledRow>
    )
}


const AnalysisTable: FC<{analyses: Analysis[]}> = ({ analyses }) => {
    const { table } = useAnalysisTable(analyses)
    return (
        <table data-testid="analysis-table" className='mt-6'>
            <thead>
                <tr>
                    {table.getFlatHeaders().map((header) =>
                        <TableHeader header={header} key={header.id} />
                    )}
                </tr>
            </thead>
            <tbody>
                {table.getRowModel().rows.map((row) => {
                    return <AnalysisRow row={row} key={row.id} />
                })}
            </tbody>
        </table>
    )
}

const useAnalysisTable = (analyses: Analysis[]) => {
    const api = useApi()
    const [sorting, setSorting] = React.useState<SortingState>([])

    const columns = React.useMemo<ColumnDef<Analysis>[]>(() => [
        {
            accessorKey: 'title',
            header: () => 'Title',
            size: 300,
            meta: { type: 'text' },
            cell: (info) => {
                return <Link to={`/analysis/overview/${info.row.original.id}`}>{info.getValue() as string}</Link>
            },
        },
        {
            accessorKey: 'finishedAt',
            header: () => (
                <span>Last run on</span>
            ),
            sortingFn: 'datetime',
            cell: (info) => {
                const finishedAt = info.getValue() as Date
                if (!finishedAt) return '-'

                return (
                    <span>
                        {toDayJS(finishedAt).format('MM/DD/YYYY')}
                    </span>
                )
            },
        },
        {
            accessorKey: 'status',
            header: () => 'Last run status',
            meta: { type: 'text' },
            cell: (info) => {
                return (
                    info.getValue()
                )
            },
        },
        {
            id: 'runs',
            header: () => '# of runs',
            sortingFn: 'alphanumeric',
            cell: ({ row }) => {
                return 'TODO: analysis.runs.length'
                // row.original
                // const isMyStudy = !!row.original.researchers?.find(r => r.userId == currentResearcher?.userId)
                // return (
                //     isMyStudy ? 'Your Team' : 'Shared on Kinetic'
                // )
            },
        },
    ], [])

    const table: Table<Analysis> = useReactTable({
        data: analyses,
        columns,
        state: {
            sorting,
        },
        getRowId: (row) => String(row.id),
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
    })

    return { table }
}
