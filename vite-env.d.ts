///<reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_OCTOKIT_AUTH: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
