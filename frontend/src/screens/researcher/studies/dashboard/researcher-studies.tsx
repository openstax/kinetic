import { cx, React, styled, useNavigate, useState } from '@common'
import { Box, Button, Icon, Page } from '@components'
import { StudyStatus } from '@models'
import { colors } from '@theme';
import 'bootstrap/js/dist/dropdown'
import { StudiesTable } from './studies-table';
import { ColumnFiltersState } from '@tanstack/react-table';
import { StudyStatusEnum } from '@api';

const NavTabs = styled.ul({
    padding: '1rem 0',
    border: 'none',
    '.nav-link': {
        border: 'none',
        padding: '0',
        paddingRight: '2.5rem',
    },
    'h4': {
        color: colors.grayText,
        fontWeight: 'bolder',
    },
    '.active > h4': {
        color: colors.purple,
        paddingBottom: '.5rem',
        borderBottom: `4px solid ${colors.purple}`,
    },
})

export default function ResearcherStudies() {
    const nav = useNavigate()
    const [currentStatus, setCurrentStatus] = useState<StudyStatus>(StudyStatus.Launched)
    const [filters, setFilters] = useState<ColumnFiltersState>([
        { id: 'status', value: ['active', 'paused', 'scheduled'] },
    ])

    const setStatus = (ev: React.MouseEvent<HTMLAnchorElement>) => {
        const status = ev.currentTarget.dataset.status! as StudyStatus
        setCurrentStatus(status)
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

    return (
        <Page className='studies-dashboard'>
            <Box align="center" justify="between">
                <h3 className='fw-bold' data-testid='studies-table-header'>
                    Studies
                </h3>
                <Button
                    primary
                    data-testid="add-study"
                    onClick={() => nav('/study/create')}
                    className='fw-bold'
                >
                    <Icon icon="plus" height={28}></Icon>
                    Create New Study
                </Button>
            </Box>
            <NavTabs className="nav nav-tabs">
                <li className="nav-item">
                    <a href="#" onClick={setStatus} data-status="Launched" className={cx('nav-link', { active: currentStatus == StudyStatus.Launched })}>
                        <h4>Launched</h4>
                    </a>
                </li>
                <li className="nav-item">
                    <a href="#" onClick={setStatus} data-status="Draft" className={cx('nav-link', { active: currentStatus == StudyStatus.Draft })}>
                        <h4>Draft</h4>
                    </a>
                </li>
                <li className="nav-item">
                    <a href="#" onClick={setStatus} data-status="Completed" className={cx('nav-link', { active: currentStatus == StudyStatus.Completed })}>
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
