import { React, styled } from '@common';

export interface FileUploadProps {
    className?: string
    name: string
    accept: string
    text?: string
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

const Button = styled.button`
  /* Insert your favorite CSS code to style a button */
`;

const FileUploader: React.FC<FileUploadProps> = ({ name, accept, onChange, text = 'Upload Image' }) => {
    const hiddenFileInput = React.useRef<HTMLInputElement>(null);

    const handleClick = () => {
        hiddenFileInput.current?.click()
    }

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            onChange(event)
        }
    };
    return (
        <>
            <Button onClick={handleClick}>
                {text}
            </Button>
            <input
                type="file"
                name={name}
                accept={accept}
                ref={hiddenFileInput}
                onChange={handleChange}
                style={{ display: 'none' }}
            />
        </>
    );
}

export default FileUploader
