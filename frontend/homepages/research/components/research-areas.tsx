import { colors, media } from '../../../src/theme';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import { ResearchArea, researchFocusAreas } from '../research-data';
import Accordion from 'react-bootstrap/Accordion';
import { Box, React, styled } from '@common';
import { Section } from '../research-homepage';

export const ResearchSection = () => {
    return (
        <Section backgroundColor={colors.lightGrayBackground}>
            <h2 className='py-2'>Areas of Research Focus</h2>
            <p className='mobile'>
                Our team has significant expertise in <strong>learning science, education research, and AI/ML
                in education.</strong> We use a multidisciplinary approach to examine who our learners are,
                what are they learning, and how are they learning; to provide appropriate supports when and
                where learners need them. To enable large-scale rapid cycle research, we are developing Kinetic,
                a research infrastructure connecting researchers with adult higher ed learners in the US.
            </p>
            <MobileResearchFocusAreas />
            <ResearchFocusAreas />
        </Section>
    )
}

export const ResearchFocusAreas = () => (
    <div className='desktop'>
        <Tabs defaultActiveKey="kinetic">
            <Tab eventKey="kinetic" title="Learning Research on OpenStax Kinetic" className='pt-2'>
                <p>
                    OpenStax Kinetic is a new research infrastructure that enables researchers to connect with real
                    learners studying curricular content in authentic learning environments. Researchers can leverage
                    Qualtrics to design a variety of studies (e.g., surveys, Randomized Control Trials, A/B/N tests)
                    and make them available on Kinetic to <strong>US adult higher education learners. </strong>
                    Kinetic researchers can effectively address 3 key questions in learning and how they interact:
                </p>
                <ol>
                    <li><strong>Who is the learner?</strong></li>
                    <li><strong>What are they learning?</strong></li>
                    <li><strong>How are they learning?</strong></li>
                </ol>
                <div className='pt-2'>
                    <hr />
                    {researchFocusAreas['kinetic'].map((researchArea, index) =>
                        <ResearchFocusArea researchArea={researchArea} key={index}></ResearchFocusArea>
                    )}
                </div>
            </Tab>
            <Tab eventKey="ai" title="AI/ML in education" className='pt-2'>
                <p>
                    In collaboration with leading researchers in the AI/ML in education space and the&nbsp;
                    <a href='https://dsp.rice.edu/' target='_blank'>Digital Signal Processing research group</a>
                    &nbsp;at Rice University, we investigate how to
                    effectively utilize AI/ML advancements to address crucial issues in learning and education.
                    Our research explores natural language processing for content generation, predictive models
                    for learning analytics, and hybrid models for generation of knowledge graphs. We aim to use
                    a combination of these efforts to optimally personalize learning experiences for learners.
                </p>
                <hr />
                {researchFocusAreas['ai'].map((researchArea, index) =>
                    <ResearchFocusArea researchArea={researchArea} key={index}></ResearchFocusArea>
                )}
            </Tab>
            <Tab eventKey="education" title="Applied Education Research" className='pt-2'>
                <p>
                    This learner- and educator- centered initiative aims to promote educational equity.
                    To this end, we engage with learners, educators, institutions, and the community and
                    utilize participatory and mixed- research methods. By working with educators and learners,
                    we identify issues that are most important for them and work toward evidence-based approaches
                    to address them. Ultimately, we work with our product teams to build evidence-based learner
                    supports that are iteratively refined.
                </p>
                <hr />
                {researchFocusAreas['education'].map((researchArea, index) =>
                    <ResearchFocusArea researchArea={researchArea} key={index}></ResearchFocusArea>
                )}
            </Tab>
        </Tabs>
    </div>
)

export const MobileResearchFocusAreas = () => {
    return (
        <div className='mobile pt-2'>
            <Accordion>
                <Accordion.Item eventKey="0">
                    <Accordion.Header>Learning Research on OpenStax Kinetic</Accordion.Header>
                    <Accordion.Body>
                        <p>
                            OpenStax Kinetic research infrastructure enables researchers to connect with
                            adult higher education learners in the US, studying curricular content in authentic
                            learning environments while they leverage Qualtrics to various research methodologies.
                        </p>
                        <ol>
                            <li><strong>Who is the learner?</strong></li>
                            <li><strong>What are they learning?</strong></li>
                            <li><strong>How are they learning?</strong></li>
                        </ol>
                        <div className='pt-2'>
                            <hr />
                            {researchFocusAreas['kinetic'].map((researchArea, index) =>
                                <ResearchFocusArea researchArea={researchArea} key={index}></ResearchFocusArea>
                            )}
                        </div>
                    </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="1" css={{ backgroundColor: colors.white }}>
                    <Accordion.Header>AI/ML in education</Accordion.Header>
                    <Accordion.Body>
                        <p>Our research explores the use of a combination of natural language processing for
                            content generation, predictive models for learning analytics, and hybrid models for
                            generation of knowledge graphs to optimally personalize learning experiences for learners.
                        </p>
                        <div className='pt-2'>
                            <hr/>
                            {researchFocusAreas['ai'].map((researchArea, index) =>
                                <ResearchFocusArea researchArea={researchArea} key={index}></ResearchFocusArea>
                            )}
                        </div>
                    </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="2">
                    <Accordion.Header>Applied Education Research</Accordion.Header>
                    <Accordion.Body>
                        <p>
                            This learner- and educator- centered initiative aims to promote educational equity.
                            By working with educators and learners, we identify issues that are most important for
                            them and work toward evidence-based approaches to address them.
                        </p>
                        <div className='pt-2'>
                            <hr/>
                            {researchFocusAreas['education'].map((researchArea, index) =>
                                <ResearchFocusArea researchArea={researchArea} key={index}></ResearchFocusArea>
                            )}
                        </div>
                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>
        </div>
    )
}

export const ResearchFocusArea: React.FC<{ researchArea: ResearchArea }> = ({ researchArea }) => (
    <div className='py-2'>
        <Box gap='xlarge' direction={{ mobile: 'column' }} className='py-2'>
            <ResearchAreaImage src={researchArea.image} alt={researchArea.title} />
            <Box direction='column' css={{ flex: 6 }}>
                <h5 className='fw-bold'>{researchArea.title}</h5>
                <p className='desktop'>{researchArea.description}</p>
                <p className='mobile'>{researchArea.shortDescription}</p>
                {researchArea.cta &&
                    <div>
                        <a href={researchArea.cta?.url} target='_blank'>
                            {researchArea.cta?.text}
                        </a>
                    </div>
                }
            </Box>
        </Box>
        <hr />
    </div>
)

const ResearchAreaImage = styled.img({
    flex: 2,
    maxWidth: 250,
    height: '100%',
    [media.mobile]: {
        alignSelf: 'center',
    },
});
