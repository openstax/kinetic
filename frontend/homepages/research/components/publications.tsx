import { Box, React, useState } from '@common';
import { ENV, useIsMobileDevice } from '@lib';
import { Publication, publications } from '../research-data';
import { useRef } from 'react';
import { colors } from '../../../src/theme';
import { Icon } from '@components';
import chevronUp from '@iconify-icons/bi/chevron-up';
import chevronDown from '@iconify-icons/bi/chevron-down';
import { Section } from '../research-homepage';

export const Publications = () => {
    const [viewAll, setViewAll] = useState(false);
    let initialCount = 5;
    if (!ENV.IS_SSR) {
        initialCount = useIsMobileDevice() ? 3 : 5
    }
    const publicationList = viewAll ? publications : publications.slice(0, initialCount);

    const publicationsRef = useRef<null | HTMLDivElement>(null);
    const scrollToPublications = () => {
        publicationsRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
    return (
        <Section>
            <Box direction='column'>
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
        </Section>
    )
}

export const PublicationItem: React.FC<{ publication: Publication }> = ({ publication }) => (
    <Box direction='column' className='py-2' css={{ lineHeight: 1.8 }}>
        <div>
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
        <Box gap='xlarge'>
            <a className='text-decoration-none' href={publication.pdf} target='_blank'>
                <Box align='center'>
                    Pdf&nbsp;
                    <Icon icon='boxArrowInUpRight'></Icon>
                </Box>
            </a>
            {publication.github && <a className='text-decoration-none' href={publication.github} target='_blank'>
                <Box align='center'>
                    Github
                    <Icon icon='boxArrowInUpRight'></Icon>
                </Box>
            </a>}
        </Box>
    </Box>
)
