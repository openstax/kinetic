import { cx, React, styled, useNavigate, useState } from '@common'
import { Box, Button, Icon, TopNavBar } from '@components'
import { StudyStatus } from '@models'
import { colors } from '../../../theme';
import 'bootstrap/js/dist/dropdown'
import { StudiesTable } from './studies-table';
import { ColumnFiltersState } from '@tanstack/react-table';

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
                setFilters([{ id: 'status', value: ['completed'] }])
                break
            case StudyStatus.Draft:
                setFilters([{ id: 'status', value: ['draft'] }])
                break
            case StudyStatus.Launched:
                setFilters([{ id: 'status', value: ['active', 'paused', 'scheduled'] }])
                break
        }
    }

    return (
        <div className="studies">
            <TopNavBar showBanner={false}/>
            {/* TODO Notifications */}
            {/*<ActionNotification />*/}
            <div className="container-lg mt-8">
                <Box align="center" justify="between">
                    <h3 className='fw-bold'>Studies</h3>
                    <Button
                        primary
                        data-test-id="add-study"
                        onClick={() => nav('/study/edit/new')}
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
                <StudiesTable filters={filters} setFilters={setFilters} isLaunched={currentStatus === StudyStatus.Launched}/>
            </div>
        </div>
    )
}

const ActionNotification = () => {
    return (
        <div aria-live="polite" aria-atomic="true" className="d-flex justify-content-center align-items-center w-100">
            <div className="toast" role="alert" aria-live="assertive" aria-atomic="true">
                <div className="toast-header">
                    <img src="..." className="rounded me-2" alt="..."/>
                    <strong className="me-auto">Bootstrap</strong>
                    <small>11 mins ago</small>
                    <button type="button" className="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
                </div>
                <div className="toast-body">
                    Hello, world! This is a toast message.
                </div>
            </div>
        </div>
    )
}
