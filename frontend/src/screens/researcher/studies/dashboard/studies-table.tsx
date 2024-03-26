import { React, styled, useState } from '@common';
import { StageStatusEnum, Study, StudyStatusEnum } from '@api';
import {
    ColumnDef,
    ColumnFiltersState,
    ExpandedState,
    flexRender,
    getCoreRowModel,
    getExpandedRowModel,
    getFilteredRowModel,
    getSortedRowModel,
    Row,
    RowData,
    SortingState,
    Table,
    useReactTable,
    VisibilityState,
} from '@tanstack/react-table';
import { Link } from 'react-router-dom';
import { colors } from '@theme';
import { toDayJS } from '@lib';
import { Icon, TableHeader, Tooltip } from '@components';
import { getStudyEditUrl, isDraftLike, StudyStatus, useFetchStudies } from '@models';
import { ActionColumn } from './study-actions';
import { Checkbox, Group, Stack } from '@mantine/core';

declare module '@tanstack/table-core' {
    // eslint-disable-next-line no-unused-vars,@typescript-eslint/no-unused-vars
    interface ColumnMeta<TData extends RowData, TValue> {
        type: string
    }
    // eslint-disable-next-line no-unused-vars
    interface TableMeta<TData extends RowData> { // eslint-disable-line @typescript-eslint/no-unused-vars
        refreshData: () => void
    }
}

const StyledRow = styled.tr(({ hasChildren }: { hasChildren?: boolean }) => ({
    height: `3rem`,
    borderBottom: `1px solid ${colors.gray50}`,
    'td': {
        padding: '1rem .5rem',
    },
    backgroundColor: hasChildren ? colors.gray30 : 'inherit',
}))

const NestedRow = styled(StyledRow)({
    backgroundColor: colors.gray30,
})

const StudyRow: React.FC<{row: Row<Study> }> = ({ row }) => {
    if (row.depth > 0) {
        return (
            <NestedRow key={row.id}>
                {row.getVisibleCells().map((cell) => {
                    return (
                        <td key={cell.id} css={{
                            maxWidth: cell.column.getSize(),
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                        }}>
                            <div>{flexRender(cell.column.columnDef.cell, cell.getContext())}</div>
                        </td>
                    );
                })}
            </NestedRow>
        )
    }
    return (
        <StyledRow key={row.id} data-testid={`study-row-${row.original.id}`} hasChildren={!!row.getLeafRows().length}>
            {row.getVisibleCells().map((cell) => {
                return (
                    <td key={cell.id} css={{
                        maxWidth: cell.column.getSize(),
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                    }}>
                        <div>{flexRender(cell.column.columnDef.cell, cell.getContext())}</div>
                    </td>
                );
            })}
        </StyledRow>
    )
}

const StatusFilters: React.FC<{
    currentStatus: String,
    table: Table<Study>,
}> = ({ currentStatus, table }) => {
    const isLaunched = currentStatus === StudyStatus.Launched
    const isDraft = currentStatus === StudyStatus.Draft

    const handleFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newStatus = e.target.name;
        const checked = e.target.checked;
        table.getColumn('status')?.setFilterValue((old: string[]) => {
            return checked ? [...old, newStatus] : old.filter(v => v !== newStatus)
        })
    }

    const isChecked = (name: StudyStatusEnum) => {
        const values: string[] = table.getColumn('status')?.getFilterValue() as string[] || []
        return values.includes(name)
    }

    if (isLaunched) {
        return (
            <Group>
                <Checkbox label='Active' name='active' color='blue' checked={isChecked(StudyStatusEnum.Active)} onChange={handleFilter} size='xs' />
                <Checkbox label='Paused' name='paused' color='blue' checked={isChecked(StudyStatusEnum.Paused)} onChange={handleFilter} size='xs' />
                <Checkbox label='Scheduled' name='scheduled' color='blue' checked={isChecked(StudyStatusEnum.Scheduled)} onChange={handleFilter} size='xs' />
            </Group>
        )
    }

    if (isDraft) {
        return (
            <Group>
                <Checkbox label='Draft' name='draft' color='blue' checked={isChecked(StudyStatusEnum.Draft)} onChange={handleFilter} size='xs' />
                <Checkbox label='Waiting Period' name='waiting_period' color='blue' checked={isChecked(StudyStatusEnum.WaitingPeriod)} onChange={handleFilter} size='xs' />
                <Checkbox label='Ready For Launch' name='ready_for_launch' color='blue' checked={isChecked(StudyStatusEnum.ReadyForLaunch)} onChange={handleFilter} size='xs' />
            </Group>
        )
    }

    return null
}

const StyledLabel = styled.span({
    borderRadius: 20,
    padding: '4px 12px',
    color: colors.text,
})

const StatusLabel: React.FC<{status: string}> = ({ status }) => {
    switch(status) {
        case StudyStatusEnum.Active:
            return <StyledLabel css={{ color: '#1A654E', backgroundColor: '#C8EAD2' }}>Active</StyledLabel>
        case StudyStatusEnum.Paused:
            return <StyledLabel css={{ backgroundColor: '#DBDBDB' }}>Paused</StyledLabel>
        case StudyStatusEnum.Scheduled:
            return <StyledLabel css={{ backgroundColor: '#FAF6D1' }}>Scheduled</StyledLabel>
        case StudyStatusEnum.Draft:
            return <StyledLabel css={{ backgroundColor: '#F6DBED' }}>Draft</StyledLabel>
        case StudyStatusEnum.ReadyForLaunch:
            return <StyledLabel css={{ backgroundColor: '#C8EAD2' }}>Ready For Launch</StyledLabel>
        case StudyStatusEnum.WaitingPeriod:
            return <StyledLabel css={{ backgroundColor: '#FAF6D1' }}>Waiting Period</StyledLabel>
        case StudyStatusEnum.Completed:
            return <StyledLabel css={{ color: colors.purple, backgroundColor: '#DFE1F9' }}>Completed</StyledLabel>
        default:
            return null;
    }
}

const NoData: React.FC<{ filteredStudiesLength: number }> = ({ filteredStudiesLength }) => {
    const { data: studies = [], isLoading } = useFetchStudies()
    if (filteredStudiesLength || isLoading) return null
    return (
        <Stack align='center' justify='center' mt='xl' gap='large'>
            <h3 css={{ color: colors.gray50 }}>
                No data
            </h3>
            {!studies.length &&
                <Link to='/study/create' className='fw-bold'>
                    + Create your first research study on Kinetic
                </Link>
            }
        </Stack>
    )
}

const getColumnVisibility = (status: StudyStatus) => {
    if (status === StudyStatus.Draft) {
        return {
            'titleForResearchers': true,
            'status': true,
            'opensAt': false,
            'closesAt': false,
            'completedCount': false,
            'takeRate': false,
            'action': true,
        }
    }

    return {
        'titleForResearchers': true,
        'status': true,
        'opensAt': true,
        'closesAt': true,
        'completedCount': true,
        'takeRate': true,
        'action': true,
    }
}

export const StudiesTable: React.FC<{
    initialFilters: StudyStatusEnum[]
    currentStatus: StudyStatus
}> = ({
    initialFilters,
    currentStatus,
}) => {
    const { data: studies = [], refetch } = useFetchStudies()
    const [sorting, setSorting] = React.useState<SortingState>([{
        id: 'opensAt',
        desc: false,
    }])
    const [expanded, setExpanded] = React.useState<ExpandedState>(true);
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>(getColumnVisibility(currentStatus))
    const [filters, setFilters] = useState<ColumnFiltersState>([
        { id: 'status', value: initialFilters },
    ])

    const columns: ColumnDef<Study, any>[] = [
        {
            accessorKey: 'titleForResearchers',
            header: () => <span>Title</span>,
            size: 350,
            maxSize: 350,
            meta: {
                type: 'text',
            },
            cell: (info) => {
                return (
                    <Link
                        to={getStudyEditUrl(info.row.original)}
                        style={{
                            color: colors.blue,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            paddingLeft: info.row.depth ? '2rem' : 0,
                        }}>
                        {info.getValue()}
                    </Link>
                )
            },
        },
        {
            accessorKey: 'status',
            header: () => <span>Status</span>,
            enableSorting: false,
            filterFn: (row, columnId, filterValue) => {
                return filterValue.includes(row.getValue(columnId))
            },
            cell: (info) => {
                const isParent = info.row.getLeafRows().length
                if (isDraftLike(info.row.original)) {
                    if (!info.row.depth) {
                        return <StatusLabel status={info.getValue() as string} />
                    } else {
                        return '-'
                    }
                }

                if (isParent) {
                    return '-'
                }

                return <StatusLabel status={info.getValue() as string} />
            },
        },
        {
            accessorKey: 'opensAt',
            header: () => <span>{currentStatus === StudyStatus.Completed ? 'Opened on' : 'Opens on'}</span>,
            sortingFn: 'datetime',
            cell: (info) => {
                if (info.row.subRows.length || !info.row.original.opensAt) {
                    return '-'
                }

                return toDayJS(info.getValue() as Date).format('MM/DD/YYYY')
            },
        },
        {
            accessorKey: 'closesAt',
            header: () => <span>{currentStatus === StudyStatus.Completed ? 'Closed on' : 'Closes on'}</span>,
            cell: (info) => {
                if (info.row.subRows.length) {
                    return '-'
                }

                if (info.row.original.status === StageStatusEnum.Paused || !info.getValue()) {
                    return '-'
                }

                return toDayJS(info.getValue() as Date).format('MM/DD/YYYY')
            },
        },
        {
            accessorKey: 'completedCount',
            size: 175,
            header: () => {
                const tooltipText = currentStatus == StudyStatus.Completed ?
                    'Total # of study completions' :
                    'Total number of study completions / desired sample size'
                return (
                    <Group gap='xs'>
                        <span># Participants</span>
                        <Tooltip tooltip={tooltipText} css={{ display: 'flex' }}>
                            <Icon css={{ color: colors.blue50 }} icon='helpCircle' height={12}/>
                        </Tooltip>
                    </Group>
                )
            },
            cell: (info) => {
                const study = info.row.original;

                if (currentStatus == StudyStatus.Completed) {
                    return <span>{study.completedCount}</span>
                }

                if (!study.targetSampleSize) {
                    return <span>{study.completedCount} / N/A</span>
                }

                return (
                    <span>
                        {study.completedCount} / {study.targetSampleSize}
                    </span>
                )
            },
        },
        {
            accessorKey: 'takeRate',
            header: () => {
                return (
                    <Group gap='xs'>
                        <span>Take Rate</span>
                        <Tooltip tooltip='Rate of Participants who clicked ‘Begin Study’ against Total number of study previews' css={{ display: 'flex' }}>
                            <Icon css={{ color: colors.blue50 }} icon='helpCircle' height={12}/>
                        </Tooltip>
                    </Group>
                )
            },
            cell: (info) => {
                const study = info.row.original;
                if (!study.viewCount) {
                    return <span>-</span>
                }
                const percentage = Math.round((study.launchedCount || 0) / study.viewCount)
                return (
                    <span>{percentage}%</span>
                )
            },
        },
        {
            accessorKey: 'action',
            header: () => <span>Action</span>,
            enableSorting: false,
            cell: info => {
                return <ActionColumn study={info.row.original} cell={info} />
            },
        },
    ]

    const table: Table<Study> = useReactTable({
        filterFromLeafRows: true,
        data: studies,
        columns,
        state: {
            columnVisibility,
            columnFilters: filters,
            sorting,
            expanded,
        },
        autoResetExpanded: false,
        getSubRows: (study) => {
            if (!study.stages || study.stages.length < 2) {
                return undefined
            }
            return study.stages?.map((stage, index) => {
                return ({
                    ...study,
                    stages: [],
                    titleForResearchers: `Session ${index + 1}`,
                    status: stage.status,
                })
            })
        },
        getRowId: (originalRow: Study, index: number, parent?: Row<Study>) => {
            if (parent) {
                return `${originalRow.id}${index}`
            }
            return `${originalRow.id}`
        },
        onSortingChange: setSorting,
        onColumnFiltersChange: setFilters,
        onExpandedChange: setExpanded,
        onColumnVisibilityChange: setColumnVisibility,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getExpandedRowModel: getExpandedRowModel(),
        meta: {
            refreshData: async () => {
                await refetch()
            },
        },
    })

    return (
        <Stack className='studies' mt='lg'>
            <StatusFilters currentStatus={currentStatus} table={table}/>
            <table data-testid="studies-table" className='w-100 mt-2'>
                <thead css={{ height: 40 }}>
                    <tr>
                        {table.getFlatHeaders().map((header) =>
                            <TableHeader header={header} key={header.id} />
                        )}
                    </tr>
                </thead>
                <tbody>
                    {table.getRowModel().rows.map((row) => {
                        return <StudyRow row={row} key={row.id} />
                    })}
                </tbody>
            </table>
            <NoData filteredStudiesLength={table.getRowModel().rows.length} />
        </Stack>
    )
}
