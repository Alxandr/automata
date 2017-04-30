import { join } from 'path';
import { osName } from '../app';
import { spawn } from 'child_process';

const start_osx = async (dir) => {
  const game = join(dir, 'factorio.app');
  const conf = join(dir, 'config.ini');
  //const log = join(dir, 'log.txt');
  const args = [
    '-a',
    game,
    '--args',
    '-c',
    conf
  ];

  // TODO: write stdout and stderr to log file
  const proc = spawn('open', args, { detached: true, stdio: [ 'ignore', 'ignore', 'ignore' ] });
  proc.unref();

  const code = await new Promise((res) => {
    proc.on('close', (code) => {
      res(code);
    });
  });

  await new Promise(res => setTimeout(res, 30000));
  return code;
};

const not_impl = os => async (_dir) => {
  throw new Error(`Starting for ${os} not yet implemented`);
};

export default (() => {
  switch (osName) {
    case 'osx': return start_osx;
    case 'win': return not_impl('Windows');
    case 'linux': return not_impl('Linux');
  }
})();
