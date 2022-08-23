import React, { SVGProps } from 'react'
import { loadAsync } from '../async'

export type CardImageProps = SVGProps<SVGSVGElement>

export interface CardImage {
    title: string
    image: React.FC<CardImageProps>
}

export const CardImages: Record<string, CardImage> = {
    AbilityBeliefs: { title: 'Ability Beliefs', image: loadAsync('image', () => import('./AbilityBeliefs')) },
    AreYouAnxiousPerson: { title: 'Are You an Anxious Person', image: loadAsync('image', () => import('./AreYouAnxiousPerson')) },
    AreYouSuperReader: { title: 'Are You a Super Reader', image: loadAsync('image', () => import('./AreYouSuperReader')) },
    ControlOverYourLife: { title: 'Control Over Your Life', image: loadAsync('image', () => import('./ControlOverYourLife')) },
    CorePersonality: { title: 'Core Personality', image: loadAsync('image', () => import('./CorePersonality')) },
    DoYouFitIn: { title: 'Do You Fit In', image: loadAsync('image', () => import('./DoYouFitIn')) },
    DoYouStickWithGoal: { title: 'Do You Stick With Goals', image: loadAsync('image', () => import('./DoYouStickWithGoal')) },
    HowDoYouStudyOnline: { title: 'How Do You Study Online', image: loadAsync('image', () => import('./HowDoYouStudyOnline')) },
    HowImpulsiveAreYou: { title: 'How Impulsive Are You', image: loadAsync('image', () => import('./HowImpulsiveAreYou')) },
    HowManyLettersYouRemember: { title: 'How Many Letters do You Remember', image: loadAsync('image', () => import('./HowManyLettersYouRemember')) },
    HowMuchYouRemeberFromScience: { title: 'How Much You Remeber From Science', image: loadAsync('image', () => import('./HowMuchYouRemeberFromScience')) },
    PatternRecognition: { title: 'Pattern Recognition', image: loadAsync('image', () => import('./PatternRecognition')) },
    PotentialFutureCareer: { title: 'Potential Future Career', image: loadAsync('image', () => import('./PotentialFutureCareer')) },
    RememberNumbersWhenReading: { title: 'Remember Numbers When Reading', image: loadAsync('image', () => import('./RememberNumbersWhenReading')) },
    StemInterest: { title: 'StemInterest', image: loadAsync('image', () => import('./StemInterest')) },
    UncoverAchievementLearning: { title: 'Uncover Achievement Learning', image: loadAsync('image', () => import('./UncoverAchievementLearning')) },
}