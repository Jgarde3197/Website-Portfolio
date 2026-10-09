import { build } from 'vite'
import fs from 'node:fs'
import path from 'node:path'
import { pathToFileURL, fileURLToPath } from 'node:url'
import { spawnSync } from 'node:child_process'
import ts from 'typescript'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
try {
  await build({ root })
} catch (error) {
  if (process.platform !== 'win32' || error.code !== 'EPERM') throw error
  // Some restricted Windows sessions allow child processes but deny the
  // anonymous pipes used by esbuild's service. Keep Vite and the same esbuild
  // compiler, using temporary files and inherited streams in that case only.
  console.warn('Windows denied esbuild service pipes; using the file-based build fallback.')
  const scratch = fs.mkdtempSync(path.join(root, 'node_modules', '.portfolio-build-'))
  try {
    const configSource = fs
      .readFileSync(path.join(root, 'vite.config.ts'), 'utf8')
      .replaceAll('__dirname', JSON.stringify(root))
      .replace("'./api/contact.ts'", JSON.stringify(pathToFileURL(path.join(root, 'api/contact.ts')).href))
      .replace("'./api/chat.ts'", JSON.stringify(pathToFileURL(path.join(root, 'api/chat.ts')).href))
    const configFile = path.join(scratch, 'config.mjs')
    fs.writeFileSync(
      configFile,
      ts.transpileModule(configSource, {
        compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
      }).outputText,
    )
    const { default: config } = await import(pathToFileURL(configFile).href)
    const binary = path.join(root, 'node_modules', '@esbuild', 'win32-x64', 'esbuild.exe')
    let serial = 0
    const compile = (code, loader, minify = false) => {
      const base = path.join(scratch, String(serial++))
      const input = `${base}.${loader}`,
        output = `${base}.out.${loader === 'css' ? 'css' : 'js'}`
      fs.writeFileSync(input, code)
      const args = [
        input,
        `--outfile=${output}`,
        `--loader:.${loader}=${loader}`,
        '--format=esm',
        '--target=es2022',
        '--jsx=automatic',
        '--log-level=error',
      ]
      if (minify) args.push('--minify')
      const result = spawnSync(binary, args, { stdio: 'inherit', windowsHide: true })
      if (result.error) throw result.error
      if (result.status !== 0) throw new Error(`esbuild failed (${result.status})`)
      return fs.readFileSync(output, 'utf8')
    }
    let buildEnv = {}
    await build({
      ...config,
      root,
      configFile: false,
      esbuild: false,
      resolve: { ...config.resolve, preserveSymlinks: true },
      plugins: [
        {
          name: 'windows-file-based-esbuild',
          enforce: 'pre',
          configResolved(resolved) {
            buildEnv = resolved.env
          },
          transform(code, id) {
            if (!/\.[cm]?[jt]sx?(?:\?.*)?$/.test(id)) return null
            code = code
              .replaceAll('process.env.NODE_ENV', '"production"')
              .replaceAll('import.meta.env', JSON.stringify(buildEnv))
              .replaceAll('import.meta.hot', 'undefined')
              .replaceAll('globalThis.process.env', '({})')
              .replaceAll('global.process.env', '({})')
              .replaceAll('process.env', '({})')
            if (/\.[cm]?tsx?(?:\?.*)?$/.test(id)) {
              code = compile(code, id.split('?')[0].endsWith('tsx') ? 'tsx' : 'ts')
            }
            return { code, map: null }
          },
          renderChunk(code) {
            return { code: compile(code, 'js', true), map: null }
          },
          generateBundle(_options, bundle) {
            for (const asset of Object.values(bundle)) {
              if (asset.type === 'asset' && asset.fileName.endsWith('.css')) {
                asset.source = compile(String(asset.source), 'css', true)
              }
            }
          },
        },
      ],
      build: { ...config.build, minify: false, cssMinify: false },
    })
  } finally {
    fs.rmSync(scratch, { recursive: true, force: true })
  }
}
