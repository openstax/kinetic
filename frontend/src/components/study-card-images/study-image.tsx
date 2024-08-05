import { React, useState, useEffect } from '@common'
import { ParticipantStudy } from '@api'
import { getImageUrl, getAltText } from './card-images'
import { colors } from '@theme';

const SVGManipulator: React.FC<{src: string, fillColor: string, altText: string}> = ({ src, fillColor, altText }) => {
    const [imgSrc, setImgSrc] = useState('');

    useEffect(() => {
        fetch(src)
        .then((response) => response.text())
        .then((data) => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(data, 'image/svg+xml');
          
            const paths = doc.querySelectorAll('path');
            paths.forEach((path) => {
                const currentFill = path.getAttribute('fill');
                const newFill = currentFill && currentFill != colors.lavender ? fillColor : currentFill;
                path.setAttribute('fill', newFill || 'none');
            });
            const updatedSVG = new XMLSerializer().serializeToString(doc);

            const svgBlob = new Blob([updatedSVG], { type: 'image/svg+xml' });
            const url = URL.createObjectURL(svgBlob);
  
            setImgSrc(url);

            return () => URL.revokeObjectURL(url);
        });
    }, [src, fillColor]);
  
    return <img src={imgSrc} alt={altText} className='study-card-image' />;
};


export const StudyCardImage: React.FC<{study: ParticipantStudy}> = ({ study }) => {

    return (
        <SVGManipulator 
            src={getImageUrl(study.imageId)}
            fillColor={study.learningPath?.color || colors.lavender}
            altText={getAltText(study.imageId)}
        />
    )
}