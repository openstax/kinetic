import { React, styled, useCallback, useEffect, useState } from '@common'
import { Box, Icon, TableHeader, useFormContext } from '@components'
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

declare module '@tanstack/table-core' {
    // eslint-disable-next-line no-unused-vars,@typescript-eslint/no-unused-vars
    interface ColumnMeta<TData extends RowData, TValue> {
        type: string
    }
}

export const SelectedStudies: FC<{studies: Study[], defaultStudy: Study | null}> = ({ studies, defaultStudy }) => {
    const { table } = useStudyTable(studies, defaultStudy)
    const { setValue } = useFormContext()
    // useEffect(() => {
    //     if (defaultStudy) {
    //         setValue('studies', [defaultStudy.id])
    //     }
    // }, [defaultStudy])

    return (
        <Box direction="column" justify='between' gap css={{ height: 420 }}>
            <h6>{table.getSelectedRowModel().flatRows.length} selected</h6>
            <table data-testid="studies-table" className='w-100 flex-grow-1' >
                <thead css={{ height: 40 }}>
                    <tr>
                        {table.getFlatHeaders().map((header) =>
                            <TableHeader header={header} key={header.id} />
                        )}
                    </tr>
                </thead>
                <tbody css={{ maxHeight: '1rem', overflow: 'auto' }}>
                    {table.getRowModel().rows.map((row) => {
                        return <StudyRow row={row} key={row.id} />
                    })}
                </tbody>
            </table>
            <PaginationContainer table={table} />
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

const useStudyTable = (studies: Study[], defaultStudy: Study | null) => {
    const [ids, setIds] = useState([])
    const [rowSelection, setRowSelection] = React.useState({})
    const [globalFilter, setGlobalFilter] = React.useState('')
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [pagination, setPagination] = React.useState<PaginationState>({
        pageSize: 5,
        pageIndex: 0,
    })
    console.log(rowSelection)

    const { setValue, getValues, register, watch } = useFormContext()
    console.log(watch('studies'))

    // const onChange = useCallback((ev: React.ChangeEvent<HTMLInputElement>) => {
    //     const studyId = Number(ev.target.value)
    //     if (ev.target.checked) {
    //         setValue('studies', [...getValues('studies'), { studyId: studyId }])
    //     } else {
    //         setValue('studies', getValues('studies').filter((s: Study) => s.id != studyId))
    //     }
    // }, [])

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
                            {...register(`studies`, { shouldUnregister: false })}
                            // onChange={onChange}
                            // defaultChecked={study.id == defaultStudy?.id}
                            checked={row.getIsSelected()}
                            value={study.id}
                            data-index={row.index}
                            onChange={(event) => {
                                console.log(table.getSelectedRowModel())
                                row.getToggleSelectedHandler()(event)
                                console.log(table.getSelectedRowModel())

                                // debugger
                                setValue('studies', Object.keys(rowSelection))
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
        onRowSelectionChange: setRowSelection,
        onSortingChange: setSorting,
        onPaginationChange: (updaterOrValue) => {
            setValue('studies', Object.keys(rowSelection))
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
