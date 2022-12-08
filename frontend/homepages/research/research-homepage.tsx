import { Box, cx, React, styled, useState } from '@common'

import '../../src/styles/cms-page.scss'
import { colors, media } from '../../src/theme';
import { Funders, Icon } from '@components';
import {
    alumni,
    AlumnusMember,
    Publication,
    publications,
    ResearchArea,
    researchFocusAreas,
    ResearchMember,
    researchMembers,
} from './research-data';
import boxArrowInUpRight from '@iconify-icons/bi/box-arrow-in-up-right';
import chevronDown from '@iconify-icons/bi/chevron-down';
import chevronUp from '@iconify-icons/bi/chevron-up';
import { Button, Modal } from '@restart/ui';
import Accordion from 'react-bootstrap/Accordion';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import { useRef } from 'react';
import BannerImage from './images/landing/banner-image.svg';
import { SSRProvider } from '@restart/ui/ssr';
import { ENV } from '@lib';

export const ResearchHomepage = () => {
    return (
        <SSRProvider>
            <div>
                <Header></Header>
                <Banner></Banner>
                <ColorBar></ColorBar>
                <ResearchSection></ResearchSection>
                <Publications></Publications>
                <MembersSection></MembersSection>
                <Funders></Funders>
                <ContactUs></ContactUs>
            </div>
        </SSRProvider>
    )
}

export const Header = () => (
    <div className="py-4" css={{ backgroundColor: colors.lightBlue }}>
        <Box direction={{ mobile: 'column' }} className='container' align='center'>
            <h1 className='fw-bolder' css={{ color: colors.white, flex: 3 }}>
                Advancing multi-disciplinary research to improve learner success.
            </h1>
            <img src={BannerImage} alt='banner-image' css={{ flex: 2 }} />
        </Box>
    </div>
)

export const Banner = () => (
    <div className="py-4" css={{ backgroundColor: colors.lightTeal }}>
        <Box direction={{ mobile: 'column' }} className='container align-items-center' gap='medium'>
            <h4 className='fw-bold text-center' css={{ color: colors.blackText, flex: 1 }}>
                Calling all learning researchers!
            </h4>
            <Box align={{ mobile: 'center' }} className='justify-content-center' direction='column' css={{ flex: 4 }}>
                <span>Learn about the research workflow on OpenStax Kinetic during office hours hosted with IES!</span>
                <a className='text-decoration-none' href='https://ies.ed.gov/funding/technicalassistance.asp' target='_blank'>
                    <Box align='center'>
                        IES Office Hours
                        &nbsp;
                        <Icon icon={boxArrowInUpRight}></Icon>
                    </Box>
                </a>
            </Box>
        </Box>
    </div>
)

export const ColorBar = () => (
    <Box>
        <span css={{
            backgroundColor: colors.orange,
            height: 10,
            width: '35%',
        }}></span>
        <span css={{
            backgroundColor: colors.purple,
            height: 10,
            width: '15%',
        }}></span>
        <span css={{
            backgroundColor: colors.red,
            height: 10,
            width: '10%',
        }}></span>
        <span css={{
            backgroundColor: colors.yellow,
            height: 10,
            width: '25%',
        }}></span>
        <span css={{
            backgroundColor: colors.lightBlue,
            height: 10,
            width: '15%',
        }}></span>
    </Box>
)

export const ResearchSection = () => {
    return (
        <div className='container py-4'>
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
        </div>
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
                    and make them available on Kinetic to <strong>US adult higher education learners.</strong>
                    Kinetic researchers can effectively address 3 key questions in learning and how they interact:
                </p>
                <ol>
                    <li><strong>Who is the learner?</strong></li>
                    <li><strong>What are they learning?</strong></li>
                    <li><strong>How are they learning?</strong></li>
                </ol>
                <hr />
                {researchFocusAreas['kinetic'].map((researchArea, index) =>
                    <ResearchFocusArea researchArea={researchArea} key={index}></ResearchFocusArea>
                )}
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
        <div className='mobile'>
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
                        <hr />
                        {researchFocusAreas['kinetic'].map((researchArea, index) =>
                            <ResearchFocusArea researchArea={researchArea} key={index}></ResearchFocusArea>
                        )}
                    </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="1" css={{ backgroundColor: colors.white }}>
                    <Accordion.Header>AI/ML in education</Accordion.Header>
                    <Accordion.Body>
                        <p>Our research explores the use of a combination of natural language processing for
                            content generation, predictive models for learning analytics, and hybrid models for
                            generation of knowledge graphs to optimally personalize learning experiences for learners.
                        </p>
                        {researchFocusAreas['ai'].map((researchArea, index) =>
                            <ResearchFocusArea researchArea={researchArea} key={index}></ResearchFocusArea>
                        )}
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
                        {researchFocusAreas['education'].map((researchArea, index) =>
                            <ResearchFocusArea researchArea={researchArea} key={index}></ResearchFocusArea>
                        )}
                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>
        </div>
    )
}

export const ResearchFocusArea: React.FC<{ researchArea: ResearchArea }> = ({ researchArea }) => (
    <div className='py-2'>
        <Box gap='large' direction={{ mobile: 'column' }}>
            <img src={researchArea.image} css={{ flex: 2 }} alt={researchArea.title} />
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

export const Publications = () => {
    const [viewAll, setViewAll] = useState(false);
    const initialCount = 5;
    const publicationList = viewAll ? publications : publications.slice(0, initialCount);

    const publicationsRef = useRef<null | HTMLDivElement>(null);
    const scrollToPublications = () => {
        publicationsRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
    return (
        <Box direction='column' className='container mt-3'>
            <h2 ref={publicationsRef}>Publications</h2>
            {publicationList.map((publication, index) =>
                <PublicationItem key={index} publication={publication} />
            )}
            <span className='py-4 align-self-center'
                onClick={() => {
                    if (viewAll) {
                        scrollToPublications()
                    }
                    setViewAll(!viewAll)
                }}
                css={{ cursor: 'pointer', color: colors.linkText }}
            >
                <Icon icon={viewAll ? chevronUp : chevronDown}></Icon>
                &nbsp;
                {viewAll ? 'View Less' : 'View All Publications'}
            </span>
        </Box>
    )
}

export const PublicationItem: React.FC<{ publication: Publication }> = ({ publication }) => (
    <Box direction='column' css={{ paddingTop: '.75rem', paddingBottom: '.75rem' }}>
        <div className='mb-1'>
            <a className='fw-bold' href={publication.pdf} target='_blank'>
                {publication.title}
            </a>
        </div>
        <div>
            <span>{publication.date} &middot;&nbsp;</span>
            <span css={{ color: colors.grayText }}>
                {publication.body}
            </span>
        </div>
        <Box gap='xlarge' className='mt-2'>
            <a className='text-decoration-none' href={publication.pdf} target='_blank'>
                <Box align='center'>
                    Pdf&nbsp;
                    <Icon icon={boxArrowInUpRight}></Icon>
                </Box>
            </a>
            {publication.github && <a className='text-decoration-none' href={publication.github} target='_blank'>
                <Box align='center'>
                    Github
                    <Icon icon={boxArrowInUpRight}></Icon>
                </Box>
            </a>}
        </Box>
    </Box>
)

const MemberGrid = styled.div({
    display: 'grid',
    gap: '1.5rem',
    gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
    [media.mobile]: {
        gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
        gap: '3rem',
    },
});

const AlumniGrid = styled(Box)({
    flexDirection: 'column',
    [media.mobile]: {
        textAlign: 'center',
    },
});

export const MembersSection = () => {
    return (
        <div css={{ backgroundColor: colors.lightGrayBackground }}>
            <div className='container py-3' >
                <h2 className='pt-4 pb-2'>Team Members</h2>
                <MobileMembers />
                <Members />
            </div>
        </div>
    )
}

export const MobileMembers = () => {
    const [viewAll, setViewAll] = useState(false);
    const membersRef = useRef<null | HTMLDivElement>(null);
    const scrollToMembers = () => {
        membersRef.current?.scrollIntoView({ behavior: 'smooth' });
    }

    const members = viewAll ? researchMembers['current'] : researchMembers['current'].slice(0, 4);
    return (
        <div className='mobile'>
            <Accordion defaultActiveKey="0">
                <Accordion.Item eventKey="0" >
                    <Accordion.Header ref={membersRef}>Current Members</Accordion.Header>
                    <Accordion.Body>
                        <MemberGrid>
                            {members.map((member, index) =>
                                <Member member={member} key={index} />
                            )}
                        </MemberGrid>

                        <p className='py-4 align-self-center text-center'
                            onClick={() => {
                                if (viewAll) {
                                    scrollToMembers()
                                }
                                setViewAll(!viewAll)
                            }}
                            css={{ cursor: 'pointer', color: colors.linkText }}
                        >
                            <Icon icon={viewAll ? chevronUp : chevronDown}></Icon>
                            &nbsp;
                            {viewAll ? 'View Less' : 'View All Current Members'}
                        </p>

                    </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="1">
                    <Accordion.Header>Collaborating Researchers</Accordion.Header>
                    <Accordion.Body>
                        <MemberGrid>
                            {researchMembers['collaborating'].map((member, index) =>
                                <Member member={member} key={index} />
                            )}
                        </MemberGrid>
                    </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="2">
                    <Accordion.Header>Alumni</Accordion.Header>
                    <Accordion.Body>
                        <AlumniGrid>
                            {alumni.map((alumnus, index) =>
                                <Alumnus alumnus={alumnus} key={index} />
                            )}
                        </AlumniGrid>
                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>
        </div>
    )
}

export const Members = () => (
    <div className='desktop'>
        <Tabs defaultActiveKey="current-members" >
            <Tab eventKey="current-members" title="Current Members" className='px-2 py-5'>
                <MemberGrid>
                    {researchMembers['current'].map((member, index) =>
                        <Member member={member} key={index} />
                    )}
                </MemberGrid>
            </Tab>
            <Tab eventKey="collaborating-members" title="Collaborating Researchers" className='px-2 py-5'>
                <MemberGrid>
                    {researchMembers['collaborating'].map((member, index) =>
                        <Member member={member} key={index} />
                    )}
                </MemberGrid>
            </Tab>
            <Tab eventKey="alumni" title="Alumni" className='px-2 py-5'>
                <AlumniGrid>
                    {alumni.map((alumnus, index) =>
                        <Alumnus alumnus={alumnus} key={index} />
                    )}
                </AlumniGrid>
            </Tab>
        </Tabs>
    </div>
)

const MemberModal: React.FC<{ member: ResearchMember, show: boolean, onHide(): void }> = ({ member, show, onHide }) => {
    if (ENV.IS_SSR) return null

    return (
        <Modal
            container={document.getElementById('research-homepage')}
            show={show}
            className={cx('modal', 'fade', {
                show,
            })}
            onBackdropClick={onHide}
            style={{ display: 'block', pointerEvents: 'none', overflow: 'auto' }}
            onHide={onHide}
            renderBackdrop={(props) => (
                <div className={cx('modal-backdrop', 'fade', {
                    show,
                })} {...props} />
            )}
        >
            <div className='modal-dialog modal-dialog-centered modal-dialog-scrollable mx-auto' css={{
                width: '50%',
                [media.mobile]: {
                    width: '90%',
                },
            }}>
                <div className="modal-content overflow-auto" css={{ padding: '1.75rem' }}>
                    <MemberDetails member={member} />
                    <Icon icon="x" height={30} onClick={onHide} css={{
                        position: 'absolute',
                        top: 5,
                        right: 5,
                    }} />
                </div>
            </div>
        </Modal>
    )

}

export const Member: React.FC<{ member: ResearchMember }> = ({ member }) => {

    const [show, setShow] = useState(false);
    return (
        <Box direction='column' align='center' className='text-center'>
            <img alt={member.firstName} src={member.image} onClick={() => setShow(true)} />
            <Button className='mt-2' as='a' type='button' onClick={() => setShow(true)}>
                {member.firstName}
            </Button>
            <small>{member.title}</small>
            <MemberModal member={member} show={show} onHide={() => setShow(false)} />
        </Box>
    )
}

export const MemberDetails: React.FC<{ member: ResearchMember }> = ({ member }) => {
    return (
        <Box css={{ fontSize: 15 }}>
            <Box direction='column' gap='medium'>
                <MemberInfo member={member} />
                <MemberEducation member={member} />
                <MemberResearchInterest member={member} />
                <MemberBio member={member} />
                <MemberLinks member={member} />
            </Box>
        </Box>
    )
}

const MemberImage = styled.img({
    marginBottom: '.5rem',
    width: 145,
    height: 145,
    [media.mobile]: {
        width: 75,
        height: 75,
    },
});

export const MemberInfo: React.FC<{ member: ResearchMember }> = ({ member }) => {
    return (
        <Box align='center'>
            <MemberImage src={member.image} alt={member.firstName} />
            <Box direction='column' margin={{ left: '1.5rem' }}>
                <h4>{member.firstName} {member.lastName}</h4>
                <p css={{ color: colors.grayText }}>
                    {member.title}
                </p>
            </Box>
        </Box>
    )
}

export const MemberEducation: React.FC<{ member: ResearchMember }> = ({ member }) => {
    if (!member.education) {
        return null;
    }
    return (
        <Box direction='column'>
            <h5>Education</h5>
            <p>
                {member.education}
                <br />
                {member.specialization && <span css={{ color: colors.grayText }}>{member.specialization}</span>}
            </p>
        </Box>
    )
}

export const MemberResearchInterest: React.FC<{ member: ResearchMember }> = ({ member }) => {
    if (!member.researchInterest) {
        return null;
    }
    return (
        <Box direction='column'>
            <h5>Research Interest</h5>
            <p>{member.researchInterest}</p>
        </Box>
    )
}

export const MemberBio: React.FC<{ member: ResearchMember }> = ({ member }) => {
    return (
        <Box direction='column'>
            <h5>Bio</h5>
            <p>{member.bio}</p>
        </Box>
    )
}

export const MemberLinks: React.FC<{ member: ResearchMember }> = ({ member }) => {
    return (
        <Box gap='large'>
            {member.linkedIn && <a href={member.linkedIn} target='_blank'>Linkedin</a>}
            {member.googleScholar && <a href={member.googleScholar} target='_blank'>Google Scholar</a>}
            {member.website && <a href={member.website} target='_blank'>Website</a>}
        </Box>
    )
}

export const Alumnus: React.FC<{ alumnus: AlumnusMember }> = ({ alumnus }) => (
    <Box direction={{ mobile: 'column' }} justify='center'>
        <a css={{ flex: 1 }} href={alumnus.linkedin} target='_blank'>{alumnus.name}</a>
        <p css={{ flex: 3, color: colors.grayText }}>{alumnus.title}</p>
    </Box>
)

export const ContactUs = () => (
    <div css={{ backgroundColor: colors.lightTeal }}>
        <Box className='container py-4' direction={{ mobile: 'column' }} align='center' justify='center' gap='large'>
            <h4>Connect with our Research Team</h4>
            <Button as='a'
                href='https://riceuniversity.co1.qualtrics.com/jfe/form/SV_6EbRsmpDb2Hs69w?jfefe=new'
                target='_blank'
                className='btn btn-lg'
                css={{
                    color: colors.white,
                    backgroundColor: colors.primaryButton,
                    ':hover': {
                        color: colors.white,
                        backgroundColor: colors.primaryButton,
                    },
                }}>
                Contact Us
            </Button>
        </Box>
    </div>
)
