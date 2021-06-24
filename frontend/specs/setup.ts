import  { createServer } from 'vite'

export async function globalSetup() {
    const server = await createServer({
        logLevel: 'silent',
    })
    await server.listen()
    return async () => server.close()
}

export default globalSetup
