import React, { SVGProps } from 'react'
import { loadAsync } from '../async'

export type CardImageProps = SVGProps<SVGSVGElement>

export interface CardImage {
    title: string
    image: React.FC<CardImageProps>
}


export const CardImages: Record<string, CardImage> = {
    AbilityBeliefs: { title: 'Ability Beliefs', image: loadAsync('image', () => import('./WhatAreYourAbilityBeliefs')) },
    AnxiousPersonNew: { title: 'Anxious Person New', image: loadAsync('image', () => import('./AnxiouPersonNew')) },
    AreYouAnxiousPerson: { title: 'Are You an Anxious Person', image: loadAsync('image', () => import('./AreYouAnxiousPerson01')) },
    AreYouSuperReader: { title: 'Are You a Super Reader', image: loadAsync('image', () => import('./AreYouSuperReader01')) },
    Biology1: { title: 'Biology Highlighting (Two Parts)', image: loadAsync('image', () => import('./BiologyCellsAndHighlightingTwoParts')) },
    Biology2: { title: 'BiologyPlusCellsLesson', image: loadAsync('image', () => import('./BiologyPlusCellsLesson')) },
    Biology3: { title: 'StemBio Data', image: loadAsync('image', () => import('./StemBiodata01')) },
    ControlOverYourLife: { title: 'How in Control', image: loadAsync('image', () => import('./HowInControlDoYouFeel')) },
    CorePersonality: { title: 'Core Personality', image: loadAsync('image', () => import('./WhatAreYourCorePersonalityTraits')) },
    Demographic: { title: 'Demographic', image: loadAsync('image', () => import('./Demographic')) },
    DoYouFitIn: { title: 'Do You Fit In', image: loadAsync('image', () => import('./DoYouFitIn01')) },
    DoYouStickWithGoal: { title: 'Do You Stick With Goals', image: loadAsync('image', () => import('./DoYouStickWithGoal01')) },
    DoYouSurviveOrThrive: { title: 'Survive or Thrive', image: loadAsync('image', () => import('./DoYouSurviveOrThrive01')) },
    FinancialLiteracy: { title: 'Personal Finance', image: loadAsync('image', () => import('./PersonalFinanceAndYou')) },
    HowDoYouStudyOnline: { title: 'How Do You Study Online', image: loadAsync('image', () => import('./HowDoYouStudyOnline01')) },
    HowImpulsiveAreYou: { title: 'How Impulsive Are You', image: loadAsync('image', () => import('./HowImpulsiveAreYou01')) },
    HowManyLettersYouRemember: { title: 'How Many Letters do You Remember', image: loadAsync('image', () => import('./HowManyLettersYouRemember')) },
    HowMuchYouRemeberFromScience: { title: 'How Much You Remeber From Science', image: loadAsync('image', () => import('./HowMuchYouRemeberFromScience')) },
    NewPersonalityTraits: { title: 'New Personality Traits', image: loadAsync('image', () => import('./NewPersonalityTraits')) },
    PatternRecognition: { title: 'Pattern Recognition', image: loadAsync('image', () => import('./TestYourVisualSkillsAndFinishPatterns')) },
    PotentialFutureCareer: { title: 'Potential Future Career', image: loadAsync('image', () => import('./PotentialFutureCareer01')) },
    Psychology: { title: 'Psychology', image: loadAsync('image', () => import('./Psychology')) },
    ReflectingOnYourChildhoodExperiences: { title: 'Reflecting on Childhood Experiences', image: loadAsync('image', () => import('./ReflectingOnYourChildhoodExperiences')) },
    RememberNumbersWhenReading: { title: 'Remember Numbers When Reading', image: loadAsync('image', () => import('./RememberNumbersWhenReading')) },
    StemInterest: { title: 'Stem Interest', image: loadAsync('image', () => import('./StemInterest01')) },
    UncoverAchievementLearning: { title: 'Uncover Achievement Learning', image: loadAsync('image', () => import('./UncoverAchievementLearning01')) },
}
