import { Analysis, AnalysisRun } from '@api';
import { Box, cx, React, styled, useParams, useState } from '@common';
import { useFetchAnalysis } from '@models';
import {
    Col,
    CollapsibleSection,
    ExitButton,
    LoadingAnimation,
    PageNotFound,
    StyledRow,
    TableHeader,
    Button,
} from '@components';
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getSortedRowModel,
    Row,
    SortingState,
    Table,
    useReactTable,
} from '@tanstack/react-table';
import { toDayJS } from '@lib';
import { colors } from '@theme';
import { ResearcherFAQContent } from './researcher-faq';

export const AnalysisOverview: FC<{analyses: Analysis[]}> = () => {
    const { analysisId } = useParams<string>();
    const { data: analysis, isLoading } = useFetchAnalysis(Number(analysisId))
    if (isLoading) return <LoadingAnimation />
    if (!analysis) return <PageNotFound name='analysis' />

    return (
        <Col className='analysis-overview' sm={12} gap='xlarge'>
            <Box align='center' justify='between' >
                <h3>{analysis?.title}</h3>
                <ExitButton navTo='/analysis'/>
            </Box>

            {analysis.runs?.length && <RunsTable analysis={analysis}/>}

            <CollapsibleSection title='Help Materials' open={!analysis.runs?.length}>
                <HelpMaterials />
            </CollapsibleSection>

            <BottomBar analysis={analysis}/>
        </Col>
    )
}

const HelpTabs = styled.ul({
    padding: '1rem 0',
    border: 'none',
    '.nav-link': {
        border: 'none',
        padding: '0',
        paddingRight: '2.5rem',
    },
    'h6': {
        color: colors.grayText,
        fontWeight: 'bolder',
    },
    '.active > h6': {
        color: colors.kineticResearcher,
        paddingBottom: '.5rem',
        borderBottom: `4px solid ${colors.kineticResearcher}`,
    },
})


const HelpMaterials = () => {
    const [currentTab, setCurrentTab] = useState('Steps')

    return (
        <Box direction='column' >
            <HelpTabs className="nav nav-tabs" role="tablist">
                <li className="nav-item" role="presentation">
                    <a href="#"
                        id="steps-tab"
                        onClick={() => setCurrentTab('Steps')}
                        className={cx('nav-link', { active: currentTab == 'Steps' })}
                        data-bs-toggle="tab"
                        data-bs-target="#steps"
                        role="tab"
                        aria-controls="steps"
                        aria-selected={currentTab == 'Steps'}
                    >
                        <h6>Steps Overview</h6>
                    </a>
                </li>
                <li className="nav-item" role="presentation">
                    <a href="#"
                        id="tutorial-tab"
                        onClick={() => setCurrentTab('Tutorial')}
                        className={cx('nav-link', { active: currentTab == 'Tutorial' })}
                        data-bs-toggle="tab"
                        data-bs-target="#tutorial"
                        role="tab"
                        aria-controls="tutorial"
                        aria-selected={currentTab == 'Tutorial'}
                    >
                        <h6>Tutorial Video & Guide</h6>
                    </a>
                </li>
                <li className="nav-item" role="presentation">
                    <a href="#"
                        id="faq-tab"
                        onClick={() => setCurrentTab('FAQ')}
                        className={cx('nav-link', { active: currentTab == 'FAQ' })}
                        data-bs-toggle="tab"
                        data-bs-target="#faq"
                        role="tab"
                        aria-controls="faq"
                        aria-selected={currentTab == 'FAQ'}
                    >
                        <h6>Frequently Asked Questions</h6>
                    </a>
                </li>
            </HelpTabs>
            <div className="tab-content">
                <div className={cx('tab-pane', { active: currentTab == 'Steps' })}
                    id="steps"
                    role="tabpanel"
                    aria-labelledby="steps-tab"
                >
                    <ol>
                        <li>Once you click  ‘Open R Studio’, you will see the R Studio environment, running R 4.3.1, open in a new tab in your browser containing all the datasets that you've previously selected for analysis. This environment will come with a host of pre-installed packages (e.g., tidyverse; lme4), and more. You can always install other packages that you need into your workspace.</li>
                        <li>When landing on R Studio, you will see a simulated dataset (synthetic data) that was carefully crafted based on each of the studies you have just now chosen to analyze.</li>
                        <li>Against this simulated dataset, you will be able to write your intended script for data analysis.</li>
                        <li>Any analytic code that you create will persist in this environment even once you close out. You can always come back to your script.</li>
                        <li>Once you click ‘Submit Analysis’ on the top right-hand corner of the page, your script will be sent to the Kinetic team for review.</li>
                        <li>Your script will then be exposed to real data to collect your intended analysis, and return aggregate knowledge back to you.</li>
                        <li>If you find that you’d want to edit your script after submission, simply open RStudio and submit another run of your script with the intended changes.</li>
                    </ol>
                </div>
                <div
                    className={cx('tab-pane', { active: currentTab == 'Tutorial' })}
                    id="Tutorial"
                    role="tabpanel"
                    aria-labelledby="profile-tab"
                >
                    TODO @Debshila
                </div>
                <div className={cx('tab-pane', { active: currentTab == 'FAQ' })}
                    id="FAQ"
                    role="tabpanel"
                    aria-labelledby="faq-tab"
                >
                    <ResearcherFAQContent />
                </div>
            </div>
        </Box>
    )
}

const BottomBar: FC<{analysis: Analysis}> = ({ analysis }) => {
    return (
        <Box className='fixed-bottom bg-white mt-auto' css={{ minHeight: 80, boxShadow: `0px -3px 10px rgba(219, 219, 219, 0.5)` }}>
            <Box className='container-lg' align='center' justify='end'>
                <a
                    className="btn btn-primary btn-researcher-primary"
                    target="kinetic-workspaces-editor"
                    href={`https://workspaces.kinetic.sandbox.openstax.org/editor/#${analysis.id}`}
                >Open R Studio</a>
            </Box>
        </Box>
    )
}

const AnalysisRunRow: React.FC<{row: Row<AnalysisRun> }> = ({ row }) => {
    return (
        <StyledRow key={row.id} data-testid={`analysis-run-row-${row.original.id}`}>
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

const RunsTable: FC<{analysis: Analysis}> = ({ analysis }) => {
    const { table } = useRunsTable(analysis)

    if (!analysis.runs?.length) return null

    return (
        <Box direction='column'>
            <table data-testid="analysis-runs-table" className='mt-2'>
                <thead>
                    <tr>
                        {table.getFlatHeaders().map((header) =>
                            <TableHeader header={header} key={header.id} />
                        )}
                    </tr>
                </thead>
                <tbody>
                    {table.getRowModel().rows.map((row) => {
                        return <AnalysisRunRow row={row} key={row.id} />
                    })}
                </tbody>
            </table>
        </Box>
    )
}

const useRunsTable = (analysis: Analysis) => {
    const [sorting, setSorting] = React.useState<SortingState>([])

    const columns = React.useMemo<ColumnDef<AnalysisRun>[]>(() => [
        {
            accessorKey: 'startedAt',
            header: () => 'Created on',
            sortingFn: 'datetime',
            cell: (info) => {
                // TODO @Iris formatting?
                return (
                    <span>
                        {toDayJS(info.getValue() as Date).format('MM/DD/YYYY HH:mm:ss')}
                    </span>
                )
            },
        },
        {
            accessorKey: 'finishedAt',
            header: () => (
                <span>Last run on</span>
            ),
            sortingFn: 'datetime',
            cell: (info) => {
                const finishedAt = info.getValue() as Date
                if (!finishedAt) return '-'

                return (
                    <span>
                        {toDayJS(finishedAt).format('MM/DD/YYYY')}
                    </span>
                )
            },
        },
        {
            accessorKey: 'status',
            header: () => 'Last run status',
            meta: { type: 'text' },
            cell: (info) => {
                return (
                    info.getValue()
                )
            },
        },
        {
            id: 'actions',
            header: () => 'Action',
            enableSorting: false,
            cell: ({ row }) => {
                return (
                    <Box gap='large'>
                        <a href='#'>Download Results</a>
                        <a href='#'>Download Script</a>
                    </Box>
                )
            },
        },
    ], [])

    const table: Table<AnalysisRun> = useReactTable({
        data: analysis.runs || [],
        columns,
        state: {
            sorting,
        },
        getRowId: (row) => String(row.id),
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
    })

    return { table }
}
