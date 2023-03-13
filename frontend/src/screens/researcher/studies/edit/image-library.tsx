import { Button, Col, Modal } from '@nathanstitt/sundry';
import { Box, React, styled, useState } from '@common';
import { colors } from '../../../../theme';
import { CardImage, cardImages } from '../../../../components/study-card-images/images';

const CategoryLink = styled.small({
    cursor: 'pointer',
    color: colors.kineticResearcher,
    textDecoration: 'underline',
    textUnderlineOffset: '.4rem',
})

const UncheckedCircle = styled.div({
    position: 'absolute',
    border: `2px solid ${colors.lightGray}`,
    width: 15,
    height: 15,
    borderRadius: 25,
    top: 10,
    right: 10,
})

const CheckedCircle = () => (
    <div css={{
        position: 'absolute',
        border: `2px solid ${colors.kineticResearcher}`,
        width: 15,
        height: 15,
        borderRadius: 25,
        top: 10,
        right: 10,
    }}>
        <div css={{
            color: colors.kineticResearcher,
            position: 'absolute',
            background: colors.kineticResearcher,
            width: 7,
            height: 7,
            top: '25%',
            right: '20%',
            borderRadius: 50,
        }}>

        </div>
    </div>
)

const ImageCard: FC<{
    image: CardImage,
    selectedImage: string,
    onSelect: (imageId?: string) => void
}> = ({ image, selectedImage, onSelect }) => {
    return (
        <div
            css={{ position: 'relative', cursor: 'pointer' }}
            onClick={() => onSelect(image.imageId)}
        >
            <image.image width={250} height={140} css={{
                border: `1px solid ${colors.lightGray}`,
                padding: `0 25px`,
            }}/>
            {selectedImage === image.imageId ? <CheckedCircle/> : <UncheckedCircle/>}
        </div>
    )
}

const ImageCardContainer = styled(Box)({
    height: '100%',
    overflow: 'auto',
    paddingTop: 10,
    gridTemplateColumns: 'repeat(3, [col-start] minmax(100px, 1fr) [col-end])',
})

export const ImageLibrary: FC<{
    show: boolean,
    onHide: () => void,
    onSelect: (imageId: string) => string
}> = ({ show, onHide, onSelect }) => {
    const [category, setCategory] = useState<string>('Personality')
    const [selectedImage, setSelectedImage] = useState<string>('')
    return (
        <Modal
            onHide={onHide}
            center
            show={show}
            xlarge
            data-test-id="image-library-modal"
            title='Image Library'
        >
            <Modal.Body css={{ padding: 0, height: 500 }}>
                <Box height='100%'>
                    <Col sm={2}
                        direction='column'
                        css={{
                            backgroundColor: colors.pageBackground,
                            padding: `30px 15px`,
                        }}
                        gap='large'
                    >
                        <h6>Category</h6>
                        <CategoryLink onClick={() => setCategory('Personality')}>Personality</CategoryLink>
                        <CategoryLink onClick={() => setCategory('Memory')}>Memory</CategoryLink>
                        <CategoryLink onClick={() => setCategory('Learning')}>Learning</CategoryLink>
                        <CategoryLink onClick={() => setCategory('School & Future Career')}>School & Future Career</CategoryLink>
                    </Col>
                    <Col sm={10} direction='column'>
                        <Box css={{ padding: `30px 15px`, height: '100%' }} direction='column'>
                            <h4>{category}</h4>
                            <ImageCardContainer wrap gap='xlarge' justify='center'>
                                {cardImages.map(cardImage => (
                                    <ImageCard
                                        image={cardImage}
                                        selectedImage={selectedImage}
                                        onSelect={(imageId?: string) => imageId && setSelectedImage(imageId)}
                                    />
                                ))}
                            </ImageCardContainer>
                        </Box>
                        <Box gap='xlarge' css={{ padding: `10px 20px` }} alignSelf='end'>
                            <Button large css={{ width: 170, justifyContent: 'center' }}>
                                Cancel
                            </Button>
                            <Button disabled={!selectedImage} large primary css={{ width: 170, justifyContent: 'center' }}>
                                Select
                            </Button>
                        </Box>
                    </Col>
                </Box>
            </Modal.Body>
        </Modal>
    )
}
