import { Box, React } from '@common'

import '../../src/index.css'
import '../../src/styles/main.scss'
import { colors } from '../../src/theme';
import { Footer } from '@components';
import 'bootstrap/dist/js/bootstrap.min'

export const ResearchHomepage = () => (
    <div css={{ backgroundColor: colors.pageBackground }}>
        <style>
            {`
                .nav-tabs .nav-link.active {
                    color: #495057;
                    background-color: #f6f8fa;
                    border-bottom-width: 4px;
                    border-color: rgba(0,0,0,0) rgba(0,0,0,0) #63A524 rgba(0,0,0,0);
                }
            `}
        </style>

        <Header></Header>
        <Banner></Banner>
        <ColorBar></ColorBar>
        <ResearchFocusAreas></ResearchFocusAreas>

        {/* TODO Fixed footer or no? */}
        <Footer includeFunders></Footer>
    </div>
)

export const Header = () => (
    <div className="py-2" css={{ backgroundColor: colors.darkBlue }}>
        <div className='container'>
            <h1 css={{ color: colors.white }}>placeholder</h1>
        </div>
    </div>
)

// TODO is this dynamic content?
export const Banner = () => (
    <div className="py-2" css={{
        backgroundColor: colors.lightTeal,
        color: colors.blackText,
    }}>
        <div className='container'>
            <h1>banner</h1>
        </div>
    </div>
)

export const ColorBar = () => (
    <Box>
        <span css={{
            backgroundColor: colors.orange,
            height: 10,
            width: '36%',
        }}></span>
        <span css={{
            backgroundColor: colors.purple,
            height: 10,
            width: '16%',
        }}></span>
        <span css={{
            backgroundColor: colors.red,
            height: 10,
            width: '10%',
        }}></span>
        <span css={{
            backgroundColor: colors.yellow,
            height: 10,
            width: '20%',
        }}></span>
        <span css={{
            backgroundColor: colors.lightBlue,
            height: 10,
            width: '18%',
        }}></span>
    </Box>
)

export const ResearchFocusAreas = () => (
    <div className='container'>

        <ul className="nav nav-tabs" id="myTab" role="tablist">
            <li className="nav-item" role="presentation">
                <button className="nav-link active" id="kinetic-tab" data-bs-toggle="tab" data-bs-target="#kinetic"
                    type="button" role="tab" aria-controls="kinetic" aria-selected="true">
                    Research on OpenStax Kinetic
                </button>
            </li>
            <li className="nav-item" role="presentation">
                <button className="nav-link" id="ai-ml-tab" data-bs-toggle="tab" data-bs-target="#ai-ml"
                    type="button" role="tab" aria-controls="ai-ml" aria-selected="false">
                    AI/ML in education
                </button>
            </li>
            <li className="nav-item" role="presentation">
                <button className="nav-link" id="applied-research-tab" data-bs-toggle="tab" data-bs-target="#applied-research"
                    type="button" role="tab" aria-controls="applied-research" aria-selected="false">
                    Applied Education Research
                </button>
            </li>
        </ul>
        <div className="tab-content">
            <div className="tab-pane fade show active" id="kinetic" role="tabpanel" aria-labelledby="kinetic-tab">
                <p>
                    OpenStax Kinetic is a new research infrastructure that enables researchers to connect with real
                    learners studying curricular content in authentic learning environments. Researchers can leverage
                    Qualtrics to design a variety of studies (e.g., surveys, Randomized Control Trials, A/B/N tests)
                    and make them available on Kinetic to <strong>US adult higher education learners.</strong>
                    Kinetic researchers can effectively address 3 key questions in learning and how they interact:
                </p>
                <ol>
                    <li><strong>Who is the learner?</strong></li>
                    <li><strong>What are they learning?</strong></li>
                    <li><strong>How are they learning?</strong></li>
                </ol>
            </div>
            <div className="tab-pane fade" id="ai-ml" role="tabpanel" aria-labelledby="ai-ml-tab">
                <p>
                    In collaboration with leading researchers in the AI/ML in education space and the
                    Digital Signal Processing research group at Rice University, we investigate how to
                    effectively utilize AI/ML advancements to address crucial issues in learning and education.
                    Our research explores natural language processing for content generation, predictive models
                    for learning analytics, and hybrid models for generation of knowledge graphs. We aim to use
                    a combination of these efforts to optimally personalize learning experiences for learners.
                </p>
            </div>
            <div className="tab-pane fade" id="applied-research" role="tabpanel" aria-labelledby="applied-research-tab">
                <p>
                    This learner- and educator- centered initiative aims to promote educational equity.
                    To this end, we engage with learners, educators, institutions, and the community and
                    utilize participatory and mixed- research methods. By working with educators and learners,
                    we identify issues that are most important for them and work toward evidence-based approaches
                    to address them. Ultimately, we work with our product teams to build evidence-based learner
                    supports that are iteratively refined.
                </p>
            </div>
        </div>
    </div>
)

export const ResearchArea = () => (
    <div>

    </div>
)


export const Publications = () => (
    <div className='container'>
        <h1>Publications</h1>
        {/*  TODO Render publications dynamically  */}
    </div>
)
