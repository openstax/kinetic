import BaseConfig from './playwright.config'

// stop silly devs from checking in code with a test focused
BaseConfig.forbidOnly = true

BaseConfig.globalSetup = require.resolve('./specs/setup.ci.ts')

export default BaseConfig
