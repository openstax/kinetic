export const BaseUrl = 'https://kinetic-app-assets.s3.amazonaws.com/assets/card-images'

export type Category =
    'School & Future Career' |
    'Personality' |
    'Memory' |
    'Learning' |
    'Nonhuman' |
    'Other'

export const imageCategories: Category[] = [
    'School & Future Career',
    'Personality',
    'Memory',
    'Learning',
    'Nonhuman',
    'Other',
]

interface CardImage {
    imageId: string,
    category: Category[],
}

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
        return `${BaseUrl}/${cardImages[0].imageId}.svg`
    }

    if (legacyImageMap[imageId]) {
        return `${BaseUrl}/${legacyImageMap[imageId]}.svg`;
    }
    return `${BaseUrl}/${imageId}.svg`;
}

export const cardImages: CardImage[] = [
    { imageId: 'Schoolfuturecareer_1', category: ['School & Future Career'] },
    { imageId: 'Schoolfuturecareer_2', category: ['School & Future Career'] },
    { imageId: 'Schoolfuturecareer_3', category: ['School & Future Career'] },
    { imageId: 'Schoolfuturecareer_4', category: ['School & Future Career'] },
    { imageId: 'Schoolfuturecareer_5', category: ['School & Future Career'] },
    { imageId: 'Schoolfuturecareer_6', category: ['School & Future Career'] },
    { imageId: 'Schoolfuturecareer_7', category: ['School & Future Career'] },
    { imageId: 'Schoolfuturecareer_8', category: ['School & Future Career'] },
    { imageId: 'Schoolfuturecareer_9', category: ['School & Future Career'] },
    { imageId: 'Schoolfuturecareer_10', category: ['School & Future Career'] },
    { imageId: 'Schoolfuturecareer_11', category: ['School & Future Career'] },
    { imageId: 'Schoolfuturecareer_12', category: ['School & Future Career'] },
    { imageId: 'Schoolfuturecareer_13', category: ['School & Future Career'] },
    { imageId: 'Schoolfuturecareer_14', category: ['School & Future Career'] },
    { imageId: 'Schoolfuturecareer_15', category: ['School & Future Career'] },
    { imageId: 'Schoolfuturecareer_16', category: ['School & Future Career'] },
    { imageId: 'Schoolfuturecareer_17', category: ['School & Future Career'] },
    { imageId: 'Schoolfuturecareer_18', category: ['School & Future Career'] },
    { imageId: 'Schoolfuturecareer_19', category: ['School & Future Career'] },
    { imageId: 'Schoolfuturecareer_20', category: ['School & Future Career'] },
    { imageId: 'Schoolfuturecareer_21', category: ['School & Future Career'] },
    { imageId: 'Schoolfuturecareer_22', category: ['School & Future Career'] },
    { imageId: 'PersonalitySchoolcareer_1', category: ['School & Future Career', 'Personality'] },
    { imageId: 'PersonalitySchoolcareer_2', category: ['School & Future Career', 'Personality'] },
    { imageId: 'Personality_1', category: ['Personality'] },
    { imageId: 'Personality_2', category: ['Personality'] },
    { imageId: 'Personality_3', category: ['Personality'] },
    { imageId: 'Personality_4', category: ['Personality'] },
    { imageId: 'Personality_5', category: ['Personality'] },
    { imageId: 'Personality_6', category: ['Personality'] },
    { imageId: 'Personality_7', category: ['Personality'] },
    { imageId: 'Personality_8', category: ['Personality'] },
    { imageId: 'Personality_9', category: ['Personality'] },
    { imageId: 'Personality_10', category: ['Personality'] },
    { imageId: 'Personality_11', category: ['Personality'] },
    { imageId: 'Personality_12', category: ['Personality'] },
    { imageId: 'Personality_13', category: ['Personality'] },
    { imageId: 'Personality_14', category: ['Personality'] },
    { imageId: 'Personality_15', category: ['Personality'] },
    { imageId: 'Personality_16', category: ['Personality'] },
    { imageId: 'Personality_17', category: ['Personality'] },
    { imageId: 'Personality_18', category: ['Personality'] },
    { imageId: 'Other_1', category: ['Other'] },
    { imageId: 'Other_2', category: ['Other'] },
    { imageId: 'Other_3', category: ['Other'] },
    { imageId: 'Other_4', category: ['Other'] },
    { imageId: 'Other_5', category: ['Other'] },
    { imageId: 'Other_6', category: ['Other'] },
    { imageId: 'Other_7', category: ['Other'] },
    { imageId: 'Other_8', category: ['Other'] },
    { imageId: 'Other_9', category: ['Other'] },
    { imageId: 'Demographic', category: ['Other'] },
    { imageId: 'Nonhuman_1', category: ['Nonhuman'] },
    { imageId: 'Nonhuman_2', category: ['Nonhuman'] },
    { imageId: 'Nonhuman_3', category: ['Nonhuman'] },
    { imageId: 'Nonhuman_4', category: ['Nonhuman'] },
    { imageId: 'Nonhuman_5', category: ['Nonhuman'] },
    { imageId: 'Nonhuman_6', category: ['Nonhuman'] },
    { imageId: 'Nonhuman_7', category: ['Nonhuman'] },
    { imageId: 'MemoryLearning_1', category: ['Memory', 'Learning'] },
    { imageId: 'MemoryLearning_2', category: ['Memory', 'Learning'] },
    { imageId: 'Memory_1', category: ['Memory'] },
    { imageId: 'Memory_2', category: ['Memory'] },
    { imageId: 'Memory_3', category: ['Memory'] },
    { imageId: 'Memory_4', category: ['Memory'] },
    { imageId: 'Memory_5', category: ['Memory'] },
    { imageId: 'Memory_6', category: ['Memory'] },
    { imageId: 'Memory_7', category: ['Memory'] },
    { imageId: 'Memory_8', category: ['Memory'] },
    { imageId: 'Memory_9', category: ['Memory'] },
    { imageId: 'Memory_10', category: ['Memory'] },
    { imageId: 'Memory_11', category: ['Memory'] },
    { imageId: 'Memory_12', category: ['Memory'] },
    { imageId: 'Learning_1', category: ['Learning'] },
    { imageId: 'Learning_2', category: ['Learning'] },
    { imageId: 'Learning_3', category: ['Learning'] },
    { imageId: 'Learning_4', category: ['Learning'] },
    { imageId: 'Learning_5', category: ['Learning'] },
    { imageId: 'Learning_6', category: ['Learning'] },
    { imageId: 'Learning_7', category: ['Learning'] },
    { imageId: 'Learning_8', category: ['Learning'] },
    { imageId: 'Learning_9', category: ['Learning'] },
    { imageId: 'Learning_10', category: ['Learning'] },
    { imageId: 'Learning_11', category: ['Learning'] },
    { imageId: 'Learning_12', category: ['Learning'] },
    { imageId: 'Learning_13', category: ['Learning'] },
    { imageId: 'Learning_14', category: ['Learning'] },
    { imageId: 'Learning_15', category: ['Learning'] },
    { imageId: 'Learning_16', category: ['Learning'] },
    { imageId: 'Learning_17', category: ['Learning'] },
    { imageId: 'Learning_18', category: ['Learning'] },
]
