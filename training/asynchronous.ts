import * as fs from 'fs';
import * as util from 'util';

const promisifyReadFile = util.promisify(fs.readFile);
// const promisifyReadFile = (path: string): Promise<Buffer | NodeJS.ErrnoException> => new Promise((resolve: (data: Buffer) => void, reject: (err: NodeJS.ErrnoException) => void) => {
//   fs.readFile(path, (err, data) => {
//     if (err) {
//       reject(err);
//     } else {
//       resolve(data);
//     }
//   });
// });

async function main() {
  promisifyReadFile('package.json')
    .then(data => console.log(data.toString()))
    .catch(err => console.error(err));
  const readFile = await promisifyReadFile('package.json');
  if (readFile instanceof Buffer) {
    console.log(readFile.toString());
  } else {
    throw readFile;
  }

  // let fileContent: string = 'Not loaded';

  // fs.readFile('package.json', (err, data) => {
  //   fileContent = data.toString();
  //   console.log(fileContent);
  // });
  // const result = fs.readFileSync('../package.json').toString();
  // console.log(result);
}

try {
  await main();
} catch (err: unknown) {
    console.log(err);
} finally {
  console.log('finally');
}

console.log('処理終了');