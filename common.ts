import {execSync, ExecSyncOptionsWithStringEncoding} from 'child_process';

export function exec(command: string): string {
  return execSync(command, {
    encoding: 'utf8',
  });
}
