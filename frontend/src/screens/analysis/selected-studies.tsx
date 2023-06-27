import { React, styled, useEffect } from '@common'
import { Box, Icon, SelectField, TableHeader, useFormContext } from '@components'
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
} from '@tanstack/react-table';
import { colors } from '@theme';
import { studyCategories } from '@models';

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

const StudyTypeFilter: FC<{table: Table<Study>}> = ({ table }) => {
    return (
        <Box gap='large' align='center'>
            <span>Show</span>
            <div css={{ width: 300 }}>
                <SelectField
                    name="category"
                    isClearable
                    placeholder="Study Type"
                    options={studyCategories.map(s => ({ value: s, label: s }))}
                    onChange={(value) => table.getColumn('category')?.setFilterValue(value)}
                />
            </div>
        </Box>
    )
}

const StyledRow = styled.tr({
    borderBottom: `1px solid ${colors.lightGray}`,
    'td': {
        padding: '1rem .5rem',
        height: '10px',
    },
})

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
            header: () => <></>,
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
                return (
                    info.getValue()
                )
            },
        },
        {
            accessorKey: 'targetSampleSize',
            header: () => 'Sample Size',
            sortingFn: 'alphanumeric',
            cell: (info) => {
                return (
                    <span>
                        {(info.cell.getValue() as string) || 'N/A'}
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
            cell: (info) => {
                // TODO Figure out research team
                return (
                    info.getValue()
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
        pageCount: Math.ceil(studies.length / pagination.pageSize),
        enableRowSelection: true,
        onRowSelectionChange: setRowSelection,
        onSortingChange: setSorting,
        onPaginationChange: setPagination,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    })

    return { table }
}

const PaginationContainer: FC<{table: Table<Study>}> = ({ table }) => {
    const currentPage = table.getState().pagination.pageIndex
    const pages = [...Array(table.getPageCount()).keys()]
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
