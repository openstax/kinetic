export const BaseUrl = 'https://kinetic-app-assets.s3.amazonaws.com/assets/card-images'

export type Category =
    'Learning' |
    'Memory' |
    'Personality' |
    'School & Career' |
    'Other'

export const imageCategories: Category[] = [
    'Learning',
    'Memory',
    'Personality',
    'School & Career',
    'Other',
]

interface CardImage {
    imageId: string,
    category: Category[],
    altText: string
}

// TODO These can be removed once we update everything on prod
const legacyImageMap: Record<string, string> = {
    'AbilityBeliefs': 'Schoolfuturecareer_19',
    'AnxiousPersonNew': 'Personality_1',
    'AreYouSuperReader': 'MemoryLearning_2',
    'Biology1': 'Learning_6',
    'Biology2': 'Learning_3',
    'Biology3': 'Other_1',
    'ControlOverYourLife': 'Personality_3',
    'Demographic': 'Demographic',
    'DoYouFitIn': 'Personality_4',
    'DoYouStickWithGoal': 'Schoolfuturecareer_16',
    'FinancialLiteracy': 'Other_9',
    'HowDoYouStudyOnline': 'Learning_8',
    'HowImpulsiveAreYou': 'Personality_7',
    'HowManyLettersYouRemember': 'MemoryLearning_1',
    'HowMuchYouRemeberFromScience': 'Memory_10',
    'NewPersonalityTraits': 'Personality_6',
    'PatternRecognition': 'Memory_11',
    'PotentialFutureCareer': 'Schoolfuturecareer_18',
    'Psychology': 'Learning_9',
    'RememberNumbersWhenReading': 'MemoryLearning_1',
    'StemInterest': 'Schoolfuturecareer_21',
    'UncoverAchievementLearning': 'Schoolfuturecareer_22',
}

export const getImageUrl = (imageId: string | undefined) => {
    if (!imageId) {
        // TODO In the future, placeholder?
        return ''
    }

    if (legacyImageMap[imageId]) {
        return `${BaseUrl}/${legacyImageMap[imageId]}.svg`;
    }
    return `${BaseUrl}/${imageId}.svg`;
}

export const cardImages: CardImage[] = [
    { imageId: 'Schoolfuturecareer_1', category: ['School & Career'], altText: 'A young adult seated in front of a desk with a briefcase next to them while the person behind the desk looks down at papers' },
    { imageId: 'Schoolfuturecareer_2', category: ['School & Career'], altText: 'A young adult confidently standing up while holding a trophy over their head' },
    { imageId: 'Schoolfuturecareer_3', category: ['School & Career'], altText: 'A group of smiling young people hanging out on top of their tablets and laptops while holding light bulbs in their hands' },
    { imageId: 'Schoolfuturecareer_4', category: ['School & Career'], altText: 'A young person high-fiving a brain while surrounded by images of molecules, equations, binary sequences and geometrical shapes ' },
    { imageId: 'Schoolfuturecareer_5', category: ['School & Career'], altText: 'A young person confidently standing on podium while a set of hands extend them a ribbon and a trophy indicating they’ve won first place' },
    { imageId: 'Schoolfuturecareer_6', category: ['School & Career'], altText: 'A young person confidently wearing a medal around their neck and holding two trophies indicating they’ve won first place' },
    { imageId: 'Schoolfuturecareer_7', category: ['School & Career'], altText: 'A young person standing on a podium while another person places a medal around their neck' },
    { imageId: 'Schoolfuturecareer_8', category: ['School & Career'], altText: 'A group of people raising their hands up, throwing confetti and their graduation cap in the air while holding a diploma on their hand ' },
    { imageId: 'Schoolfuturecareer_9', category: ['School & Career'], altText: 'A young adult seated in front of a desk while the person behind the desk reviews a paper with a profile picture in it' },
    { imageId: 'Schoolfuturecareer_10', category: ['School & Career'], altText: 'A young person opening a letter while looking up at the image of a briefcase shown in the form of thought' },
    { imageId: 'Schoolfuturecareer_11', category: ['School & Career'], altText: 'A young adult looking down at their laptop while surrounded by images of a resume and a briefcase shown in the form of thoughts' },
    { imageId: 'Schoolfuturecareer_12', category: ['School & Career'], altText: 'A couple of young adults wearing a graduation gown and holding their diplomas over their heads' },
    { imageId: 'Schoolfuturecareer_13', category: ['School & Career'], altText: 'A young adult using a telescope to stare at graphs in the sky' },
    { imageId: 'Schoolfuturecareer_14', category: ['School & Career'], altText: 'A young adult standing at the peak of a mountain while holding a trophy in their hands' },
    { imageId: 'Schoolfuturecareer_15', category: ['School & Career'], altText: 'A couple of young adults weaving their hands in the sky while standing on top of a large graduation cap next to a large diploma' },
    { imageId: 'Schoolfuturecareer_16', category: ['School & Career'], altText: 'A couple of young adults leveling and positioning a graph in the wall' },
    { imageId: 'Schoolfuturecareer_17', category: ['School & Career'], altText: 'A young adult seated at their desk looking down at papers raising their hands to their head while looking overwhelmed' },
    { imageId: 'Schoolfuturecareer_18', category: ['School & Career'], altText: 'A young person seated cross-legged at an airport bench next to their luggage while typing on their laptop' },
    { imageId: 'Schoolfuturecareer_19', category: ['School & Career'], altText: 'A group of young people involved in a group discussion while surrounded by images of thoughts shown above their heads' },
    { imageId: 'Schoolfuturecareer_20', category: ['School & Career'], altText: 'An adult carrying a suitcase stepping up different levels that get increasingly higher in height' },
    { imageId: 'Schoolfuturecareer_21', category: ['School & Career'], altText: 'An adult in a lab wearing a lab coat and goggles holding a chemical flask and vial' },
    { imageId: 'Schoolfuturecareer_22', category: ['School & Career'], altText: 'An adult splitted into three different people taking calls and working on a laptop' },
    { imageId: 'PersonalitySchoolcareer_1', category: ['School & Career', 'Personality'], altText: 'A smiling young adult seated at their desk staring at their laptop while images of tasks and emails are shown in the form of a thought' },
    { imageId: 'PersonalitySchoolcareer_2', category: ['School & Career', 'Personality'], altText: 'A smiling young adult raising their hands at the sky while images of a plane, a paint brush, a laptop, a microphone, graphs and a coin are shown in the form of thoughts' },
    { imageId: 'Personality_1', category: ['Personality'], altText: 'A young adult seated cross-legged while practicing meditation next to an incense burner' },
    { imageId: 'Personality_2', category: ['Personality'], altText: 'A young adult confidently walking towards the direction pointed by a smiley face sign' },
    { imageId: 'Personality_3', category: ['Personality'], altText: 'A young adult seated cross-legged on top of a cloud floating in the sky while surrounded by the images of a book, a tablet and a coin in the form of thoughts' },
    { imageId: 'Personality_4', category: ['Personality'], altText: 'A group of young adults hanging around smiling and talking to each other' },
    { imageId: 'Personality_5', category: ['Personality'], altText: 'A confident group of young adults dressed up and heading out together, while smiling and raising their arms up in excitement' },
    { imageId: 'Personality_6', category: ['Personality'], altText: 'A young adult standing on top of a balance station surrounded by the images of a number of different activities indicating a well rounded person' },
    { imageId: 'Personality_7', category: ['Personality'], altText: 'A young adult staring down at their wrist watch looking concerned while rushing in a certain direction' },
    { imageId: 'Personality_8', category: ['Personality'], altText: 'A young adult seated at their desk looking down at papers raising their hands to their head while looking overwhelmed' },
    { imageId: 'Personality_9', category: ['Personality'], altText: 'A group of three young adults wearing sunglasses and looking confident while pointing finger guns into the air' },
    { imageId: 'Personality_10', category: ['Personality'], altText: 'A young adult wearing a pajama at their desk while their cat walks in front of their screen' },
    { imageId: 'Personality_11', category: ['Personality'], altText: 'One smiling young adult holding a balloon while the other is inflating theirs' },
    { imageId: 'Personality_12', category: ['Personality'], altText: 'A group of young adults hanging out together laughing and hugging each other' },
    { imageId: 'Personality_13', category: ['Personality'], altText: 'Two young adults hanging out together, smiling and hugging each other' },
    { imageId: 'Personality_14', category: ['Personality'], altText: 'A young adult standing in a yoga mat alongside their cat and an incense burner holding a yoga pose' },
    { imageId: 'Personality_15', category: ['Personality'], altText: 'Three young adults engaging in activities together. One playing video games, another playing guitar, and another playing tennis on a string' },
    { imageId: 'Personality_16', category: ['Personality'], altText: 'A group of five people holding each other in a tight hug' },
    { imageId: 'Personality_17', category: ['Personality'], altText: 'An adult wearing a skydiving suit reluctantly standing at the edge of a cliff while looking scared' },
    { imageId: 'Personality_18', category: ['Personality'], altText: 'A young adult seated at the top of a mountain reaching out to help pull someone else up' },
    { imageId: 'Other_1', category: ['Other'], altText: 'A young adult lying face down in bed next to a laptop showing an image of a spaceship' },
    { imageId: 'Other_2', category: ['Other'], altText: 'A young adult standing inside a large box sending out to the sky light bulbs with wings ' },
    { imageId: 'Other_3', category: ['Other'], altText: 'A young adult standing in front of a human size task list marking out completed tasks' },
    { imageId: 'Other_4', category: ['Other'], altText: 'A young adult standing in front of a human size task list marking out completed tasks' },
    { imageId: 'Other_5', category: ['Other'], altText: 'A smiling parent standing next to a child watering a tree' },
    { imageId: 'Other_6', category: ['Other'], altText: 'A smiling adult laying down on a hammock' },
    { imageId: 'Other_7', category: ['Other'], altText: 'A smiling adult cycling around surrounded by trees' },
    { imageId: 'Other_8', category: ['Other'], altText: 'An adult wearing winter clothes walking their dog in the park' },
    { imageId: 'Other_9', category: ['Other'], altText: 'A young adult placing a large coin into an oversized piggy bank' },
    { imageId: 'Nonhuman_1', category: ['Other'], altText: 'A large telescope departing from earth to space, where space is made of planets, stars and a question mark' },
    { imageId: 'Nonhuman_2', category: ['Other'], altText: 'An image of a desk setup from above showing a laptop, mouse and keyboard, cup of coffee, and paperwork' },
    { imageId: 'Nonhuman_3', category: ['Other'], altText: 'An image of a desk setup from an angle showing a laptop, mouse and keyboard, cup of coffee, and paperwork' },
    { imageId: 'Nonhuman_4', category: ['Other'], altText: 'An image of a desk setup showing a desktop pc, mouse and keyboard, cup of coffee, and a cactus' },
    { imageId: 'Nonhuman_5', category: ['Other'], altText: 'The image of a brain surrounded by a set of cog wheels, a chemical flask and a spaceship' },
    { imageId: 'Nonhuman_6', category: ['Other'], altText: 'The image of a brain with light bulbs shown all around it' },
    { imageId: 'Nonhuman_7', category: ['Other'], altText: 'The image of a brain containing multiple cog wheels positioned under a thunderstorm' },
    { imageId: 'Demographic', category: ['Other'], altText: 'A diverse group of young adults smiling and staring ahead' },
    { imageId: 'MemoryLearning_1', category: ['Memory', 'Learning'], altText: 'A teenager seated at their desk raising their hand while a speech bubble is shown in front of them' },
    { imageId: 'MemoryLearning_2', category: ['Memory', 'Learning'], altText: 'A young adult cross-legged seated on top of a pile of books smiling down at a large book they’re holding' },
    { imageId: 'Memory_1', category: ['Memory'], altText: 'The image of a brain containing multiple cog wheels positioned under a thunderstorm' },
    { imageId: 'Memory_2', category: ['Memory'], altText: 'A buddhist monk practicing meditation while levitating in the sky ' },
    { imageId: 'Memory_3', category: ['Memory'], altText: 'The image of a brain with light bulbs shown all around it' },
    { imageId: 'Memory_4', category: ['Memory'], altText: 'A young adult seating at their desk writing down notes on a paper while images of a lightbulb, a painting, a graph, a magnifying glass and cog wheels are shown in the form of a thought' },
    { imageId: 'Memory_5', category: ['Memory'], altText: 'The image of a brain surrounded by a set of cog wheels, a chemical flask and a spaceship' },
    { imageId: 'Memory_6', category: ['Memory'], altText: 'A smiling young adult seated at their desk staring at their chemical flask while writing down notes on a paper' },
    { imageId: 'Memory_7', category: ['Memory'], altText: 'An adult crossing their arms with a thinking face on surrounded by physics and math symbols shown in the form of thoughts' },
    { imageId: 'Memory_8', category: ['Memory'], altText: 'A smiling young adult leaning back on their chair with their feet up on the desk thinking while surrounded by papers on the wall' },
    { imageId: 'Memory_9', category: ['Memory'], altText: 'A young adult seating at their desk writing down notes on a paper while images of a lightbulb, a painting, a graph, a magnifying glass and cog wheels are shown in the form of a thought' },
    { imageId: 'Memory_10', category: ['Memory'], altText: 'A male teacher standing in front of a group of students pointing at the board, while a student raises their hand' },
    { imageId: 'Memory_11', category: ['Memory'], altText: 'A young adult staring down at geometric shapes while surrounded by the images of geometric shapes in the form of thought' },
    { imageId: 'Memory_12', category: ['Memory'], altText: 'A smiling young adult staring ahead while their head opens in the shape of box and their brain floats above it' },
    { imageId: 'Learning_1', category: ['Learning'], altText: 'Teenager seated at the desk working through assignments in their computer' },
    { imageId: 'Learning_2', category: ['Learning'], altText: 'Young adult seated at a design table, designing engineering parts for a physical product' },
    { imageId: 'Learning_3', category: ['Learning'], altText: 'Adult wearing a Virtual Reality headset virtually manipulating molecules and DNA Helices' },
    { imageId: 'Learning_4', category: ['Learning'], altText: 'Adult intensively looking down at a book while numbers are shown around them in a form of thought' },
    { imageId: 'Learning_5', category: ['Learning'], altText: 'Adult wearing protection goggles while confidently conducting chemical experiments in a lab' },
    { imageId: 'Learning_6', category: ['Learning'], altText: 'Young adult wearing a lab coat and goggles starring perplexed at a chemical flask that’s emitting smoke' },
    { imageId: 'Learning_7', category: ['Learning'], altText: 'A profile view of a young adult staring at a laptop where a virtual book containing exercises and videos is shown' },
    { imageId: 'Learning_8', category: ['Learning'], altText: 'A teenager calmly looking at their laptop while listening to music through their headphones and writing down notes on a paper' },
    { imageId: 'Learning_9', category: ['Learning'], altText: 'Two adults informally seated in front of each other, one engaging in an active conversation while the other writes notes on a laptop placed on their lap' },
    { imageId: 'Learning_10', category: ['Learning'], altText: 'A young adult seated on a large book staring at their laptop while coding tags are shown around them in the form of thought' },
    { imageId: 'Learning_11', category: ['Learning'], altText: 'A large telescope departing from earth to space, where space is made of planets, stars and a question mark' },
    { imageId: 'Learning_12', category: ['Learning'], altText: 'An adult wearing their headphones and seated in front of their laptop while a book is shown next to them in the form of thought' },
    { imageId: 'Learning_13', category: ['Learning'], altText: 'A smiling young person lying belly down on the floor listening to music through their headphones while reading a book' },
    { imageId: 'Learning_14', category: ['Learning'], altText: 'The image of a hand writing down on a chalkboard positioned on a desk next to a notebook and a calculator' },
    { imageId: 'Learning_15', category: ['Learning'], altText: 'A young adult with an inquisitive look on their face wearing a lab coat and goggles while staring at a vial and writing down notes on a paper' },
    { imageId: 'Learning_16', category: ['Learning'], altText: 'A young adult relaxing on a chair while reading a book under a floor light' },
    { imageId: 'Learning_17', category: ['Learning'], altText: 'A female teacher standing in front of a group of students pointing at the board, while a student raises their hand' },
    { imageId: 'Learning_18', category: ['Learning'], altText: 'A young adult relaxing on a chair in a library reading a book' },
]
