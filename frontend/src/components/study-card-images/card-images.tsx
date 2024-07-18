export type Category =
    'Biology Learning' |
    'Curated Studies' |
    'Future Careers' |
    'Growth & Resilience' |
    'Interpersonal Skills' |
    'Learning Persistence' |
    'Mental Agility' |
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
    'Mental Agility',
    'Personal Finance',
    'Productivity',
    'STEM Career',
    'Study Strategies',
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

export const getAltText = (imageId: string | undefined) => {
    const image = cardImages.find(image => image.imageId === imageId)
    if (!image) {
        return 'Placeholder'
    }

    return image.altText
}

export const cardImages: CardImage[] = [
    { imageId: 'Biologist-2--Streamline-Bangalore.svg', category: 'Biology Learning', altText: 'A Microscopic image of a cell' },
    { imageId: 'Dna--Streamline-Bangalore.svg', category: 'Biology Learning', altText: 'A DNA strand' },

    { imageId: 'Education-Online-Learning-01--Streamline-Bangalore.svg', category: 'Curated Studies', altText: 'A lady listenning to an online lecture' },
    { imageId: 'Education-Online-Learning-02--Streamline-Bangalore.svg', category: 'Curated Studies', altText: 'A hat placed on top of a screen which is displaying books' },
    { imageId: 'Job-Interview--Streamline-Bangalore.svg',category: 'Curated Studies', altText: 'A Job interview' },
    { imageId: 'Leave-A-Review--Streamline-Bangalore.svg',category: 'Curated Studies', altText: 'Leave a Review' },
    { imageId: 'Leave-A-Review--Streamline-Bangalore.svg',category: 'Curated Studies', altText: 'Leave a Review' },
    { imageId: 'Marketing-Filling-Survey-01--Streamline-Bangalore-Curated.svg',category: 'Curated Studies', altText: 'Marketting Filling Survey' },
    { imageId: 'Task-List--Streamline-Bangalore.svg',category: 'Curated Studies', altText: 'A Task List' },

    { imageId: 'Being-At-Peace-02--Streamline-Bangalore.svg',category: 'Future Careers', altText: 'A Woman being at peace' },
    { imageId: 'Customer-Service-Support-Faq--Streamline-Bangalore.svg',category: 'Future Careers', altText: 'Customer Service Support FAQ' },
    { imageId: 'Education-Student-Active-01--Streamline-Bangalore.svg',category: 'Future Careers', altText: 'Education Online Learning' },
    { imageId: 'Siblings--Streamline-Bangalore.svg',category: 'Future Careers', altText: 'Sibblings playing with a Teddy Bear' },
    { imageId: 'Users-People-Get-Inspired-01--Streamline-Bangalore.svg',category: 'Future Careers', altText: 'Users People get inspired' },

    { imageId: 'Bandaid-On-Heart-4--Streamline-Bangalore.svg',category: 'Growth & Resilience', altText: 'Bandaid on a Heart' },
    { imageId: 'Bye-2--Streamline-Bangalore.svg',category: 'Growth & Resilience', altText: 'A Lady showing peace sign using two hands' },
    { imageId: 'Hr-Human-Resources-2--Streamline-Bangalore.svg',category: 'Growth & Resilience', altText: 'HR Human Resources' },
    { imageId: 'Marketing-A-B-Testing-01--Streamline-Bangalore.svg',category: 'Growth & Resilience', altText: 'Marketting AB Testing' },
    { imageId: 'Product-We-Got-A-Problem-01--Streamline-Bangalore-Growth.svg',category: 'Growth & Resilience', altText: 'Product we got a problem' },
    { imageId: 'Shopping-Payment-With-Card-01--Streamline-Bangalore.svg',category: 'Growth & Resilience', altText: 'Shopping Payment with a card' },
    { imageId: 'Work-Overworked-Employee-01--Streamline-Bangalore.svg',category: 'Growth & Resilience', altText: 'Overworked Employee' },

    { imageId: 'Bandaid-On-Heart-01--Streamline-Bangalore.svg',category: 'Interpersonal Skills', altText: 'Bandaid on a Heart' },
    { imageId: 'Collaboration-2--Streamline-Bangalore.svg',category: 'Interpersonal Skills', altText: 'Collaboration using lego blocks' },
    { imageId: 'Collaboration-3--Streamline-Bangalore.svg',category: 'Interpersonal Skills', altText: 'Collaboration Hi-Fi' },
    { imageId: 'Multitasking--Streamline-Bangalore.svg',category: 'Interpersonal Skills', altText: 'A Multitaking person' },
    { imageId: 'Product-We-Got-A-Problem-01--Streamline-Bangalore.svg',category: 'Interpersonal Skills', altText: 'Product we got a problem' },
    { imageId: 'Remote-Team-2--Streamline-Bangalore.svg',category: 'Interpersonal Skills', altText: 'A remote team meeting' },
    { imageId: 'Support-2--Streamline-Bangalore.svg',category: 'Interpersonal Skills', altText: 'A Person sitting on a supporting hand' },
    { imageId: 'Time-Out-For-Work--Streamline-Bangalore.svg',category: 'Interpersonal Skills', altText: 'Time Out for Work' },
    { imageId: 'Work-About-Us-About-Our-Team-01--Streamline-Bangalore.svg',category: 'Interpersonal Skills', altText: 'Two people doing a Hi-Fi' },
    
    { imageId: 'Business-Go-To-Market-Strategy-01--Streamline-Bangalore.svg',category: 'Learning Persistence', altText: 'Two Chess pieces and an arrow' },
    { imageId: 'Marketing-Filling-Survey-01--Streamline-Bangalore.svg',category: 'Learning Persistence', altText: 'Marketting Filling Survey' },
    { imageId: 'Marketing-Marketer-Giving-A-Keynote-01--Streamline-Bangalore.svg',category: 'Learning Persistence', altText: 'A Marketer giving a key note' },
    { imageId: 'Marketing-Marketing-Target-01--Streamline-Bangalore.svg',category: 'Learning Persistence', altText: 'A Person drawing an arrow' },
    { imageId: 'Promotion-1--Streamline-Bangalore.svg',category: 'Learning Persistence', altText: 'A Person being promoted' },
    { imageId: 'Success-2--Streamline-Bangalore.svg',category: 'Learning Persistence', altText: 'A Person Holding a winning trophy' },
    { imageId: 'Users-People-Trophy-Awards-01--Streamline-Bangalore.svg',category: 'Learning Persistence', altText: 'A Person winning an award' },

    { imageId: 'Brain-01--Streamline-Bangalore.png',category: 'Mental Agility', altText: "Brain and it's functions" },
    { imageId: 'Brain-2--Streamline-Bangalore 1.png',category: 'Mental Agility', altText: "Head and it's brain" },
    { imageId: 'Documents-4--Streamline-Bangalore.svg',category: 'Mental Agility', altText: 'Documents' },
    { imageId: 'Product-Bring-Solutions-To-Problems-01--Streamline-Bangalore.svg',category: 'Mental Agility', altText: 'A Product bringing solution to problems' },
    { imageId: 'Work-Being-Creative-01--Streamline-Bangalore.svg',category: 'Mental Agility', altText: 'A Person sitting on a light bulb and flying' },
    { imageId: 'Working-Together--Streamline-Bangalore.svg',category: 'Mental Agility', altText: 'Putting two pieces together' },

    { imageId: 'Bank-2--Streamline-Bangalore.svg',category: 'Personal Finance', altText: 'An image of a bank' },
    { imageId: 'Credit-Score-2--Streamline-Bangalore.svg',category: 'Personal Finance', altText: 'Credit Score' },
    { imageId: 'Deposit-4--Streamline-Bangalore.svg',category: 'Personal Finance', altText: 'Money being deposited from wallet to bank' },

    { imageId: 'Astronaut-3--Streamline-Bangalore.svg',category: 'Productivity', altText: 'An astronaut' },
    { imageId: 'Being-At-Peace-01--Streamline-Bangalore-Prod.svg',category: 'Productivity', altText: 'Being at peace' },
    { imageId: 'Business-Startup-New-Product-Launch-01--Streamline-Bangalore.svg',category: 'Productivity', altText: 'Business Startup new Product launch' },
    { imageId: 'Deadline--Streamline-Bangalore.svg',category: 'Productivity', altText: 'Clock running on a deadline' },
    { imageId: 'Interface-Success-01--Streamline-Bangalore.svg',category: 'Productivity', altText: 'A Person lifting a trophy and jumping' },
    { imageId: 'Time-In-For-Work--Streamline-Bangalore.svg',category: 'Productivity', altText: 'Time in For Work' },
    { imageId: 'Work-Work-From-Home-01--Streamline-Bangalore.svg',category: 'Productivity', altText: 'Work From Home' },

    { imageId: 'Laboratory--Streamline-Bangalore.svg',category: 'STEM Career', altText: 'A Laboratory' },
    { imageId: 'Mathematician--Streamline-Bangalore.svg',category: 'STEM Career', altText: 'An image of Shapes' },
    { imageId: 'Mathematician-2--Streamline-Bangalore.svg',category: 'STEM Career', altText: 'A Person teaching Math' },
    { imageId: 'New-Discovery--Streamline-Bangalore.svg',category: 'STEM Career', altText: 'A hot air baloon cum lightbulb' },
    
    { imageId: 'Being-At-Peace-02--Streamline-Bangalore-Study.svg',category: 'Study Strategies', altText: 'A person being at peace' },
    { imageId: 'School-2--Streamline-Bangalore.svg',category: 'Study Strategies', altText: 'An image of a school' },
    { imageId: 'Therapy-Counseling--Streamline-Bangalore.svg',category: 'Study Strategies', altText: 'Therapy Counciling' },
]