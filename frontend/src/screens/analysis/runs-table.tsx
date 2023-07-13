import { Box, React, styled, useState, cx } from '@common';
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getSortedRowModel,
    Row,
    SortingState,
    Table,
    useReactTable,
} from '@tanstack/react-table';
import { Analysis, AnalysisRun, AnalysisRunMessage } from '@api';
import { Icon, StyledRow, TableHeader } from '@components';
import { colors } from '@theme';
import { hasRunSucceeded, isRunUnderReview, runHasError } from '@models';
import { Modal } from '@nathanstitt/sundry/modal';
import { useApi, toDayJS } from '@lib';

const AnalysisRunRow: React.FC<{row: Row<AnalysisRun> }> = ({ row }) => {
    return (
        <StyledRow key={row.id} data-testid={`analysis-run-row-${row.original.id}`}>
            {row.getVisibleCells().map((cell) => {
                return (
                    <td key={cell.id} css={{
                        maxWidth: 250,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                    }}>
                        <div>
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </div>
                    </td>
                );
            })}
        </StyledRow>
    )
}

export const RunsTable: FC<{analysis: Analysis}> = ({ analysis }) => {
    const { table } = useRunsTable(analysis)

    if (!analysis.runs?.length) return null

    return (
        <Box direction='column'>
            <h4>Analysis History</h4>
            <table data-testid="analysis-runs-table" className='mt-2'>
                <thead>
                    <tr>
                        {table.getFlatHeaders().map((header) =>
                            <TableHeader header={header} key={header.id} />
                        )}
                    </tr>
                </thead>
                <tbody>
                    {table.getRowModel().rows.map((row) => {
                        return <AnalysisRunRow row={row} key={row.id} />
                    })}
                </tbody>
            </table>
        </Box>
    )
}

const StyledLabel = styled.span({
    borderRadius: 20,
    padding: '4px 12px',
    color: colors.grayerText,
})

export const RunStatus: FC<{analysisRun: AnalysisRun}> = ({ analysisRun }) => {
    const [showErrorModal, setShowErrorModal] = useState(false)
    if (isRunUnderReview(analysisRun)) {
        return (
            <Box gap align='center'>
                <StyledLabel css={{ color: '#6B38A8', backgroundColor: '#EADDFB' }}>Under Review</StyledLabel>
                <StatusIcon icon='info' tooltip='Review takes on average 1 to 2 business days' />
            </Box>
        )
    }

    if (runHasError(analysisRun)) {
        return (
            <Box gap align='center'>
                <StyledLabel css={{ color: '#D4450C', backgroundColor: '#F8D5CD' }}>Error</StyledLabel>
                <StatusIcon icon='tripleDot' onClick={() => setShowErrorModal(true)} tooltip='View error log'/>
                <ErrorLog messages={analysisRun.messages || []} show={showErrorModal} setShow={setShowErrorModal} />
            </Box>
        )
    }

    if (hasRunSucceeded(analysisRun)) {
        return <StyledLabel css={{ color: '#1A654E', backgroundColor: '#C8EAD2' }}>Results Available</StyledLabel>
    }

    return <StyledLabel css={{ backgroundColor: '#F6DBED' }}>Draft</StyledLabel>
}

const ErrorLog: FC<{
    messages: AnalysisRunMessage[],
    show: boolean,
    setShow: Function
}> = ({ messages, show, setShow }) => {
    return (
        <Modal center show={show} large onHide={() => setShow(false)}>
            <Modal.Body>
                <Box padding='4rem' align='center' justify='center' direction='column' gap='large'>
                    {messages.map(message => (
                        <Box key={message.id} gap>
                            <span>Level: {message.level}</span>
                            <span>{message.message}</span>
                        </Box>
                    ))}
                </Box>
            </Modal.Body>
        </Modal>
    )
}

const StatusIcon = styled(Icon)({
    backgroundColor: colors.lightGray,
    borderRadius: 25,
    padding: 2,
    color: colors.white,
    cursor: 'pointer',
    height: 24,
    width: 24,
})

const useRunsTable = (analysis: Analysis) => {
    const [sorting, setSorting] = React.useState<SortingState>([{
        id: 'startedAt',
        desc: true,
    }])
    const columns = React.useMemo<ColumnDef<AnalysisRun>[]>(() => [
        {
            accessorKey: 'startedAt',
            header: () => 'Created on',
            sortingFn: 'datetime',
            cell: (info) => {
                return (
                    <span>
                        {toDayJS(info.getValue() as Date).format('MM/DD/YYYY hh:mm:ss A')}
                    </span>
                )
            },
        },
        {
            accessorKey: 'message',
            header: () => 'Commit message',
            minSize: 400,
            enableSorting: false,
            cell: (info) => info.getValue(),
        },
        {
            accessorKey: 'status',
            header: () => 'Status',
            accessorFn: (originalRow) => {
                if (isRunUnderReview(originalRow)) {
                    return 'Under Review'
                }
                if (runHasError(originalRow)) {
                    return 'Error'
                }
                return 'Results Ready'
            },
            meta: { type: 'text' },
            cell: (info) => <RunStatus analysisRun={info.row.original}/>,
        },
        {
            id: 'actions',
            header: () => 'Action',
            size: 375,
            enableSorting: false,
            cell: ({ row: { original: run } }: { row: { original: AnalysisRun } }) => {
                const api = useApi()
                const canDownload = hasRunSucceeded(run)
                const cancelRun = () => {
                    api.updateAnalysisRun({
                        runId: run.id,
                        analysisId: run.analysisId,
                        updateAnalysisRun: { status: 'cancelled' },
                    })
                }
                return (
                    // TODO download URLs @nathan?
                    <Box gap='medium'>
                        <ActionLink
                            className={cx({ disabled: !canDownload })}
                            href={`/api/researcher/analysis/{run.analysisId}/run/{run.id}/results`}>
                            Download Results
                        </ActionLink>
                        <ActionLink onClick={() => cancelRun()}>
                            Cancel Analysis
                        </ActionLink>
                    </Box>
                )
            },
        },
    ], [])

    const table: Table<AnalysisRun> = useReactTable({
        data: analysis.runs || [],
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

const ActionLink = styled.a({
    padding: 'unset',
})
