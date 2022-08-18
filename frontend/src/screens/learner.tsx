import { React, useEffect, useState, useMemo, useCallback } from '@common'
import { ParticipantStudy } from '@api'
import styled from '@emotion/styled'
import { colors } from '../theme'
import { Global } from '@emotion/react'
import { sortBy, intersection } from 'lodash'
import {
    Box, Logo, RewardsProgressBar, BannersBar,
} from '@components'
import { useApi, useEnvironment } from '@lib'
import {
    isStudyLaunchable, StudyTopicTags,
} from '@models'
import { StudyCard } from './learner/card'
import { Footer } from './learner/footer'
import { SplashImage } from './learner/splash-image'
import { StudyModal } from './studies/modal'

const Splash = styled(Box)({
    height: 400,
    width: '100%',
    overflow: 'hidden',
    position: 'relative',
})

const TOPIC_TAGS = Object.keys(StudyTopicTags)

const useParticpantStudies = () => {
    const api = useApi()

    const [filter, setFilter] = useState<string>('topic:personality')
    const [mandatoryStudy, setMandatoryStudy] = useState<ParticipantStudy>()
    const [allStudies, setStudies] = useState<ParticipantStudy[]>([])

    const fetchStudies = async () => {
        const studies = await api.getParticipantStudies()
        const mandatory = studies.data?.find(s => isStudyLaunchable(s) && s.isMandatory)
        if (mandatory) {
            setMandatoryStudy(mandatory)
        }
        setStudies(studies.data || [])
    }

    useEffect(() => { fetchStudies() }, [])

    const onMandatoryClose = useCallback(() => {
        setMandatoryStudy(undefined)
        fetchStudies()
    }, [fetchStudies])
    const popular = useMemo(() => sortBy(allStudies, 'popularity_rating').slice(0, 3), [allStudies])
    const studies = useMemo(() => allStudies.filter((s) => (
        !popular.includes(s) && (
            (filter == 'other' && intersection(s.tags, TOPIC_TAGS).length == 0) ||
            (s.tags.includes(filter))
        )
    )), [filter, setFilter, popular, allStudies])

    return useMemo(() => ({
        mandatory: mandatoryStudy,
        studies,
        popular,
        filter,
        setFilter,
        onMandatoryClose,
    }), [studies, mandatoryStudy, onMandatoryClose, filter, setFilter])
}


interface StudyListProps {
    studies: ParticipantStudy[],
    title: string
}

const Grid = styled.div({
    display: 'grid',
    gridTemplateColumns: 'repeat(3, [col-start] minmax(100px, 1fr) [col-end])',

    gridColumnGap: 20,
    gridRowGap: 20,

})

const StudyList: React.FC<StudyListProps> = ({ title, studies, children }) => {

    return (
        <div className="container-lg studies my-8" >
            <h3 css={{ margin: '2rem 0' }}>{title}</h3>
            {children}
            {!studies.length && <h3>No studies were found</h3>}
            <Grid>
                {studies.map(s => <StudyCard study={s} key={s.id} />)}
            </Grid>
        </div>
    )
}

interface FiltersProps {
    filter: string
    setFilter(filter: string): void
}


const filterProps = (type: string, filter: string, setType: (t: string) => void) => ({
    className: type == filter ? 'active' : '',
    'data-type': type,
    onClick() { setType(type) },
})

const Filters: React.FC<FiltersProps> = ({ filter, setFilter }) => {
    return (
        <Box gap="large" wrap margin={{ bottom: 'large' }}
            css={{
                span: {
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    borderBottom: '3px solid transparent',
                    color: colors.grayText,
                    '&.active': {
                        borderBottomColor: colors.purple,
                        color: colors.purple,
                    },
                },
            }}
        >
            {Object.entries(StudyTopicTags).map(([tag, title]) => <span key={tag} {...filterProps(tag, filter, setFilter)}>{title}</span>)}
            <span {...filterProps('other', filter, setFilter)}>Others</span>
        </Box >
    )
}
const LearnerDashboard = () => {
    const env = useEnvironment()

    const { popular, mandatory, filter, onMandatoryClose, setFilter, studies } = useParticpantStudies()


    return (
        <div className="studies learner">
            <StudyModal study={mandatory} onHide={onMandatoryClose} />
            <Global styles={{ background: colors.pageBackground }} />
            <nav className="navbar navbar-light">
                <div className="navbar-dark bg-dark py-1">
                    <div className="container-lg">
                        <a href={env?.config.homepageUrl}>
                            <Logo height={45} />
                        </a>
                    </div>
                </div>
                <BannersBar />
            </nav>
            <RewardsProgressBar studies={studies} />

            <Splash direction='column' justify='center'>
                <SplashImage
                    preserveAspectRatio='xMinYMid slice'

                    css={{

                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',

                        zIndex: -1,
                    }}
                />
                <div className="container-lg">
                    < div css={{ maxWidth: 500, p: { marginBottom: 5 } }}>
                        <h2>Learning Pays,</h2>
                        <h2>In More Ways Than One!</h2>
                        <p>
                            Learning doesn’t have to be boring - and it can even win you prizes!
                        </p>
                        <p>
                            With OpenStax Kinetic, you are guaranteed to learn something new everyday!
                        </p>
                    </div>
                </div>
            </Splash >

            <StudyList title="Popular Studies on Kinetic" studies={popular} />

            <StudyList title="View All Studies" studies={studies}>
                <Filters filter={filter} setFilter={setFilter} />
            </StudyList>

            <Footer />
        </div >
    )
}


export default LearnerDashboard
