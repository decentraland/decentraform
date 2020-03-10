import { spawn } from 'child_process'

const DEBUG_LOG = false
export async function execute(
  command: string,
  args: string[],
  cwd: string,
  env: Record<string, string>,
  options?: any
) {
  DEBUG_LOG && console.log(command, args, cwd, env)
  return new Promise((resolve, reject) => {
    try {
      const subprocess = spawn(command, args, {
        cwd,
        shell: true,
        env: {
          ...env,
          PWD: cwd,
          PATH: process.env.PATH,
          HOME: process.env.HOME
        }
      })
      subprocess.stdout.on('data', data => {
        ;(DEBUG_LOG || (options && options.verbose)) && console.log(data.toString())
      })
      subprocess.stderr.on('data', data => {
        DEBUG_LOG && console.log(`stderr: ${data}`)
      })
      subprocess.on('close', c => {
        DEBUG_LOG && console.log(`Closing ${c}`)
        resolve(c)
      })
    } catch (e) {
      console.log('throwing up', e)
      reject(e)
    }
  })
}
