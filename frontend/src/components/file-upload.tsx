import { Box, React, styled, useState } from '@common';
import { Button, FormSaveButton } from '@components'
import { colors } from '../theme';
import { Icon } from './icon';

export interface FileUploadProps {
    className?: string
    name: string
    accept: string
    text?: string
    onChange: (file: File) => void
}

const FileUploader: FC<FileUploadProps> = ({
    name,
    accept,
    onChange,
    text = 'Upload Image',
}) => {
    const hiddenFileInput = React.useRef<HTMLInputElement>(null);
    const [preview, setPreview] = useState('');
    const [dragActive, setDragActive] = React.useState(false);
    const [error, setError] = React.useState('');

    const handleClick = () => {
        hiddenFileInput.current?.click()
    }

    const hasError = (f: File): boolean => {
        if (f.type == 'image/png' || f.type == 'image/jpeg') {
            setError('')
            return false
        } else {
            setError(`“Image format not supported, please upload only jpg or png files”`)
            return true
        }
    }

    const handleFile = (f: File) => {
        if (!hasError(f)) {
            setPreview(URL.createObjectURL(f))
            onChange(f)
        }
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
            handleFile(f)
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const f = e.target.files[0]
            handleFile(f)
        }
    };
    return (
        <Box
            css={{
                height: '100%',
                width: '100%',
                padding: '1rem',
                backgroundColor: dragActive ? colors.blue50 : 'transparent',
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
                    <h5>Drag and drop your profile image here</h5>
                    <h6>or</h6>
                    <Button primary onClick={handleClick}>
                        <span>{text}</span>
                    </Button>
                    <small>File format: jpg or png only</small>
                </Box>
            }
            {preview && <FormSaveButton disabled={!!error} primary>
                Save Changes
            </FormSaveButton>}
            {!!error && <span css={{ color: 'red' }}>{error}</span>}
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
    border: `1px solid ${colors.gray50}`,
    height: 200,
    width: 200,
})

export default FileUploader
