import { React, useState } from '@common'
import { ParticipantStudy } from '@api'
import { useRewardsVisibile } from '@lib'
import { Box, Menu, Button, Icon, OffCanvas } from '@components'
import { without, sortBy, omit } from 'lodash-es'
import { StudySubjectID, StudySubjectTags } from '@models'
import slidersIcon from '@iconify-icons/bi/sliders'
import { useMediaMatch } from 'rooks'

const SortTypes = {
    'time:low-high': 'Time Low to High',
    'time:high-low': 'Time High to Low',
    'points:low-high': 'Points Low to High',
    'points:high-low': 'Points High to Low',
}

export interface ControlState {
    sort?: keyof typeof SortTypes
    subjects?: StudySubjectID[]
}

interface ControlProps {
    state: ControlState
    onChange(state: ControlState): void
}

export const Sort:React.FC<ControlProps> = ({ state, onChange }) => {
    const showRewards = useRewardsVisibile()
    const options = Object.entries(omit(SortTypes, showRewards ? [] : ['points:low-high', 'points:high-low']))

    return (
        <div css={{
            input: {
                marginRight: '0.5rem',
            },
        }}>
            {options.map(([value, label]) => (
                <label className="dropdown-item" key={value}>
                    <input
                        type="radio"
                        data-test-id={`sort-${value}`}
                        checked={state?.sort == value}
                        onChange={() => onChange({ ...state, sort: value as any }) }
                    />
                    {label}
                </label>
            ))}
        </div>
    )
}

export const Subjects:React.FC<ControlProps> = ({ state, onChange }) => {
    const onInputChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
        if (ev.target.checked) {
            onChange({
                ...state,
                subjects: (
                    state?.subjects ? state.subjects.concat(ev.target.value as any) : [ev.target.value]
                ) as any as StudySubjectID[] })
        } else {
            onChange({ ...state, subjects: without<StudySubjectID>(state.subjects, ev.target.value as any) })
        }
    }
    return (
        <div css={{
            input: {
                marginRight: '0.5rem',
            },
        }}>
            {Object.entries(StudySubjectTags).map(([value, label]) => (
                <label key={value} className="dropdown-item">
                    <input
                        type="checkbox"
                        data-test-id={`filter-${value}`}
                        value={value || ''}
                        checked={state.subjects?.includes(value as any) || false}
                        onChange={onInputChange}
                    />
                    {label}
                </label>
            ))}
        </div>
    )
}

export const DesktopFilterRow:React.FC<ControlProps> = ({ onChange, state, state: { subjects } } ) => {

    if (!subjects?.length) return null

    return (
        <Box
            css={{
                borderBottom: '1px solid lightgray',
                marginBottom: '1rem',
            }}
        >
            <Box gap flex>
                {subjects.map(subj => (
                    <button key={subj}
                        css={{ alignSelf: 'center' }}
                        className="btn badge bg-light text-dark border border-1"
                        onClick={() => onChange({ ...state, subjects: without<StudySubjectID>(subjects, subj) })}
                    >
                        {StudySubjectTags[subj]}
                        <Icon icon="x" />
                    </button>
                ))}
            </Box>
            <Button onClick={() => onChange({ ...state, subjects: [] })}>
                Clear Filters
                <Icon icon="x" />
            </Button>
        </Box>
    )
}

export const applyControls = ({ sort, subjects } : ControlState, studies: ParticipantStudy[]) => {
    if (sort) {
        if (sort == 'time:high-low') {
            studies = sortBy(studies, s => s.durationMinutes * -1)
        } else if (sort == 'time:low-high') {
            studies = sortBy(studies, 'durationMinutes')
        } else if (sort == 'points:high-low') {
            studies = sortBy(studies, s => (s?.participationPoints || 0)* -1)
        } else if (sort == 'points:low-high') {
            studies = sortBy(studies, 'participationPoints')
        }
    }
    if (subjects?.length) {
        studies = studies.filter(s => subjects.find(subj => s.tags.includes(subj)))
    }
    return studies
}

export const DesktopControls:React.FC<ControlProps> = (props) => {
    const { state: { sort } } = props
    return (
        <Box direction="column">
            <DesktopFilterRow {...props} />
            <Box
                justify="end"
                gap
                margin='bottom'
                css={{
                    '.dropdown-toggler': {
                        minWidth: '200px',
                        background: 'white',
                        border: '1px solid lightgray',
                    },
                }}
            >
                <Menu label={`Sort by ${sort ? SortTypes[sort] : ''}`} data-test-id="sort-by-menu">
                    <Sort {...props} />
                </Menu>
                <Menu label="Subject" data-test-id="subjects-filter-menu">
                    <Subjects {...props} />
                </Menu>
            </Box>
        </Box>
    )

}

export const MobileControls:React.FC<ControlProps> = (props) => {
    const [isVisible, setVisible] = useState(false)
    return (
        <>
            <Box
                justify="between" align="center" pad="medium" margin={{ bottom: 'medium' }}
                className="border border-1"
                role="button"
                onClick={() => setVisible(!isVisible)}
            >
                <span>Filter and Sort</span>
                <Icon icon={slidersIcon} />

            </Box>
            <OffCanvas
                isVisible={isVisible} title="Filter and Sort"
                onHide={() => setVisible(false)}
            >
                <h5 className="my-2 fw-bold">Sort by</h5>
                <Sort {...props} />
                <h5 className="my-2 fw-bold">Subject</h5>
                <Subjects {...props} />
            </OffCanvas>
        </>

    )
}

export const Controls:React.FC<ControlProps> = (props) => {
    const isMobile = useMediaMatch('(max-width: 768px)')
    const Component = isMobile ? MobileControls : DesktopControls

    return <Component {...props} />
}
