import { cx, React, styled, Box } from '@common';
import { colors } from '@theme';
import { flexRender, Header } from '@tanstack/react-table';
import { Study } from '@api';
import AtoZ from '../../images/icons/atoz.png';
import ZtoA from '../../images/icons/ztoa.png';
import AZDefault from '../../images/icons/azdefault.png';
import SortUp from '../../images/icons/sortup.png';
import SortDown from '../../images/icons/sortdown.png';
import SortDefault from '../../images/icons/sort.png';

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

export const StyledRow = styled.tr({
    borderBottom: `1px solid ${colors.lightGray}`,
    'td': {
        padding: '1rem .5rem',
        height: '10px',
    },
})
