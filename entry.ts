import {execSync} from 'child_process';

const files = execSync('ls', {
  encoding: 'utf-8',
});

console.log(files);
