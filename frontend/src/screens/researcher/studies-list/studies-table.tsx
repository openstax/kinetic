import { cx, React, styled } from '@common';
import { Study, StudyStatusEnum } from '@api';
import {
    ColumnDef,
    ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getSortedRowModel,
    Header,
    Row,
    RowData,
    SortingState,
    Table,
    useReactTable,
} from '@tanstack/react-table';
import { Link } from 'react-router-dom';
import { colors } from '../../../theme';
import { toDayJS } from '@lib';
import { Box, Icon } from '@components';
import { Tooltip } from '@nathanstitt/sundry';
import AtoZ from '../../../images/icons/atoz.png';
import ZtoA from '../../../images/icons/ztoa.png';
import AtoZDefault from '../../../images/icons/atozdefault.png';
import SortUp from '../../../images/icons/sortup.png';
import SortDown from '../../../images/icons/sortdown.png';
import SortDefault from '../../../images/icons/sort.png';
import { ActionColumn } from './study-actions';
import { useFetchStudies } from '@models';
import { Dispatch, SetStateAction } from 'react';
import { NotificationType } from './study-action-notification';

declare module '@tanstack/table-core' {
    interface ColumnMeta<TData extends RowData, TValue> { // eslint-disable-line @typescript-eslint/no-unused-vars
        type: string
    }
    interface TableMeta<TData extends RowData> { // eslint-disable-line @typescript-eslint/no-unused-vars
        updateData: (rowIndex: number, columnId: string, value: Study) => void
    }
}

const StyledHeader = styled('th')({
    '.header-text': {
        fontWeight: 'bold',
        color: colors.grayText,
    },
    borderBottom: `3px solid ${colors.lightGray}`,
});

const SortIcon: React.FC<{header: Header<Study, unknown> }> = ({ header }) => {
    if (header.column.columnDef.meta?.type == 'text') {
        return (
            <span>
                {{
                    asc: <img src={AtoZ} alt='A to Z'/>,
                    desc: <img src={ZtoA} alt='Z to A' />,
                    false: <img src={AtoZDefault} alt='AtoZDefault' />,
                }[header.column.getIsSorted() as string] ?? null}
            </span>
        )
    }

    return (
        <span>
            {{
                asc: <img src={SortUp} alt='sort ascending'/>,
                desc: <img src={SortDown} alt='sort descending' />,
                false: <img src={SortDefault} alt='sort default' />,
            }[header.column.getIsSorted() as string] ?? null}
        </span>
    )
}

const TableHeader: React.FC<{header: Header<Study, unknown> }> = ({ header }) => {
    const canSort = header.column.getCanSort()
    return (
        <StyledHeader css={{ width: header.getSize() }}>
            <span
                onClick={() => canSort && header.column.toggleSorting()}
                className={cx('header-text', { 'cursor-pointer': canSort })}
                css={{ cursor: header.column.getCanSort() ? 'pointer' : 'auto' }}
            >
                <Box gap>
                    {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                    )}
                    {canSort && <SortIcon header={header} />}
                </Box>
            </span>
        </StyledHeader>
    )
}

const StyledRow = styled.tr({
    padding: '10px 0',
    height: `3rem`,
    borderBottom: `1px solid ${colors.lightGray}`,
})

const StudyRow: React.FC<{row: Row<Study> }> = ({ row }) => {
    return (
        <StyledRow key={row.id}>
            {row.getVisibleCells().map((cell) => {
                return (
                    <td key={cell.id} css={{
                        maxWidth: 250,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                    }}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                );
            })}
        </StyledRow>
    )
}

const FilterContainer = styled(Box)({
    color: colors.grayerText,
    "input[type='checkbox']": {
        accentColor: colors.purple,
        width: 16,
        height: 16,
    },
})

const StatusFilters: React.FC<{
    table: Table<Study>,
    className?: string,
}> = ({ table, className }) => {
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

    return (
        <FilterContainer className={cx(className)} gap='medium'>
            <span>Show</span>
            <Box gap align='center'>
                <input type="checkbox" name="active" checked={isChecked('active')} onChange={handleFilter}/>
                <small>Active</small>
            </Box>
            <Box gap align='center'>
                <input type='checkbox' name='paused' checked={isChecked('paused')} onChange={handleFilter}/>
                <small>Paused</small>
            </Box>
            <Box gap align='center'>
                <input type='checkbox' name='scheduled' checked={isChecked('scheduled')} onChange={handleFilter}/>
                <small>Scheduled</small>
            </Box>
        </FilterContainer>
    )
}

const StyledLabel = styled.span({
    borderRadius: 20,
    padding: '4px 12px',
    color: colors.grayerText,
})

const StatusLabel: React.FC<{status: string}> = ({ status }) => {
    switch(status) {
        case 'active':
            return <StyledLabel css={{ color: '#1A654E', backgroundColor: '#C8EAD2' }}>Active</StyledLabel>
        case 'paused':
            return <StyledLabel css={{ backgroundColor: '#DBDBDB' }}>Paused</StyledLabel>
        case 'scheduled':
            return <StyledLabel css={{ backgroundColor: '#FAF6D1' }}>Scheduled</StyledLabel>
        case 'draft':
            return <StyledLabel css={{ backgroundColor: '#F6DBED' }}>Draft</StyledLabel>
        case 'completed':
            return <StyledLabel css={{ color: colors.purple, backgroundColor: '#DFE1F9' }}>Completed</StyledLabel>
        default:
            return null;
    }
}

const NoData: React.FC = () => {
    return (
        <Box direction='column' align='center' justify='center' className='mt-10' gap='large'>
            <h3 css={{ color: colors.lightGray }}>
                No data
            </h3>
            <span>
                <Link to='/study/edit/new' css={{ color: colors.purple }} className='fw-bold'>
                    + Create your first study
                </Link>
                <span> and start to collect data</span>
            </span>
        </Box>
    )
}

export const StudiesTable: React.FC<{
    isLaunched: boolean,
    filters: ColumnFiltersState,
    setFilters: Dispatch<SetStateAction<ColumnFiltersState>>,
    addNotification: (message: string, type?: NotificationType) => void
}> = ({
    isLaunched,
    filters,
    setFilters,
    addNotification,
}) => {
    const { studies, setStudies } = useFetchStudies()
    const [sorting, setSorting] = React.useState<SortingState>([])
    const columns = React.useMemo<ColumnDef<Study, any>[]>(() => [
        {
            accessorKey: 'titleForResearchers',
            header: () => <span>Title</span>,
            size: 350,
            meta: {
                type: 'text',
            },
            cell: (info) => {
                const studyId = info.row.original.id;
                return (
                    <Link
                        to={`/study/edit/${studyId}`}
                        css={{ color: colors.purple }}
                    >
                        {info.getValue()}
                    </Link>
                )
            },
        },
        {
            accessorKey: 'status',
            header: () => <span>Status</span>,
            meta: {
                type: 'text',
            },
            filterFn: (row, columnId, filterValue) => {
                return filterValue.includes(row.getValue(columnId))
            },
            cell: (info) => <StatusLabel status={info.getValue() as string} />,
        },
        {
            accessorKey: 'opensAt',
            header: () => <span>Opens on</span>,
            cell: (info) => toDayJS(info.getValue() as Date).format('MM/DD/YYYY'),
        },
        {
            accessorKey: 'closesAt',
            header: () => <span>Closes on</span>,
            cell: (info) => {
                if (info.row.original.status === StudyStatusEnum.Paused) {
                    return '-'
                }
                return toDayJS(info.getValue() as Date).format('MM/DD/YYYY')
            },
        },
        {
            accessorKey: 'sampleSize',
            size: 175,
            header: () => {
                return (
                    <Box gap>
                        <Tooltip tooltip='Total number of study completions / desired sample size'>
                            <Icon css={{ color: colors.tooltipBlue }} icon='questionCircleFill' height={16}/>
                        </Tooltip>
                        <span>Sample Size</span>
                    </Box>
                )
            },
            cell: (info) => {
                const study = info.row.original;
                if (study.completedCount == 0 || study.targetSampleSize == 0) {
                    return null
                }
                return (
                    <span>
                        {study.completedCount}/{study.targetSampleSize}
                    </span>
                )
            },
        },
        {
            accessorKey: 'takeRate',
            header: () => {
                return (
                    <Box gap>
                        <Tooltip tooltip='Participants who clicked ‘Begin Study’ / Total number of study previews'>
                            <Icon css={{ color: colors.tooltipBlue }} icon='questionCircleFill' height={16}/>
                        </Tooltip>
                        <span>Take Rate</span>
                    </Box>
                )
            },
            cell: (info) => {
                const study = info.row.original;
                return (
                    <span>-</span>
                )
            },
        },
        {
            accessorKey: 'action',
            header: () => <span>Action</span>,
            enableSorting: false,
            cell: info => <ActionColumn study={info.row.original} cell={info} addNotification={addNotification}/>,
        },
    ], [])

    const table: Table<Study> = useReactTable({
        data: studies,
        columns,
        state: {
            columnFilters: filters,
            sorting,
        },
        onSortingChange: setSorting,
        onColumnFiltersChange: setFilters,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        meta: {
            updateData: (rowIndex, columnId, value) => {
                setStudies(oldStudies =>
                    oldStudies?.map((row, index) => {
                        if (index === rowIndex) {
                            return {
                                ...oldStudies[rowIndex]!,
                                [columnId]: value,
                            }
                        }
                        return row
                    })
                )
            },
        },
    })

    return (
        <Box direction='column' className='mt-2'>
            {isLaunched && <StatusFilters table={table} className='my-2'/>}
            <table data-test-id="studies-table" className='w-100'>
                <thead css={{ height: 40 }}>
                    <tr>
                        {table.getFlatHeaders().map((header) =>
                            <TableHeader header={header} key={header.id} />
                        )}
                    </tr>
                </thead>
                <tbody>
                    {table.getRowModel().rows.map((row) =>
                        <StudyRow row={row} key={row.id} />
                    )}
                </tbody>
            </table>
            {!table.getRowModel().rows.length && <NoData/>}
        </Box>
    )
}
