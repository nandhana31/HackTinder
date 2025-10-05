// <reference types="vite/client" />

interface ImportMetaEnv {
  // Define the type for the specific variable you are using
  readonly VITE_API_URL: string;
  // If you use other variables, add them here too (e.g., VITE_AUTH0_CLIENT_ID: string;)
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}