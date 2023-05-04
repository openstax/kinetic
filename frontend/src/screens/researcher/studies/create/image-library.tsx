import { Button, Col, Modal } from '@components'
import { Box, React, styled, useState } from '@common';
import { colors } from '@theme';
import { cardImages, Category, getImageUrl, imageCategories } from '../../../../components/study-card-images/card-images';

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
    imageId: string,
    selectedImage: string,
    onSelect: (imageId?: string) => void
}> = ({ imageId, selectedImage, onSelect }) => {
    return (
        <div
            css={{ position: 'relative', cursor: 'pointer' }}
            onClick={() => {
                if (imageId === selectedImage) {
                    onSelect('')
                } else {
                    onSelect(imageId)
                }
            }}
        >
            <img src={getImageUrl(imageId)} alt={imageId} width={250} height={140} css={{
                border: `1px solid ${colors.lightGray}`,
                padding: `0 25px`,
            }}/>
            {selectedImage === imageId ? <CheckedCircle/> : <UncheckedCircle/>}
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
    onSelect: (imageId: string) => void,
    currentImage?: string
}> = ({ show, onHide, onSelect, currentImage }) => {
    const [category, setCategory] = useState<Category>('Personality')
    const [selectedImage, setSelectedImage] = useState<string>(currentImage || 'Schoolfuturecareer_1')
    return (
        <Modal
            onHide={onHide}
            center
            show={show}
            xlarge
            data-testid="image-library-modal"
            title='Image Library'
        >
            <Modal.Body css={{ padding: 0, height: 500 }}>
                <Box height='100%'>
                    <Col sm={2}
                        direction='column'
                        css={{
                            backgroundColor: colors.pageBackground,
                            padding: `20px 15px`,
                        }}
                        gap='large'
                    >
                        <h6>Category</h6>
                        {imageCategories.map(c =>
                            <CategoryLink key={c} onClick={() => setCategory(c)}>
                                {c}
                            </CategoryLink>
                        )}
                    </Col>
                    <Col sm={10} direction='column'>
                        <Box css={{ padding: 20, height: '100%' }} direction='column'>
                            <h4>{category}</h4>
                            <ImageCardContainer wrap gap='xlarge' justify='evenly'>
                                {cardImages.filter(i => i.category.includes(category)).map(cardImage => (
                                    <ImageCard
                                        key={cardImage.imageId}
                                        imageId={cardImage.imageId}
                                        selectedImage={selectedImage}
                                        onSelect={(imageId?: string) => setSelectedImage(imageId || '')}
                                    />
                                ))}
                            </ImageCardContainer>
                        </Box>
                        <Box gap='xlarge' css={{ padding: `10px 20px` }} alignSelf='end'>
                            <Button
                                className='btn-researcher-secondary'
                                css={{ width: 170, justifyContent: 'center' }}
                                onClick={() => onHide()}
                            >
                                Cancel
                            </Button>
                            <Button
                                className='btn-researcher-primary'
                                disabled={!selectedImage}
                                css={{ width: 170, justifyContent: 'center' }}
                                onClick={() => {
                                    onSelect(selectedImage)
                                    onHide()
                                }}
                            >
                                Select
                            </Button>
                        </Box>
                    </Col>
                </Box>
            </Modal.Body>
        </Modal>
    )
}
