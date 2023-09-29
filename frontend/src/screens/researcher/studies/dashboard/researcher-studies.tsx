import { cx, React, styled, useEffect, useNavigate, useState } from '@common'
import { Box, Page } from '@components'
import { StudyStatus } from '@models'
import { colors } from '@theme';
import 'bootstrap/js/dist/dropdown'
import { StudiesTable } from './studies-table';
import { ColumnFiltersState } from '@tanstack/react-table';
import { StudyStatusEnum } from '@api';
import { useSearchParams } from 'react-router-dom';
import { Button } from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';

const NavTabs = styled.ul({
    padding: '1rem 0',
    border: 'none',
    '.nav-link': {
        border: 'none',
        padding: '0',
        paddingRight: '2.5rem',
    },
    'h4': {
        color: colors.text,
        fontWeight: 'bolder',
    },
    '.active > h4': {
        color: colors.blue,
        paddingBottom: '.5rem',
        borderBottom: `4px solid ${colors.blue}`,
    },
})

export default function ResearcherStudies() {
    const nav = useNavigate()
    let [searchParams, setSearchParams] = useSearchParams();
    const [currentStatus, setCurrentStatus] = useState<StudyStatus>(StudyStatus.Launched)
    const [filters, setFilters] = useState<ColumnFiltersState>([
        { id: 'status', value: ['active', 'paused', 'scheduled'] },
    ])

    const setStatus = (status: StudyStatus) => {
        setCurrentStatus(status)
        setSearchParams({ status: status })
        switch (status) {
            case StudyStatus.Completed:
                setFilters([{ id: 'status', value: [StudyStatusEnum.Completed] }])
                break
            case StudyStatus.Draft:
                setFilters([{ id: 'status', value: [StudyStatusEnum.Draft, StudyStatusEnum.WaitingPeriod, StudyStatusEnum.ReadyForLaunch] }])
                break
            case StudyStatus.Launched:
                setFilters([{ id: 'status', value: [StudyStatusEnum.Active, StudyStatusEnum.Paused, StudyStatusEnum.Scheduled] }])
                break
        }
    }

    const onStatusChange = (ev: React.MouseEvent<HTMLAnchorElement>) => {
        const status = ev.currentTarget.dataset.status! as StudyStatus
        setStatus(status)
    }

    useEffect(() => {
        let initialStatus = searchParams.get('status') as StudyStatus || StudyStatus.Launched
        if (initialStatus in StudyStatus) {
            setStatus(initialStatus)
        }
    }, [searchParams])

    return (
        <Page className='studies-dashboard' hideFooter>
            <Box align="center" justify="between">
                <h3 className='fw-bold' data-testid='studies-table-header'>
                    Studies
                </h3>
                <Button
                    color='blue'
                    data-testid="add-study"
                    onClick={() => nav('/study/create')}
                    leftIcon={<IconPlus />}
                >
                    Create New Study
                </Button>
            </Box>
            <NavTabs className="nav nav-tabs">
                <li className="nav-item">
                    <a data-target='#' onClick={onStatusChange} data-status="Launched" className={cx('nav-link cursor-pointer', { active: currentStatus == StudyStatus.Launched })}>
                        <h4>Launched</h4>
                    </a>
                </li>
                <li className="nav-item">
                    <a data-target='#' onClick={onStatusChange} data-status="Draft" className={cx('nav-link cursor-pointer', { active: currentStatus == StudyStatus.Draft })}>
                        <h4>Draft</h4>
                    </a>
                </li>
                <li className="nav-item">
                    <a data-target='#' onClick={onStatusChange} data-status="Completed" className={cx('nav-link cursor-pointer', { active: currentStatus == StudyStatus.Completed })}>
                        <h4>Completed</h4>
                    </a>
                </li>
            </NavTabs>
            <StudiesTable
                filters={filters}
                setFilters={setFilters}
                currentStatus={currentStatus}
            />

        </Page>
    )
}
