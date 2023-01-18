import { Analysis } from '@api'
import { React, styled } from '@common'
import { Link } from 'react-router-dom'

const AnalysisNavEntry:FC<{analysis: Analysis}> = ({ analysis }) => {

    return (
        <li className="list-group-item">
            <Link className="nav-link" to={`/analysis/edit/${analysis.id}`}>
                {analysis.title}
            </Link>
        </li>
    )
}

const Wrapper = styled.ul({
    height: '100vh',
    width: 200,
    borderRight: '1px solid gray',
})

export const ListAnalysis: FC<{ listing: Array<Analysis> }> = ({ listing }) => {

    return (
        <Wrapper className="list-group pt-5">
            {listing.map(a => <AnalysisNavEntry analysis={a} key={a.id} />)}
        </Wrapper>
    )
}
