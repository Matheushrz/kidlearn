/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string
  // pode adicionar outras variáveis que você usar
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
