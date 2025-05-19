import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import type { UserConfig, ServerOptions, BuildEnvironmentOptions, UserConfigFnObject } from 'vite';

const __dirname = dirname(fileURLToPath(import.meta.url));

type DevelopmentOptions = 'development' | 'production';
const Environment: DevelopmentOptions = 'development';

const Server = {} satisfies ServerOptions;

const Build = {} satisfies BuildEnvironmentOptions;

const CSS = {} satisfies UserConfig["css"]

const ViteDevConfiguration = {
  server: Server,
  build: Build,
  css: CSS
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