import {lastItem, toArray} from './common';
import {mkdirSync, readFileSync, writeFileSync} from 'fs';
import {parseXmlToObject} from './xml';
import path from 'path';

export type Component = {
  '$': {
    'name': string
  },
  'content': {
    '$': {
      'url': 'file://$MODULE_DIR$'
    },
    excludeFolder: {
      $: {
        url: string
      }
    }[],
    excludePattern: {
      $: {
        pattern: string
      }
    }[]
  }[],
}

export type Iml = {
  'module': {
    'component': Component[]
  }
}

function fixImlObject(obj: Iml): Iml {
  obj.module.component = toArray(obj.module.component);
  obj.module.component.forEach(component => {
    component.content = toArray(component.content);
    component.content.forEach(content => {
      content.excludeFolder = toArray(content.excludeFolder);
      content.excludePattern = toArray(content.excludePattern);
    });
  });
  return obj;
}

export async function readImlAsObject(imlFile: string) {
  const content = readFileSync(imlFile, {
    encoding: 'utf8',
  });
  const obj = await parseXmlToObject(content);
  return fixImlObject(obj);
}

function createModulesFile(projectRoot: string) {
  const modulesFile = path.resolve(projectRoot, '.idea', 'modules.xml');
  console.log(`createModulesFile: ${modulesFile}`);

  const projectName = getProjectName(projectRoot);
  const content = `<?xml version="1.0" encoding="UTF-8"?>
<project version="4">
  <component name="ProjectModuleManager">
    <modules>
      <module fileurl="file://$PROJECT_DIR$/.idea/${projectName}.iml" filepath="$PROJECT_DIR$/.idea/${projectName}.iml" />
    </modules>
  </component>
</project>
`;
  writeFileSync(modulesFile, content, {
    encoding: 'utf8',
  });
}

function createImlFile(filePath: string) {
  console.log(`createImlFile: ${filePath}`);
  const content = `
  <?xml version="1.0" encoding="UTF-8"?>
  <module type="WEB_MODULE" version="4">
    <component name="NewModuleRootManager">
      <content url="file://$MODULE_DIR$">
        <excludeFolder url="file://$MODULE_DIR$/.tmp" />
        <excludeFolder url="file://$MODULE_DIR$/temp" />
        <excludeFolder url="file://$MODULE_DIR$/tmp" />
      </content>
      <orderEntry type="inheritedJdk" />
      <orderEntry type="sourceFolder" forTests="false" />
    </component>
  </module>
  `;
  writeFileSync(filePath, content, {
    encoding: 'utf8',
  });
}

function getProjectName(projectPath: string): string {
  return lastItem(projectPath.split('/'));
}

export function getImlFilePath(projectPath: string): string {
  const projectName = getProjectName(projectPath);
  return path.resolve(projectPath, '.idea', `${projectName}.iml`);
}

export function initIdeaFiles(projectPath: string) {
  mkdirSync(path.resolve(projectPath, '.idea'));
  createModulesFile(projectPath);
  createImlFile(path.resolve(projectPath, '.idea', getImlFilePath(projectPath)));
}
