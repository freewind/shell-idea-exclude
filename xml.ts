import {Builder, parseString} from 'xml2js';
import {readFileSync} from 'fs';

export function buildObjectToXml(obj: any): string {
  const builder = new Builder();
  const xml = builder.buildObject(obj);
  return xml;
}

export async function parseXmlToObject(xml: string): Promise<any> {
  return new Promise((resolve, reject) => {
    parseString(xml, (err, result) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(result);
    });
  });
}
