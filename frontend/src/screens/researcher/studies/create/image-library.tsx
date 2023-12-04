import { cardImages, getImageUrl, imageCategories } from '@components'
import { Box, React, styled, useState } from '@common';
import { colors } from '@theme';
import { Button, Flex, Group, Image, Modal, ScrollArea, SimpleGrid, Tabs } from '@mantine/core';


const UncheckedCircle = styled.div({
    position: 'absolute',
    border: `2px solid ${colors.gray50}`,
    width: 15,
    height: 15,
    borderRadius: 25,
    top: 10,
    right: 10,
})

const CheckedCircle = () => (
    <Box align='center' justify='center' css={{
        position: 'absolute',
        border: `2px solid ${colors.blue}`,
        width: 15,
        height: 15,
        borderRadius: 25,
        top: 10,
        right: 10,
    }}>
        <div css={{
            color: colors.blue,
            position: 'absolute',
            background: colors.blue,
            width: 7,
            height: 7,
            borderRadius: 50,
        }}>

        </div>
    </Box>
)

const ImageCard: FC<{
    imageId: string,
    selectedImage: string,
    onSelect: (imageId?: string) => void,
    altText: string
}> = ({ imageId, selectedImage, onSelect, altText }) => {
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
            {selectedImage === imageId ? <CheckedCircle/> : <UncheckedCircle/>}

            <Image src={getImageUrl(imageId)} data-testid='card-image' alt={altText} css={{
                border: `1px solid ${colors.gray50}`,
            }}/>
        </div>
    )
}

export const ImageLibrary: FC<{
    show: boolean,
    onHide: () => void,
    onSelect: (imageId: string) => void,
    currentImage?: string
}> = ({ show, onHide, onSelect, currentImage }) => {
    const initialCategory = cardImages.find(image => image.imageId == currentImage)?.category[0] || 'Learning'
    const [selectedImage, setSelectedImage] = useState<string>(currentImage || 'Schoolfuturecareer_1')

    return (
        <Modal
            onClose={onHide}
            centered
            opened={show}
            size='85%'
            title='Select an image for your study'
            styles={{
                body: {
                    padding: 0,
                },
            }}
        >
            <Modal.Body data-testid="image-library-modal">
                <Flex direction='column'>
                    <Tabs variant='pills' defaultValue={initialCategory} >
                        <Tabs.List px='md'>
                            {imageCategories.map(c =>
                                <Tabs.Tab value={c} key={c}>
                                    {c}
                                </Tabs.Tab>
                            )}
                        </Tabs.List>
                        {imageCategories.map(c =>
                            <Tabs.Panel value={c} mt='lg'>
                                <ScrollArea>
                                    <SimpleGrid spacing='lg' verticalSpacing='lg' cols={4} p='lg' h={600}>
                                        {cardImages.filter(i => i.category.includes(c)).map(cardImage => (
                                            <ImageCard
                                                key={cardImage.imageId}
                                                imageId={cardImage.imageId}
                                                selectedImage={selectedImage}
                                                altText={cardImage.altText}
                                                onSelect={(imageId?: string) => setSelectedImage(imageId || '')}
                                            />
                                        ))}
                                    </SimpleGrid>
                                </ScrollArea>
                            </Tabs.Panel>
                        )}
                    </Tabs>
                    <Group style={{ alignSelf: 'end' }} p='xl'>
                        <Button variant='outline' onClick={() => onHide()}>
                            Cancel
                        </Button>
                        <Button
                            disabled={!selectedImage}
                            color='blue'
                            data-testid='select-card-image'
                            onClick={() => {
                                onSelect(selectedImage)
                                onHide()
                            }}
                        >
                            Select
                        </Button>
                    </Group>
                </Flex>
            </Modal.Body>
        </Modal>
    )
}
