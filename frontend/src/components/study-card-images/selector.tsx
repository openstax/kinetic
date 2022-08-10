import React from 'react';
import { Box } from 'boxible'
import { components, OptionProps, SingleValueProps } from 'react-select';
import { SelectField, SelectFieldProps } from '../select-field'
import { loadAsync } from '../async'
import { SVGProps } from 'react'

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

type ImageOption = { value: string, ci: CardImage, label: string }

const imageOptions: ImageOption[] = []

const SingleValue = ({
    children,
    ...props
}: SingleValueProps<ImageOption>) => (

    <components.SingleValue {...props}>
        <Box gap>
            <props.data.ci.image height="30px" />
            <span>{props.data.label}</span>
        </Box>
    </components.SingleValue>
)

const Option = (props: OptionProps<ImageOption>) => {
    return (
        <components.Option {...props} >
            <Box align='center' gap>
                <props.data.ci.image height="80px" />
                <div css={{ fontSize: 20 }}>{props.data.label}</div>
            </Box>
        </components.Option>
    )
}

for (const [value, ci] of Object.entries(CardImages)) {
    imageOptions.push({ value, ci, label: ci.title })
}

interface CardImagesSelectorProps extends Omit<SelectFieldProps<OptionT>, 'options'> {

}

export const CardImagesSelector: React.FC<CardImagesSelectorProps> = (props) => (
    <SelectField
        {...props}
        components={{ Option, SingleValue } as any}
        options={imageOptions}
    />
);
