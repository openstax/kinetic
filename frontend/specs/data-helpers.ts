import { TC } from './test'
import { BrowserContext } from '@playwright/test';

// Save for example of how to make requests?
// https://reflect.run/articles/using-playwright-for-api-testing/ Reference

// interface CreateStudiesDataProps {
//     context: BrowserContext,
//     numStudies?: number
// }

// interface CreateStudyDataProps {
//     context: BrowserContext,
//     name?: string,
//     description?: string
// }

// export const createStudiesData = async ({ context, numStudies = 1 }: CreateStudiesDataProps) => {
//     const studyIds = []
//     for (let i = 0; i < numStudies; i++) {
//         const response = await createStudyRequest({ context })
//         expect(response.ok()).toBeTruthy();
//         expect(response.status()).toBe(201);
//         const study = await response.json()
//         studyIds.push(study.id)
//     }
//     return studyIds
// }
//
// export const createStudyData = async ({ context, name, description }: CreateStudyDataProps ) => {
//     const response = await createStudyRequest({ context, name, description })
//     expect(response.ok()).toBeTruthy();
//     expect(response.status()).toBe(201);
//     const study = await response.json()
//     return study.id
// }

// const createStudyRequest = ({ context, name, description }: CreateStudyDataProps) => {
//     return context.request.post(`${TC.API_URL}/researcher/studies`, {
//         // TODO Fill out more data with faker
//         data: {
//             benefits: faker.company.bsBuzz(),
//             category: 'Cognitive Task & Assessment',
//             topic: 'Learning',
//             title_for_researchers: name || faker.name.jobTitle(),
//             title_for_participants: name || faker.name.jobTitle(),
//             status: 'active',
//             internal_description: description || faker.name.jobDescriptor(),
//             short_description: description || faker.commerce.productDescription(),
//             long_description: description || faker.commerce.productDescription(),
//             opens_at: dayjs().subtract(1, 'day').toISOString(),
//             image_id: 'Personality_3',
//             stages: [
//                 {
//                     points: 10,
//                     duration_minutes: 5,
//                     feedback_types: ['Debrief, Personalized'],
//                     status: 'active',
//                     config: {
//                         type: 'qualtrics',
//                         survey_id: 'SV_12QHR3BE',
//                         secret_key: '1234567890123456',
//                     },
//                 },
//             ],
//         },
//     })
// }

export const completeAnalysisTutorial = async (context: BrowserContext) => {
    return context.request.post(`${TC.API_URL}/preferences`, {
        data: {
            preferences: {
                has_viewed_analysis_tutorial: true,
            },
        },
    })
}

export const completeWelcomeMessage = async (context: BrowserContext) => {
    return context.request.post(`${TC.API_URL}/preferences`, {
        data: {
            preferences: {
                has_viewed_welcome_message: true,
            },
        },
    })
}
