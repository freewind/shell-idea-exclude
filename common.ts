import {execSync} from 'child_process';

export function exec(command: string): string {
  return execSync(command, {
    encoding: 'utf8',
  });
}

export function toArray(obj: any): any[] {
  if (obj === undefined || obj === null) {
    return [];
  }
  if (Array.isArray(obj)) {
    return obj;
  } else {
    return [obj];
  }
}

export function lastItem<T>(array: T[]): T {
  return array[array.length - 1];
}
