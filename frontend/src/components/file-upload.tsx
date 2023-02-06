import { Box, React, styled, useState } from '@common';
import { Button, FormSaveButton } from '@nathanstitt/sundry';
import { colors } from '../theme';
import { Icon } from './icon';

export interface FileUploadProps {
    className?: string
    name: string
    accept: string
    text?: string
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    // onSave: () => void
}

const FileUploader: FC<FileUploadProps> = ({
    name,
    accept,
    onChange,
    // onSave,
    text = 'Upload Image',
}) => {
    const hiddenFileInput = React.useRef<HTMLInputElement>(null);
    const [file, setFile] = useState<Blob>()
    const [preview, setPreview] = useState('');
    const [dragActive, setDragActive] = React.useState(false);

    const handleClick = () => {
        hiddenFileInput.current?.click()
    }

    const handleDrag = function(e: React.DragEvent<HTMLElement>) {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const handleDrop = function(e: React.DragEvent<HTMLElement>) {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const f = e.dataTransfer.files[0]
            setFile(f)
            setPreview(URL.createObjectURL(f))
        }
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        onChange(event)
        if (event.target.files && event.target.files.length > 0) {
            const f = event.target.files[0]
            setFile(f)
            setPreview(URL.createObjectURL(f))
        }
    };
    return (
        <Box
            css={{
                height: '100%',
                width: '100%',
                padding: '1rem',
                backgroundColor: dragActive ? colors.lightBlue : 'transparent',
                opacity: dragActive ? .5 : 1,
                border: dragActive ? '2px dashed gray' : 'none',
            }}
            direction='column'
            align='center'
            gap
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
        >
            {preview ?
                <AvatarPreview alt="Preview" src={preview} onClick={handleClick}/> :
                <Icon icon='cloudUpload' height={120}/>
            }


            {!preview &&
                <Box direction='column' align='center' gap>
                    <h5>Drag and drop your image here</h5>
                    <h6>or</h6>
                    <Button primary onClick={handleClick}>
                        <span>{text}</span>
                    </Button>
                </Box>
            }
            {preview && <FormSaveButton primary>
                Save
            </FormSaveButton>}
            <input
                type="file"
                name={name}
                accept={accept}
                ref={hiddenFileInput}
                onChange={handleChange}
                style={{ display: 'none' }}
            />
        </Box>
    );
}

const AvatarPreview = styled.img({
    borderRadius: '50%',
    border: `1px solid ${colors.lightGray}`,
    height: 200,
    width: 200,
})

export default FileUploader
