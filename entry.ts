import {existsSync, writeFileSync} from 'fs';
import {Component, initIdeaFiles, Iml, readImlAsObject, getImlFilePath} from './iml';
import {buildObjectToXml} from './xml';

const newModuleRootManager = 'NewModuleRootManager';

async function excludeFolder(imlObj: Iml, path: string) {
  const newModuleRootManagerModule: Component =
    imlObj.module.component.find(it => it.$.name === newModuleRootManager)
    || createNewComponent(imlObj);

  newModuleRootManagerModule.content.forEach(content => {
    if (content.excludeFolder.some(it => it.$.url === path)) {
      console.log(`found existing exclude folder: ${path}, ignore`);
      return;
    } else {
      const url = `file://$MODULE_DIR$/${path.substring(2)}`;
      console.log(`add new exclude folder: ${url}`);
      content.excludeFolder.push({
        $: {
          url,
        },
      });
    }
  });

}

function createNewComponent(imlObj: Iml): Component {
  const newComponent: Component = {
    '$': {
      'name': newModuleRootManager,
    },
    'content': [{
      $: {
        url: 'file://$MODULE_DIR$',
      },
      excludeFolder: [],
      excludePattern: [],
    }],
  };
  imlObj.module.component.push(newComponent);
  return newComponent;
}

async function excludePattern(imlObj: Iml, pattern: string) {

  const module: Component =
    imlObj.module.component.find(it => it.$.name === newModuleRootManager)
    || createNewComponent(imlObj);


  module.content.forEach(content => {
    if (content.excludePattern.some(it => it.$.pattern === pattern)) {
      console.log(`found existing exclude pattern: ${pattern}, ignore`);
      return;
    } else {
      console.log(`add new exclude pattern: ${pattern}`);
      content.excludePattern.push({
        $: {pattern},
      });
    }
  });

}

async function main() {
  const projectRoot: string = process.env.PWD!;
  const target = process.argv[2];

  if (!target) {
    console.log(`idea-exclude "node_modules"`);
    console.log(`idea-exclude "./target"`);
    process.exit(-1);
  }

  const imlFile = getImlFilePath(projectRoot);
  console.log(imlFile);

  if (!existsSync(imlFile)) {
    console.log(`init idea files for: ${projectRoot}`);
    initIdeaFiles(projectRoot);
  }

  const imlObj = await readImlAsObject(imlFile);

  if (target.startsWith('./')) {
    console.log(`exclude path: ${target}`);
    await excludeFolder(imlObj, target);
  } else {
    console.log(`exclude pattern: ${target}`);
    await excludePattern(imlObj, target);
  }

  const xml = buildObjectToXml(imlObj);
  writeFileSync(imlFile, xml);
  console.log('done');
}

main();
