const fs = require('fs');
const path = require('path');
const process = require('process');
const yargs = require('yargs');
const dir = process.argv.slice(2);

const argv = yargs
  .usage('Usage: $0 [options]')
  .help('help')
  .alias('help', 'h')
  .version('0.0.1')
  .alias('version', 'v')
  .example('$0 --entry ./filesDir -D', '--> Sorting of files in folders')
  .option('entry', {
    alias: 'e',
    describe: 'The path of the source directory',
    demandOption: true
  })
  .option('output', {
    alias: 'o',
    describe: 'The path of the output directory',
    default: '/output'
  })
  .epilog('First homework on the node.js course')
  .argv;
console.log(argv);

const sortDir2 = path.join(__dirname, argv.entry);
const mainDir = path.join(__dirname, argv.output);
fs.access(mainDir, err => {
  if (err) {
    fs.mkdir(mainDir, err => {
      if (err) {
        console.log(err);
        return;
      }
      console.log('Create dir: ' + mainDir);
      readDir(sortDir2);
    });
  } else {
    console.log(
      dir[1] + '- такая директория уже создана. Выберете другое имя.'
    );
    process.exit(0);
  }
});

function copyFile (elementPathName, sortDir, element) {
  fs.access(elementPathName, err => {
    if (err) {
      console.log('Такой директории еще нет - ' + elementPathName);
      // иначе создаем директорию, а затем копируем в нее файл
      fs.mkdir(elementPathName, err => {
        if (err) {
          console.log('Ошибка создания директории ' + err);
          copyFile(elementPathName, sortDir, element);
        } else {
          console.log('Create dir: ' + elementPathName);
          // если создана, то просто копируем в нее файл
          fs.copyFile(path.join(sortDir, element), path.join(elementPathName, element), err => {
            if (err) throw err;
            console.log('File: ' + element + ' copied to ' + element[0].toUpperCase());
          });
        }
      });
    } else {
      console.log('Такая директория уже создана - ' + elementPathName);
      // если создана, то просто копируем в нее файл
      fs.copyFile(path.join(sortDir, element), path.join(elementPathName, element), err => {
        if (err) throw err;
        console.log('File: ' + element + ' copied to ' + element[0].toUpperCase());
      });
    }
  });
}

function readDir (sortDir) {
  // пробегаем по содержимому директории
  fs.readdir(sortDir, (err, files) => {
    if (err) {
      console.log('Fail to read catalog');
    }
    files.forEach(element => {
      // получаем инфо по каждому element
      fs.stat(path.join(sortDir, element), (err, stats) => {
        if (err) {
          console.log(err);
          return; // exit here since stats will be undefined
        }
        console.log('Элемент - ' + element);
        if (stats.isFile()) {
          console.log('"Это файл" - ' + element);
          console.log('****************************');
          // путь к директории для файла
          let elementPathName = path.join(mainDir, element[0].toUpperCase());
          // проверяем создана ли директория для этого файла
          copyFile(elementPathName, sortDir, element);
        }
        if (stats.isDirectory()) {
          console.log('"Это директория" - ' + element);
          console.log('****************************');
          readDir(path.join(sortDir, element));
        }
      });
    });
  });
}
