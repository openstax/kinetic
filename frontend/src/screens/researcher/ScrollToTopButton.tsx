import React, { useEffect, useState } from 'react';
import { Box, Button } from '@mantine/core';
import { IconArrowUp } from '@tabler/icons-react';

const ScrollToTopButton: React.FC = () => {
    const [isVisible, setIsVisible] = useState(false);

    const handleScroll = () => {
        const scrolled = document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        if (scrolled > scrollHeight * 0.25) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    };

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <Box
            style={{
                position: 'fixed',
                left: '1rem',
                bottom: '1rem',
                display: isVisible ? 'block' : 'none',
                zIndex: 1000,
            }}
        >
            <Button
                onClick={scrollToTop}
                style={{
                    backgroundColor: '#007bff',
                    color: '#fff',
                    borderRadius: '50%',
                    width: '3rem',
                    height: '3rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <IconArrowUp />
            </Button>
        </Box>
    );
};

export default ScrollToTopButton;
