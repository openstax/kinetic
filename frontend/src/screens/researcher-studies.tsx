import { cx, React, styled, useEffect, useNavigate, useState } from '@common'
import { Studies, Study } from '@api'
import { Box, Button, Icon, TopNavBar } from '@components'
import { toDayJS, useApi } from '@lib'
import { getStatus, StudyStatus } from '@models'
import { colors } from '../theme';
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
import { Tooltip } from '@nathanstitt/sundry';
import { Link } from 'react-router-dom';
import AtoZ from '../images/icons/atoz.png'
import ZtoA from '../images/icons/ztoa.png'
import AtoZDefault from '../images/icons/atozdefault.png'
import SortDefault from '../images/icons/sort.png'
import SortUp from '../images/icons/sortup.png'
import SortDown from '../images/icons/sortdown.png'
import 'bootstrap/js/dist/dropdown'

declare module '@tanstack/table-core' {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    interface ColumnMeta<TData extends RowData, TValue> {
        type: string
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
                    <td key={cell.id}>
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

const Actions = styled(Box)({
    'svg': {
        cursor: 'pointer',
    },
})

const ActionColumn: React.FC<{study: Study}> = ({ study }) => {
    return (
        <Actions gap='xlarge' justify='center' align='center'>
            <div>
                <Icon icon="pencilFill" height={20} color={colors.purple}/>
            </div>
            {/*conditional pause or play*/}
            <div>
                <Icon icon="playFill" height={20} color={colors.purple}/>
            </div>
            <div>
                <Icon
                    icon="tripleDotVertical"
                    height={20}
                    id="action-menu-button"
                    className='dropdown-toggle'
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                />
                <ul className="dropdown-menu" aria-labelledby="action-menu-button">
                    <li>
                        <a className="dropdown-item" href="#">Edit Study</a>
                    </li>
                    <li>
                        <a className="dropdown-item" href="#" css={{ color: colors.red }}>Delete</a>
                    </li>
                </ul>
            </div>
        </Actions>
    )
}

const StudiesTable: React.FC<{ studies: Study[], isLaunched: boolean }> = ({ studies, isLaunched }) => {
    const columns = React.useMemo<ColumnDef<Study, any>[]>(() => [
        {
            accessorKey: 'titleForResearchers',
            header: () => <span>Title</span>,
            size: 400,
            meta: {
                type: 'text',
            },
            cell: (info) => {
                const studyId = info.row.original.id;
                return (
                    <Link to={`/study/edit/${studyId}`} css={{ color: colors.purple }}>
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
            header: () => <span>Opens On</span>,
            cell: (info) => toDayJS(info.getValue() as Date).format('MM/DD/YYYY'),
        },
        {
            accessorKey: 'closesAt',
            header: () => <span>Closes On</span>,
            cell: (info) => toDayJS(info.getValue() as Date).format('MM/DD/YYYY'),
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
        },
        {
            accessorKey: 'takeRate',
            // TODO tooltip text: Participants who clicked ‘Begin Study’ / Total number of study previews
            header: () => <span>Take Rate</span>,
        },
        {
            accessorKey: 'action',
            header: () => <span>Action</span>,
            enableSorting: false,
            cell: info => <ActionColumn study={info.row.original} />,
        },
    ], [])

    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([
        { id: 'status', value: ['active', 'paused', 'scheduled'] },
    ]);

    const table: Table<Study> = useReactTable({
        data: studies,
        columns,
        state: {
            columnFilters,
            sorting,
        },
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
    })

    return (
        <Box direction='column' className='mt-2'>
            {isLaunched && <StatusFilters table={table} className='my-2'/>}
            <table data-test-id="studies-table" className='w-100'>
                {/* TODO Play with height ? */}
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

const NavTabs = styled.ul({
    padding: '1rem 0',
    border: 'none',
    '.nav-link': {
        border: 'none',
        padding: '0',
        paddingRight: '2.5rem',
    },
    'h4': {
        color: colors.grayText,
        fontWeight: 'bolder',
    },
    '.active > h4': {
        color: colors.purple,
        paddingBottom: '.5rem',
        borderBottom: `4px solid ${colors.purple}`,
    },
})

export default function ResearcherStudies() {
    const api = useApi()
    const nav = useNavigate()
    const [studies, setStudies] = useState<Studies>()
    useEffect(() => {
        api.getStudies().then(setStudies)
    }, [])
    const [currentStatus, setCurrentStudies] = useState<StudyStatus>(StudyStatus.Launched)
    const setStatus = (ev: React.MouseEvent<HTMLAnchorElement>) => setCurrentStudies(ev.currentTarget.dataset.status! as any)
    const displayingStudies = (studies?.data || []).filter(s => !s.isHidden && getStatus(s) == currentStatus)

    return (
        <div className="studies">
            <TopNavBar showBanner={false}/>
            {/* TODO Notifications */}
            {/*<ActionNotification />*/}
            <div className="container-lg mt-8">
                <Box align="center" justify="between">
                    <h3 className='fw-bold'>Studies</h3>
                    <Button
                        primary
                        data-test-id="add-study"
                        onClick={() => nav('/study/edit/new')}
                        className='fw-bold'
                    >
                        <Icon icon="plus" height={28}></Icon>
                        Create New Study
                    </Button>
                </Box>
                <NavTabs className="nav nav-tabs">
                    <li className="nav-item">
                        <a href="#" onClick={setStatus} data-status="Launched" className={cx('nav-link', { active: currentStatus == StudyStatus.Launched })}>
                            <h4>Launched</h4>
                        </a>
                    </li>
                    <li className="nav-item">
                        <a href="#" onClick={setStatus} data-status="Draft" className={cx('nav-link', { active: currentStatus == StudyStatus.Draft })}>
                            <h4>Draft</h4>
                        </a>
                    </li>
                    <li className="nav-item">
                        <a href="#" onClick={setStatus} data-status="Completed" className={cx('nav-link', { active: currentStatus == StudyStatus.Completed })}>
                            <h4>Completed</h4>
                        </a>
                    </li>
                </NavTabs>
                <StudiesTable studies={displayingStudies} isLaunched={currentStatus === StudyStatus.Launched}/>
            </div>
        </div>
    )
}

const ActionNotification = () => {
    return (
        <div aria-live="polite" aria-atomic="true" className="d-flex justify-content-center align-items-center w-100">
            <div className="toast" role="alert" aria-live="assertive" aria-atomic="true">
                <div className="toast-header">
                    <img src="..." className="rounded me-2" alt="..."/>
                    <strong className="me-auto">Bootstrap</strong>
                    <small>11 mins ago</small>
                    <button type="button" className="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
                </div>
                <div className="toast-body">
                    Hello, world! This is a toast message.
                </div>
            </div>
        </div>
    )
}
