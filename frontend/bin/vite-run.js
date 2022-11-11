const { createServer } = require('vite')

if (process.argv.length < 3) {
    console.log(`usage: vite-run <script to import>`)
    process.exit(1)
}

;(async () => {
    const server = await createServer({
        configFile: 'vite.config.ts',
        server: { middlewareMode: true },
        hmr: false,
    })

    const { default: script } = await server.ssrLoadModule(process.argv[2])
    try {
        await script({
            server,
            env: process.env,
            args: process.argv.slice(2),
        })
    } catch (err) {
        console.warn(err)
    } finally {
        await server.close()
    }
})()
