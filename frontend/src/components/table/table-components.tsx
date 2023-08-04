import { Box, cx, React, styled } from '@common';
import { colors } from '@theme';
import { flexRender, Header, Table } from '@tanstack/react-table';
import { Study } from '@api';
import AtoZ from '../../images/icons/atoz.png';
import ZtoA from '../../images/icons/ztoa.png';
import AZDefault from '../../images/icons/azdefault.png';
import SortUp from '../../images/icons/sortup.png';
import SortDown from '../../images/icons/sortdown.png';
import SortDefault from '../../images/icons/sort.png';
import { Icon } from '../icon';

export const StyledHeader = styled('th')({
    '.header-text': {
        fontWeight: 'bold',
        color: colors.grayText,
    },
    borderBottom: `3px solid ${colors.lightGray}`,
});

export const SortIcon: React.FC<{header: Header<Study, unknown> }> = ({ header }) => {
    if (header.column.columnDef.meta?.type == 'text') {
        return (
            <span>
                {{
                    asc: <img src={AtoZ} alt='A to Z'/>,
                    desc: <img src={ZtoA} alt='Z to A' />,
                    false: <img src={AZDefault} alt='AtoZDefault' />,
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

export const TableHeader: React.FC<{header: Header<any, unknown> }> = ({ header }) => {
    const isRowSelect = header.column.id == 'select'
    const canSort = header.column.getCanSort() && !isRowSelect
    return (
        <StyledHeader css={{ width: header.getSize() }}>
            <span
                onClick={() => canSort && header.column.toggleSorting()}
                className={cx('header-text', { 'cursor-pointer': canSort })}
            >
                <Box gap justify={isRowSelect ? 'center' : 'start'}>
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

export const StyledRow = styled.tr({
    borderBottom: `1px solid ${colors.lightGray}`,
    'td': {
        padding: '1rem .5rem',
        height: '10px',
    },
})

export const PaginationContainer: FC<{table: Table<any>}> = ({ table }) => {
    const currentPage = table.getState().pagination.pageIndex
    const pages = [...Array(table.getPageCount()).keys()]

    if (!table.getPaginationRowModel().rows.length || pages.length <= 1) {
        return null
    }

    return (
        <Box align='center' justify='center' className='mt-2' gap='large'>
            <Icon
                icon='chevronLeft'
                height={24}
                onClick={() => table.getCanPreviousPage() && table.previousPage()}
                disabled={!table.getCanPreviousPage()}
            />

            <Box gap>
                {pages.map((page: number) => {
                    if (currentPage == page) {
                        return (
                            <Box justify='center'
                                key={page}
                                width='20px'
                                css={{
                                    backgroundColor: colors.kineticResearcher,
                                    color: colors.white,
                                }}>
                                <span>{page + 1}</span>
                            </Box>
                        )
                    }
                    return (
                        <Box key={page} justify='center' width='20px' className='cursor-pointer' onClick={() => table.setPageIndex(page)}>
                            <span>{page + 1}</span>
                        </Box>
                    )
                })}
            </Box>

            <Icon
                icon='chevronRight'
                height={24}
                onClick={() => table.getCanNextPage() && table.nextPage()}
                disabled={!table.getCanNextPage()}
            />
        </Box>
    )
}
