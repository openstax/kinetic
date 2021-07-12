declare global {
    interface Window {
        config: {
            url: string;
        };
    }

    interface ImportMeta {
        env: {
            VITE_API_URL: string
            MODE: string
            IS_LOCAL: boolean
        };
    }

}


// Adding this exports the declaration file which Typescript/CRA can now pickup:
export {}
