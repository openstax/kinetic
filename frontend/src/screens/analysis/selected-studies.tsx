import { React, styled, useCallback, useEffect, useState } from '@common'
import { Box, Icon, ResearcherCheckbox, SelectField, TableHeader, useFormContext } from '@components'
import { Study, StudyAnalysis } from '@api'
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel, getSortedRowModel, PaginationState,
    Row,
    RowData, SortingState,
    Table,
    useReactTable,
} from '@tanstack/react-table';
import { colors } from '@theme';
import { uniqueId } from 'lodash-es';
import { studyCategories, studyTopics } from '@models';

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
            <table data-testid="studies-table" className='w-100 flex-grow-1' >
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

const Table = styled.table({

})

const TBody = styled.tbody({

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

const useStudyTable = (studies: Study[], defaultStudy: Study | null) => {
    const [selectedIds, setSelectedIds] = useState(defaultStudy ? [defaultStudy.id] : [])
    const [rowSelection, setRowSelection] = React.useState({})
    const [globalFilter, setGlobalFilter] = React.useState('')
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [pagination, setPagination] = React.useState<PaginationState>({
        pageSize: 8,
        pageIndex: 0,
    })

    const { setValue, getValues, register, watch } = useFormContext()
    console.log(watch('studies'))
    // console.log(selectedIds)
    const columns = React.useMemo<ColumnDef<Study>[]>(() => [
        {
            id: 'select',
            header: () => <></>,
            size: 20,
            cell: ({ row, table }) => {
                const study = row.original
                return (
                    <div>
                        <input type='checkbox'
                            key={study.id}
                            {...register(`studies`)}
                            // defaultChecked={study.id == defaultStudy?.id}
                            checked={row.getIsSelected()}
                            value={study.id}
                            data-index={row.index}
                            onChange={(event) => {
                                const studyId = Number(event.target.value)
                                row.getToggleSelectedHandler()(event)
                                // if (event.target.checked) {
                                //     setSelectedIds(old => [...old, studyId])
                                // } else {
                                //     setSelectedIds(old => old.filter(id => id != studyId))
                                // }
                                // setValue('studies', selectedIds)

                                // debugger
                                // setValue('studies', Object.keys(rowSelection))
                            }}
                        />
                    </div>
                )
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
        onRowSelectionChange: (selectionState) => {
            console.log(selectionState)
            return setRowSelection(selectionState)
        },
        onSortingChange: setSorting,
        onPaginationChange: (updaterOrValue) => {
            // setValue('studies', Object.keys(rowSelection))
            setPagination(updaterOrValue)
        },
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    })

    return { table }
}

const PaginationContainer: FC<{table: Table<Study>}> = ({ table }) => {
    return (
        <Box align='center' justify='center' className='mt-2'>
            <Icon
                icon='chevronLeft'
                onClick={() => table.previousPage()}
                disabled={table.getCanPreviousPage()}
                className='cursor-pointer'
            />


            <Icon
                icon='chevronRight'
                onClick={() => table.nextPage()}
                disabled={table.getCanNextPage()}
                className='cursor-pointer'
            />
        </Box>
    )
}
