import { cx, React, styled } from '@common';
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
} from '@tanstack/react-table';
import { Link } from 'react-router-dom';
import { colors } from '@theme';
import { toDayJS } from '@lib';
import { Box, Icon, TableHeader, Tooltip } from '@components';
import { getStudyEditUrl, isDraftLike, StudyStatus, useFetchStudies } from '@models';
import { Dispatch, SetStateAction } from 'react';
import { ActionColumn } from './study-actions';

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
    backgroundColor: hasChildren ? colors.gray10 : 'inherit',
}))

const NestedRow = styled(StyledRow)({
    backgroundColor: colors.gray10,
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

const FilterContainer = styled(Box)({
    color: colors.text,
    "input[type='checkbox']": {
        accentColor: colors.blue,
        width: 16,
        height: 16,
    },
})

const StatusFilters: React.FC<{
    status: String,
    table: Table<Study>,
    className?: string,
}> = ({ status, table, className }) => {
    const isLaunched = status === StudyStatus.Launched
    const isDraft = status === StudyStatus.Draft

    const handleFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
        const status = e.target.name;
        const checked = e.target.checked;
        table.getColumn('status')?.setFilterValue((old: string[]) => {
            return checked ? [...old, status] : old.filter(v => v !== status)
        })
    }

    const isChecked = (name: string) => {
        const values: string[] = table.getColumn('status')?.getFilterValue() as string[] || []
        return values.includes(name)
    }

    if (isLaunched) {
        return (
            <FilterContainer className={cx(className)} gap='medium'>
                <Box gap align='center'>
                    <input id='active-filter' type="checkbox" name="active" checked={isChecked(`${StudyStatusEnum.Active}`)} onChange={handleFilter}/>
                    <label className='small' htmlFor='active-filter'>Active</label>
                </Box>
                <Box gap align='center'>
                    <input id='paused-filter' type='checkbox' name='paused' checked={isChecked(`${StudyStatusEnum.Paused}`)} onChange={handleFilter}/>
                    <label className='small' htmlFor='paused-filter'>Paused</label>
                </Box>
                <Box gap align='center'>
                    <input id='scheduled-filter' type='checkbox' name='scheduled' checked={isChecked(`${StudyStatusEnum.Scheduled}`)} onChange={handleFilter}/>
                    <label className='small' htmlFor='scheduled-filter'>Scheduled</label>
                </Box>
            </FilterContainer>
        )
    }

    if (isDraft) {
        return (
            <FilterContainer className={cx(className)} gap='medium'>
                <Box gap align='center'>
                    <input id='draft-filter' type="checkbox" name="draft" checked={isChecked(`${StudyStatusEnum.Draft}`)} onChange={handleFilter}/>
                    <label className='small' htmlFor='draft-filter'>Draft</label>
                </Box>
                <Box gap align='center'>
                    <input id='waiting-period-filter' type='checkbox' name='waiting_period' checked={isChecked(`${StudyStatusEnum.WaitingPeriod}`)} onChange={handleFilter}/>
                    <label className='small' htmlFor='waiting-period-filter'>Waiting Period</label>
                </Box>
                <Box gap align='center'>
                    <input id='ready-for-launch-filter' type='checkbox' name='ready_for_launch' checked={isChecked(`${StudyStatusEnum.ReadyForLaunch}`)} onChange={handleFilter}/>
                    <label className='small' htmlFor='ready-for-launch-filter'>Ready For Launch</label>
                </Box>
            </FilterContainer>
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
    const { data: studies, isLoading } = useFetchStudies()
    if (filteredStudiesLength || isLoading || !studies) return null
    return (
        <Box direction='column' align='center' justify='center' className='mt-10' gap='large'>
            <h3 css={{ color: colors.gray50 }}>
                No data
            </h3>
            {!studies.length && <span>
                <Link
                    to='/study/create'
                    css={{ color: colors.blue }}
                    className='fw-bold'
                >
                    + Create your first research study on Kinetic
                </Link>
            </span>}
        </Box>
    )
}

export const StudiesTable: React.FC<{
    filters: ColumnFiltersState,
    setFilters: Dispatch<SetStateAction<ColumnFiltersState>>,
    currentStatus: StudyStatus
}> = ({
    filters,
    setFilters,
    currentStatus,
}) => {
    const { data: studies, refetch } = useFetchStudies()
    const [sorting, setSorting] = React.useState<SortingState>([{
        id: 'opensAt',
        desc: false,
    }])
    const [expanded, setExpanded] = React.useState<ExpandedState>(true);

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
                    <Box css={{ paddingLeft: info.row.depth ? '2rem' : '' }}>
                        <Link
                            to={getStudyEditUrl(info.row.original)}
                            css={{
                                color: colors.blue,
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                            }}>
                            {info.getValue()}
                        </Link>
                    </Box>
                )
            },
        },
        {
            accessorKey: 'status',
            header: () => <span>Status</span>,
            size: 175,
            meta: {
                type: 'text',
            },
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
                    <Box gap>
                        <span># Participants</span>
                        <Tooltip tooltip={tooltipText} css={{ display: 'flex' }}>
                            <Icon css={{ color: colors.blue50 }} icon='helpCircle' height={12}/>
                        </Tooltip>
                    </Box>
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
                    <Box gap>
                        <span>Take Rate</span>
                        <Box>
                            <Tooltip tooltip='Rate of Participants who clicked ‘Begin Study’ against Total number of study previews' css={{ display: 'flex' }}>
                                <Icon css={{ color: colors.blue50 }} icon='helpCircle' height={12}/>
                            </Tooltip>
                        </Box>
                    </Box>
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
        data: studies || [],
        columns,
        state: {
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

    table.reset

    return (
        <Box direction='column' className='studies mt-2'>
            <StatusFilters status={currentStatus} table={table}/>
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
        </Box>
    )
}
