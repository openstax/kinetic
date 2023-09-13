import  { createServer } from 'vite'
import baseGlobalSetup from './setup'

async function globalSetup() {
    const baseTearDown = await baseGlobalSetup()
    const server = await createServer({
        logLevel: 'silent',
    })
    await server.listen()
    return async () => {
        await baseTearDown()
        await server.close()
    }
}

export default globalSetup
