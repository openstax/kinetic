import { React, styled, useEffect } from '@common'
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
    SortingState,
    Table,
    useReactTable,
} from '@tanstack/react-table'
import { colors } from '@theme'
import { studyCategories, StudyCategory, studyCategoryDescriptions } from '@models'
import { components } from 'react-select'
import { useCurrentResearcher } from '@lib';
import { useRefElement } from 'rooks';

declare module '@tanstack/table-core' {
    // eslint-disable-next-line no-unused-vars,@typescript-eslint/no-unused-vars
    interface ColumnMeta<TData extends RowData, TValue> {
        type: string
    }
}

export const SelectedStudies: FC<{studies: Study[], defaultStudy: Study | null}> = ({ studies, defaultStudy }) => {
    const { table } = useStudyTable(studies, defaultStudy)

    return (
        <Box direction="column" justify='between' gap>
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
        <Box gap='large' align='center'>
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
            data-index={row.index}
            onChange={onChange}
            checked={selectedIds.includes(studyId)}
        />
    )
}

const useStudyTable = (studies: Study[], defaultStudy: Study | null) => {
    const [rowSelection, setRowSelection] = React.useState({})
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [pagination, setPagination] = React.useState<PaginationState>({
        pageSize: 8,
        pageIndex: 0,
    })

    const { setValue } = useFormContext()

    const currentResearcher = useCurrentResearcher()
    const [setCheckAll, checkAll] = useRefElement<HTMLInputElement>()

    useEffect(() => {
        if (defaultStudy) {
            setRowSelection({
                [defaultStudy.id]: true,
            })
        }
    }, [defaultStudy])

    const columns = React.useMemo<ColumnDef<Study>[]>(() => [
        {
            id: 'select',
            header: () => (
                <input type='checkbox'
                    ref={setCheckAll}
                    checked={table.getIsAllRowsSelected()}
                    onChange={(event) => {
                        if (event.target.checked) {
                            const selectedStudyIds = table.getRowModel().rows.map(row => row.original.id)
                            setValue('studyIds', selectedStudyIds, { shouldValidate: true })
                        } else {
                            setValue('studyIds', [], { shouldValidate: true })
                        }
                        table.getToggleAllRowsSelectedHandler()(event)
                    }}
                />
            ),
            size: 20,
            cell: ({ row }) => {
                return <SelectionCheckbox studyId={row.original.id} row={row} />
            },
        },
        {
            accessorKey: 'titleForResearchers',
            header: () => 'Title',
            size: 350,
            meta: { type: 'text' },
            cell: (info) => {
                const value = info.getValue() as string
                return (
                    <Box justify='between' css={{ paddingRight: '2rem' }}>
                        <span>{value}</span>
                        <Icon height={20} color={colors.lightGray} icon='infoCircleFill' tooltip={info.row.original.internalDescription}></Icon>
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
    ], [defaultStudy])

    const table: Table<Study> = useReactTable({
        data: studies,
        columns,
        state: {
            rowSelection,
            sorting,
            pagination,
        },
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
            checkAll.indeterminate = table.getIsSomeRowsSelected()
        }
    }, [checkAll, table.getSelectedRowModel().rows])
    return { table }
}

const PaginationContainer: FC<{table: Table<Study>}> = ({ table }) => {
    const currentPage = table.getState().pagination.pageIndex
    const pages = [...Array(table.getPageCount()).keys()]

    if (!table.getFilteredRowModel().rows.length) {
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
