const fs = require("fs");
const path = require("path");
const process = require("process");
const dir = process.argv.slice(2);
const sortDir2 = path.join(__dirname, dir[0]);
const mainDir = path.join(__dirname, dir[1]);

fs.access(mainDir, err => {
  if (err) {
    fs.mkdir(mainDir, err => {
      if (err) {
        console.log(err);
        return;
      }
      console.log("Create dir: " + mainDir);
      readDir(sortDir2);
    });
  } else {
    console.log(
      dir[1] + "- такая директория уже создана. Выберете другое имя."
    );
    process.exit(0);
  }
});

function readDir(sortDir) {
    // пробегаем по содержимому директории
  fs.readdir(sortDir, (err, files) => {
    if (err) {
      console.log("Fail to read catalog");
    }
    files.forEach(element => {
        try {
            var stats = fs.statSync(path.join(sortDir, element));
            if (stats.isFile()) {
            //путь к директории для файла
          let elementPath = path.join(mainDir, element[0].toUpperCase());
          //проверяем создана ли директория для этого файла
          try {
              fs.accessSync(elementPath);
              //если создана, то просто копируем в нее файл
            fs.copyFile(
              path.join(sortDir, element),
              path.join(elementPath, element),
              err => {
                if (err) throw err;
                console.log("File: " + element+" copied to "+element[0].toUpperCase());
              }
            );
          }catch{
              // иначе создаем директорию, а затем копируем в нее файл
              fs.mkdir(elementPath, err => {
                  if (err) {
                      console.log("Ошибка создания директории "+err);
                      return;
                    }
                    console.log("Create dir: " + elementPath);
                    fs.copyFile(path.join(sortDir, element),path.join(elementPath, element), err => {
                                if (err) throw err;
                                console.log("File: " + element+" copied to "+element[0].toUpperCase());
                            }
                            );
                    });
                }      
        }
        if (stats.isDirectory()) {
          readDir(path.join(sortDir, element));
        }
        }catch{
            console.log(err);
            return; // exit here since stats will be undefined
        }
    });
  });
}
