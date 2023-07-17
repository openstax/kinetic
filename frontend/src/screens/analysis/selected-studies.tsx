import { React, useEffect } from '@common'
import { Box, Icon, SelectField, StyledRow, TableHeader, Tooltip, useFormContext } from '@components'
import { Study } from '@api'
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    PaginationState,
    Row,
    RowData,
    RowSelectionState,
    SortingState,
    Table,
    useReactTable,
} from '@tanstack/react-table'
import { colors } from '@theme'
import { studyCategories, StudyCategory, studyCategoryDescriptions } from '@models'
import { components } from 'react-select'
import { useCurrentResearcher } from '@lib';
import { useRefElement } from 'rooks';
import { difference } from 'lodash-es';

declare module '@tanstack/table-core' {
    // eslint-disable-next-line no-unused-vars,@typescript-eslint/no-unused-vars
    interface ColumnMeta<TData extends RowData, TValue> {
        type: string
    }
}

export const SelectedStudies: FC<{studies: Study[]}> = ({ studies }) => {
    const { table } = useStudyTable(studies)

    return (
        <Box direction="column" justify='between' gap className='mt-3'>
            <StudyTypeFilter table={table} />
            <h6>{table.getSelectedRowModel().flatRows.length} selected</h6>
            <table data-testid="studies-table">
                <thead>
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
            <PaginationContainer table={table} />
        </Box>
    )
}

const CustomOption = (props: any) => {
    const category: StudyCategory = props.value
    const description = studyCategoryDescriptions[category]
    return (
        <components.Option {...props} className='p-1'>
            <Box direction='column' gap>
                <span className='fw-bold'>{category}</span>
                <small>{description}</small>
            </Box>
        </components.Option>
    )
}

const StudyTypeFilter: FC<{table: Table<Study>}> = ({ table }) => {
    return (
        <Box gap='large' align='center' className='mb-1'>
            <span>Filter by:</span>
            <div css={{ width: '25rem' }}>
                <SelectField
                    name="category"
                    isClearable
                    components={{ Option: CustomOption }}
                    placeholder="Study Type"
                    options={studyCategories.map(s => ({ value: s, label: s }))}
                    onChange={(value) => table.getColumn('category')?.setFilterValue(value)}
                />
            </div>
        </Box>
    )
}

const StudyRow: React.FC<{row: Row<Study> }> = ({ row }) => {
    return (
        <StyledRow key={row.id} data-testid={`study-row-${row.original.id}`}>
            {row.getVisibleCells().map((cell) => {
                return (
                    <td key={cell.id} css={{
                        maxWidth: cell.column.getSize(),
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

const SelectionCheckbox: React.FC<{ studyId: number, row: Row<Study> }> = ({ studyId, row }) => {
    const { setValue, watch } = useFormContext()
    const selectedIds = watch('studyIds') || []

    const onChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
        let updatedIds: number[]
        if (ev.target.checked) {
            updatedIds = [...selectedIds, studyId]
        } else {
            updatedIds = selectedIds.filter((id: number) => id != studyId)
        }
        setValue('studyIds', updatedIds, { shouldValidate: true })
        row.getToggleSelectedHandler()(ev)
    }

    return (
        <input type='checkbox'
            key={studyId}
            className='select-study-checkbox'
            data-index={row.index}
            data-test-id={`${studyId}-checkbox`}
            onChange={onChange}
            checked={selectedIds.includes(studyId)}
        />
    )
}

const useStudyTable = (studies: Study[]) => {
    const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({})
    const [sorting, setSorting] = React.useState<SortingState>([
        { id: 'select', desc: true },
        { id: 'researchTeam', desc: true },
    ])
    const [pagination, setPagination] = React.useState<PaginationState>({
        pageSize: 8,
        pageIndex: 0,
    })

    const { setValue, getValues, watch } = useFormContext()

    const currentResearcher = useCurrentResearcher()
    const [setCheckAll, checkAll] = useRefElement<HTMLInputElement>()
    const selectedIds = watch('studyIds')

    useEffect(() => {
        if (selectedIds?.length) {
            const selectionMap = selectedIds.reduce((map: Record<string, boolean>, id: string) => {
                map[id] = true;
                return map;
            }, {});

            setRowSelection(selectionMap)
        }

    }, [selectedIds])

    const columns = React.useMemo<ColumnDef<Study>[]>(() => [
        {
            id: 'select',
            header: () => (
                <input type='checkbox'
                    ref={setCheckAll}
                    checked={table.getIsAllPageRowsSelected()}
                    onChange={(event) => {
                        const currentlySelectedStudyIds = getValues('studyIds')
                        const currentPageIds = table.getPaginationRowModel().rows.map(row => row.original.id)
                        if (event.target.checked) {
                            setValue('studyIds', [...currentlySelectedStudyIds, ...currentPageIds], { shouldValidate: true })
                        } else {
                            setValue('studyIds', difference(currentlySelectedStudyIds, currentPageIds), { shouldValidate: true })
                        }
                        table.getToggleAllPageRowsSelectedHandler()(event)
                    }}
                />
            ),
            accessorFn: (originalRow) => {
                const selectedStudyIds = getValues('studyIds')
                if (!selectedStudyIds) {
                    return null
                }
                return selectedStudyIds.includes(originalRow.id)
            },
            size: 20,
            cell: ({ row }) => {
                return (
                    <Box justify='center'>
                        <SelectionCheckbox studyId={row.original.id} row={row} />
                    </Box>
                )
            },
        },
        {
            accessorKey: 'titleForResearchers',
            header: () => 'Title',
            size: 500,
            meta: { type: 'text' },
            cell: (info) => {
                const value = info.getValue() as string
                return (
                    <Box justify='between' css={{ paddingRight: '1rem' }} gap='large'>
                        <span css={{ textOverflow: 'ellipsis', overflow: 'hidden' }}>
                            {value}
                        </span>
                        <Icon height={24}
                            className='cursor-pointer'
                            color={colors.lightGray}
                            icon='infoCircleFill'
                            tooltip={info.row.original.internalDescription}
                        />
                    </Box>
                )
            },
        },
        {
            accessorKey: 'completedCount',
            header: () => (
                <Box gap>
                    <span>Sample Size</span>
                    <Tooltip tooltip='Total number of study completions' className='d-flex'>
                        <Icon css={{ color: colors.tooltipBlue }} icon='questionCircleFill' height={14}/>
                    </Tooltip>
                </Box>
            ),
            sortingFn: 'alphanumeric',
            cell: (info) => {
                return (
                    <Box align='center' justify='center'>
                        {(info.cell.getValue() as string) || '-'}
                    </Box>
                )
            },
        },
        {
            accessorKey: 'category',
            header: () => 'Study Type',
            size: 220,
            meta: { type: 'text' },
            cell: (info) => info.getValue(),
        },
        {
            id: 'researchTeam',
            header: () => 'Research Team',
            meta: { type: 'text' },
            accessorFn: (originalRow) => {
                const isMyStudy = !!originalRow.researchers?.find(r => r.userId == currentResearcher?.userId)
                return (
                    isMyStudy ? 'Your Team' : 'Shared on Kinetic'
                )
            },
            cell: ({ row, column }) => row.getValue(column.id),
        },
    ], [])

    const table: Table<Study> = useReactTable({
        debugTable: true,
        data: studies,
        columns,
        state: {
            rowSelection,
            sorting,
            pagination,
        },
        enableMultiSort: true,
        getRowId: (row) => String(row.id),
        enableRowSelection: true,
        onRowSelectionChange: setRowSelection,
        onSortingChange: setSorting,
        onPaginationChange: setPagination,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    })

    useEffect(() => {
        if (checkAll) {
            checkAll.indeterminate = table.getIsSomePageRowsSelected()
        }
    }, [checkAll, table.getSelectedRowModel().rows, pagination])

    return { table }
}

const PaginationContainer: FC<{table: Table<Study>}> = ({ table }) => {
    const currentPage = table.getState().pagination.pageIndex
    const pages = [...Array(table.getPageCount()).keys()]

    if (!table.getPaginationRowModel().rows.length) {
        return null
    }

    return (
        <Box align='center' justify='center' className='mt-2' gap='large'>
            <Icon
                icon='chevronLeft'
                height={24}
                onClick={() => table.previousPage()}
                disabled={table.getCanPreviousPage()}
                className='cursor-pointer'
            />

            <Box gap>
                {pages.map((page: number) => {
                    if (currentPage == page) {
                        return (
                            <Box justify='center'
                                key={page}
                                css={{
                                    backgroundColor: colors.kineticResearcher,
                                    color: colors.white,
                                    width: 25,
                                }}>
                                <span>{page + 1}</span>
                            </Box>
                        )
                    }
                    return (
                        <Box key={page} justify='center' width='25px' className='cursor-pointer' onClick={() => table.setPageIndex(page)}>
                            <span>{page + 1}</span>
                        </Box>
                    )
                })}
            </Box>

            <Icon
                icon='chevronRight'
                height={24}
                onClick={() => table.nextPage()}
                disabled={table.getCanNextPage()}
                className='cursor-pointer'
            />
        </Box>
    )
}
