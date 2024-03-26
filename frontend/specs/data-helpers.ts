import { TC } from './test'
import { BrowserContext } from '@playwright/test';

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
