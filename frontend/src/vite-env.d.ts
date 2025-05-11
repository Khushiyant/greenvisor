/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_APPWRITE_ENDPOINT: string;
    readonly VITE_APPWRITE_PROJECT_ID: string;
    readonly VITE_APPWRITE_API_KEY: string;
    readonly VITE_APPWRITE_DATABASE_ID: string;
    readonly VITE_APPWRITE_COLLECTION_ID: string;
    readonly VITE_APPWRITE_FUNCTION_ID: string;
    readonly VITE_VAPI_API_KEY: string;
    readonly VITE_VAPI_ASSISTANT_ID: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
