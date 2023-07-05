import { Analysis, AnalysisRun } from '@api';
import { Box, cx, React, styled, useParams, useState } from '@common';
import { hasRunSucceeded, isRunUnderReview, runHasError, useFetchAnalysis } from '@models';
import {
    Button,
    Col,
    CollapsibleSection,
    ExitButton,
    Icon,
    LoadingAnimation,
    PageNotFound,
    StyledRow,
    TableHeader,
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
import { Modal } from '@nathanstitt/sundry/modal';
import { Link } from 'react-router-dom';

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

            {!!analysis.runs?.length && <RunsTable analysis={analysis}/>}

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
            <Box className='container-lg' align='center' justify='between'>
                <Link to={`/analysis/edit/${analysis.id}`}>
                    <Box align='center' gap='small'>
                        <Icon icon='chevronLeft'></Icon>
                        <span>Back</span>
                    </Box>
                </Link>
                <a
                    className="btn btn-primary btn-researcher-primary"
                    target="kinetic-workspaces-editor"
                    href={`https://workspaces.kinetic.sandbox.openstax.org/editor/#${analysis.id}`}
                >
                    Open R Studio
                </a>
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
                        <div>
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

const StyledLabel = styled.span({
    borderRadius: 20,
    padding: '4px 12px',
    color: colors.grayerText,
})

export const RunStatus: FC<{analysisRun: AnalysisRun}> = ({ analysisRun }) => {
    const [showErrorModal, setShowErrorModal] = useState(false)
    if (isRunUnderReview(analysisRun)) {
        return (
            <Box gap align='center'>
                <StyledLabel css={{ color: '#6B38A8', backgroundColor: '#EADDFB' }}>Under Review</StyledLabel>
                <StatusIcon height={24} icon='info' tooltip='Review takes on average 1 to 2 business days' />
            </Box>
        )
    }

    if (runHasError(analysisRun)) {
        return (
            <Box gap align='center'>
                <StyledLabel css={{ color: '#D4450C', backgroundColor: '#F8D5CD' }}>Error</StyledLabel>
                <StatusIcon height={24} icon='tripleDot' />
                <ErrorLog run={analysisRun} show={showErrorModal} setShow={setShowErrorModal}/>
            </Box>
        )
    }

    if (hasRunSucceeded(analysisRun)) {
        return <StyledLabel css={{ color: '#1A654E', backgroundColor: '#C8EAD2' }}>Results Available</StyledLabel>
    }

    return <StyledLabel css={{ backgroundColor: '#F6DBED' }}>Draft</StyledLabel>
}

const ErrorLog: FC<{
    run: AnalysisRun,
    show: boolean,
    setShow: Function
}> = ({ run, show, setShow }) => {
    return (
        <Modal center show={show} large onHide={() => setShow(false)}>
            <Modal.Body>
                <Box padding='4rem' align='center' justify='center' direction='column' gap='large'>
                    {/*TODO Figure out how to get error log?*/}

                    {/*{run.messages.map(message => {*/}
                    {/*    */}
                    {/*})}*/}
                </Box>
            </Modal.Body>
        </Modal>
    )
}

const StatusIcon = styled(Icon)({
    backgroundColor: colors.lightGray,
    borderRadius: 25,
    padding: 2,
    color: colors.white,
    cursor: 'pointer',
})

const useRunsTable = (analysis: Analysis) => {
    const [sorting, setSorting] = React.useState<SortingState>([{
        id: 'startedAt',
        desc: true,
    }])
    const columns = React.useMemo<ColumnDef<AnalysisRun>[]>(() => [
        {
            accessorKey: 'startedAt',
            header: () => 'Created on',
            sortingFn: 'datetime',
            cell: (info) => {
                return (
                    <span>
                        {toDayJS(info.getValue() as Date).format('MM/DD/YYYY hh:mm:ss A')}
                    </span>
                )
            },
        },
        {
            accessorKey: 'message',
            header: () => 'Commit message',
            minSize: 400,
            enableSorting: false,
            cell: (info) => info.getValue(),
        },
        {
            accessorKey: 'status',
            header: () => 'Status',
            accessorFn: (originalRow) => {
                if (isRunUnderReview(originalRow)) {
                    return 'Under Review'
                }
                if (runHasError(originalRow)) {
                    return 'Error'
                }
                return 'Results Ready'
            },
            meta: { type: 'text' },
            cell: (info) => <RunStatus analysisRun={info.row.original}/>,
        },
        {
            id: 'actions',
            header: () => 'Action',
            enableSorting: false,
            cell: ({ row }) => {
                const canDownload = hasRunSucceeded(row.original)
                return (
                    // TODO download URLs @nathan?
                    <Box gap='medium'>
                        <ActionLink link disabled={!canDownload} onClick={() => {}}>
                            Download Results
                        </ActionLink>
                        <ActionLink link onClick={() => {}}>
                            Download Script
                        </ActionLink>
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

const ActionLink = styled(Button)({
    padding: 'unset',
})
