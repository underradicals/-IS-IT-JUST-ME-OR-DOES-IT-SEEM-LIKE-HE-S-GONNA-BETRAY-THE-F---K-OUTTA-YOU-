import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { readFileSync } from 'node:fs';
import { createLogger, defineConfig } from 'vite';
import autoprefixer from 'autoprefixer';
import type { UserConfig, ServerOptions, BuildEnvironmentOptions, UserConfigFnObject, JsonOptions } from 'vite';

const __dirname = dirname(fileURLToPath(import.meta.url));

const logger = createLogger('info', { allowClearScreen: true });

type DevelopmentOptions = 'development' | 'production';
const Environment: DevelopmentOptions = 'development';

const Server = {
  port: 3000,
  host: '0.0.0.0',
  open: true,
  https: {
    key: readFileSync("./certs2/localhost.key"),
    cert: readFileSync("./certs2/localhost.crt")
  }
} satisfies ServerOptions;

const Build = {
  outDir: 'dist',
  emptyOutDir: true
} satisfies BuildEnvironmentOptions;

const CSS = {
  devSourcemap: true,
  preprocessorOptions: {
    scss: {
      api: 'modern-compiler'
    }
  },
  preprocessorMaxWorkers: 0,
  postcss: {
    plugins: [autoprefixer({ overrideBrowserslist: ["defaults and fully supports es6-module", "maintained node versions"] })]
  },
  modules: {
    generateScopedName: "[name]__[local]___[hash:base64:5]",
    exportGlobals: true,
    localsConvention: 'camelCaseOnly'
  }
} satisfies UserConfig["css"]

const JSON = {
  namedExports: true
} satisfies JsonOptions

const ViteDevConfiguration = {
  server: Server,
  build: Build,
  css: CSS,
  json: JSON,
  customLogger: logger
} satisfies UserConfig;

const ViteProdConfiguration = {

} satisfies UserConfig;


const ViteConfigurationFunction = (({ command, mode, isSsrBuild, isPreview }) =>
(command === 'serve'
  ? ViteDevConfiguration
  : ViteProdConfiguration)) as UserConfigFnObject;


export default (Environment === 'development'
  ? defineConfig(ViteDevConfiguration)
  : defineConfig(ViteConfigurationFunction))