export type Category =
    'Biology Learning' |
    'Curated Studies' |
    'Future Careers' |
    'Growth & Resilience' |
    'Interpersonal Skills' |
    'Learning Persistence' |
    'Memory & Retention' |
    'Personal Finance' |
    'Productivity' |
    'STEM Career' |
    'Study Strategies'

export const imageCategories: Category[] = [
    'Biology Learning',
    'Curated Studies',
    'Future Careers',
    'Growth & Resilience',
    'Interpersonal Skills',
    'Learning Persistence',
    'Memory & Retention',
    'Personal Finance',
    'Productivity',
    'STEM Career',
    'Study Strategies'
]

interface CardImage {
    imageId: string,
    category: Category,
    altText: string
}

export const getImageUrl = (imageId: string | undefined) => {
    if (!imageId) {
        return `https://kinetic-app-assets.s3.amazonaws.com/assets/card-images/placeholder.svg`
    }
    const image = cardImages.find(image => image.imageId === imageId)

    if (!image) {
        return `https://kinetic-app-assets.s3.amazonaws.com/assets/card-images/placeholder.svg`
    }

    return `/${image.category}/${image.imageId}`;
}

export const getAltText = (imageId: string | undefined, category: string | undefined) => {
    const image = cardImages.find(image => image.imageId === imageId)
    if (!image) {
        return 'Placeholder'
    }

    return image.altText
}

export const cardImages: CardImage[] = [
    {imageId: 'Biologist-2--Streamline-Bangalore.png', category: 'Biology Learning', altText: 'Biologist'},
    {imageId: 'Dna--Streamline-Bangalore.png', category: 'Biology Learning', altText: 'DNA'},

    {imageId: 'Education-Online-Learning-01--Streamline-Bangalore.png', category: 'Curated Studies', altText: 'Education Online Learning'},
    {imageId: 'Education-Online-Learning-02--Streamline-Bangalore.png', category: 'Curated Studies', altText: 'Education Online Learning'},
    {imageId: 'Job-Interview--Streamline-Bangalore.png',category: 'Curated Studies', altText: 'Education Online Learning'},
    {imageId: 'Leave-A-Review--Streamline-Bangalore.png',category: 'Curated Studies', altText: 'Education Online Learning'},
    {imageId: 'Leave-A-Review--Streamline-Bangalore.svg',category: 'Curated Studies', altText: 'Education Online Learning'},
    {imageId: 'Marketing-Filling-Survey-01--Streamline-Bangalore-Curated.png',category: 'Curated Studies', altText: 'Education Online Learning'},
    {imageId: 'Task-List--Streamline-Bangalore.png',category: 'Curated Studies', altText: 'Education Online Learning'},

    {imageId: 'Being-At-Peace-02--Streamline-Bangalore.png',category: 'Future Careers', altText: 'Education Online Learning'},
    {imageId: 'Customer-Service-Support-Faq--Streamline-Bangalore.png',category: 'Future Careers', altText: 'Education Online Learning'},
    {imageId: 'Education-Student-Active-01--Streamline-Bangalore.png',category: 'Future Careers', altText: 'Education Online Learning'},
    {imageId: 'Siblings--Streamline-Bangalore.png',category: 'Future Careers', altText: 'Education Online Learning'},
    {imageId: 'Users-People-Get-Inspired-01--Streamline-Bangalore.png',category: 'Future Careers', altText: 'Education Online Learning'},

    {imageId: 'Bandaid-On-Heart-4--Streamline-Bangalore.png',category: 'Growth & Resilience', altText: 'Education Online Learning'},
    {imageId: 'Bye-2--Streamline-Bangalore.png',category: 'Growth & Resilience', altText: 'Education Online Learning'},
    {imageId: 'Hr-Human-Resources-2--Streamline-Bangalore.png',category: 'Growth & Resilience', altText: 'Education Online Learning'},
    {imageId: 'Marketing-A-B-Testing-01--Streamline-Bangalore.png',category: 'Growth & Resilience', altText: 'Education Online Learning'},
    {imageId: 'Product-We-Got-A-Problem-01--Streamline-Bangalore.png',category: 'Growth & Resilience', altText: 'Education Online Learning'},
    {imageId: 'Shopping-Payment-With-Card-01--Streamline-Bangalore.png',category: 'Growth & Resilience', altText: 'Education Online Learning'},
    {imageId: 'Work-Overworked-Employee-01--Streamline-Bangalore.png',category: 'Growth & Resilience', altText: 'Education Online Learning'},

    {imageId: 'Bandaid-On-Heart-01--Streamline-Bangalore.png',category: 'Interpersonal Skills', altText: 'Education Online Learning'},
    {imageId: 'Collaboration-2--Streamline-Bangalore.png',category: 'Interpersonal Skills', altText: 'Education Online Learning'},
    {imageId: 'Collaboration-3--Streamline-Bangalore.png',category: 'Interpersonal Skills', altText: 'Education Online Learning'},
    {imageId: 'Multitasking--Streamline-Bangalore.png',category: 'Interpersonal Skills', altText: 'Education Online Learning'},
    {imageId: 'Product-We-Got-A-Problem-01--Streamline-Bangalore.png',category: 'Interpersonal Skills', altText: 'Education Online Learning'},
    {imageId: 'Remote-Team-2--Streamline-Bangalore.png',category: 'Interpersonal Skills', altText: 'Education Online Learning'},
    {imageId: 'Support-2--Streamline-Bangalore.png',category: 'Interpersonal Skills', altText: 'Education Online Learning'},
    {imageId: 'Time-Out-For-Work--Streamline-Bangalore.png',category: 'Interpersonal Skills', altText: 'Education Online Learning'},
    {imageId: 'Work-About-Us-About-Our-Team-01--Streamline-Bangalore.png',category: 'Interpersonal Skills', altText: 'Education Online Learning'},
    
    {imageId: 'Business-Go-To-Market-Strategy-01--Streamline-Bangalore.png',category: 'Learning Persistence', altText: 'Education Online Learning'},
    {imageId: 'Marketing-Filling-Survey-01--Streamline-Bangalore.png',category: 'Learning Persistence', altText: 'Education Online Learning'},
    {imageId: 'Marketing-Marketer-Giving-A-Keynote-01--Streamline-Bangalore.png',category: 'Learning Persistence', altText: 'Education Online Learning'},
    {imageId: 'Marketing-Marketing-Target-01--Streamline-Bangalore.png',category: 'Learning Persistence', altText: 'Education Online Learning'},
    {imageId: 'Promotion-1--Streamline-Bangalore.png',category: 'Learning Persistence', altText: 'Education Online Learning'},
    {imageId: 'Success-2--Streamline-Bangalore.png',category: 'Learning Persistence', altText: 'Education Online Learning'},
    {imageId: 'Users-People-Trophy-Awards-01--Streamline-Bangalore.png',category: 'Learning Persistence', altText: 'Education Online Learning'},

    {imageId: 'Brain-01--Streamline-Bangalore.png',category: 'Memory & Retention', altText: 'Education Online Learning'},
    {imageId: 'Brain-2--Streamline-Bangalore 1.png',category: 'Memory & Retention', altText: 'Education Online Learning'},
    {imageId: 'Documents-4--Streamline-Bangalore.png',category: 'Memory & Retention', altText: 'Education Online Learning'},
    {imageId: 'Product-Bring-Solutions-To-Problems-01--Streamline-Bangalore.png',category: 'Memory & Retention', altText: 'Education Online Learning'},
    {imageId: 'Work-Being-Creative-01--Streamline-Bangalore.png',category: 'Memory & Retention', altText: 'Education Online Learning'},
    {imageId: 'Working-Together--Streamline-Bangalore.png',category: 'Memory & Retention', altText: 'Education Online Learning'},

    {imageId: 'Bank-2--Streamline-Bangalore.png',category: 'Personal Finance', altText: 'Education Online Learning'},
    {imageId: 'Credit-Score-2--Streamline-Bangalore.png',category: 'Personal Finance', altText: 'Education Online Learning'},
    {imageId: 'Deposit-4--Streamline-Bangalore.png',category: 'Personal Finance', altText: 'Education Online Learning'},

    {imageId: 'Astronaut-3--Streamline-Bangalore.png',category: 'Productivity', altText: 'Education Online Learning'},
    {imageId: 'Being-At-Peace-01--Streamline-Bangalore.png',category: 'Productivity', altText: 'Education Online Learning'},
    {imageId: 'Business-Startup-New-Product-Launch-01--Streamline-Bangalore.png',category: 'Productivity', altText: 'Education Online Learning'},
    {imageId: 'Deadline--Streamline-Bangalore.png',category: 'Productivity', altText: 'Education Online Learning'},
    {imageId: 'Interface-Success-01--Streamline-Bangalore.png',category: 'Productivity', altText: 'Education Online Learning'},
    {imageId: 'Time-In-For-Work--Streamline-Bangalore.png',category: 'Productivity', altText: 'Education Online Learning'},
    {imageId: 'Work-Work-From-Home-01--Streamline-Bangalore.png',category: 'Productivity', altText: 'Education Online Learning'},

    {imageId: 'Laboratory--Streamline-Bangalore.png',category: 'STEM Career', altText: 'Education Online Learning'},
    {imageId: 'Mathematician--Streamline-Bangalore.png',category: 'STEM Career', altText: 'Education Online Learning'},
    {imageId: 'Mathematician-2--Streamline-Bangalore.png',category: 'STEM Career', altText: 'Education Online Learning'},
    {imageId: 'New-Discovery--Streamline-Bangalore.png',category: 'STEM Career', altText: 'Education Online Learning'},
    
    {imageId: 'Being-At-Peace-02--Streamline-Bangalore.png',category: 'Study Strategies', altText: 'Education Online Learning'},
    {imageId: 'School-2--Streamline-Bangalore.png',category: 'Study Strategies', altText: 'Education Online Learning'},
    {imageId: 'Therapy-Counseling--Streamline-Bangalore.png',category: 'Study Strategies', altText: 'Education Online Learning'},
]