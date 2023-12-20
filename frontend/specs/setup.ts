import { createServer } from 'vite';

async function globalSetup() {
    const server = await createServer({
        logLevel: 'silent',
    })
    await server.listen()
    return async () => {
        await server.close()
    }
}

export default globalSetup
