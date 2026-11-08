import { spawnSync } from 'node:child_process'
import { existsSync, realpathSync } from 'node:fs'
import { resolve, relative, isAbsolute, extname } from 'node:path'

// Claude Code entrega un JSON por stdin para PostToolUse.
let input = ''
for await (const chunk of process.stdin) input += chunk
try {
  const event = JSON.parse(input)
  const requested = event?.tool_input?.file_path
  if (typeof requested !== 'string' || !requested) process.exit(0)
  const root = realpathSync(process.cwd())
  const target = resolve(root, requested)
  const rel = relative(root, target)
  if (rel.startsWith('..') || isAbsolute(rel) || !existsSync(target)) process.exit(0)
  if (!['.ts', '.tsx', '.js', '.jsx', '.json', '.css', '.md', '.html', '.sql'].includes(extname(target))) process.exit(0)
  if (rel.includes('node_modules') || rel.startsWith('.git/') || rel === '.env') process.exit(0)
  const executable = resolve(root, 'node_modules/.bin/prettier')
  if (!existsSync(executable)) process.exit(0)
  const run = spawnSync(executable, ['--write', target], { stdio: 'ignore' })
  process.exit(run.status ?? 0)
} catch {
  // No bloquear edición si un archivo no es compatible o el JSON está ausente.
  process.exit(0)
}
