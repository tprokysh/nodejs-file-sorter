const fse = require("fs-extra");
const path = require("path");

const src = process.argv[2];
const dist = process.argv[3];
let allFiles = [];

if (!src || !dist) {
  console.log("Usage: node index [src] [dist]");
  process.exit();
}

const readDir = (src) => {
  const files = fse.readdirSync(src);

  files.forEach((item) => {
    let fullSrcDir = path.join(src, item);
    let fullDistDir = path.join(dist);
    let type = fse.statSync(fullSrcDir);

    if (type.isDirectory()) {
      readDir(fullSrcDir);
    } else {
      allFiles.push(path.parse(path.join(__dirname + "/" + src + "/" + item)));
    }
  });
};

const moveFiles = (src, dist, files) => {
  if (!files.length) {
    console.log("Files not found!");
    return;
  }

  if (!fse.existsSync(dist)) {
    fse.mkdirsSync(dist);
  }

  files.forEach((item) => {
    if (!fse.existsSync(`${dist}/` + item.name.charAt(0))) {
      fse.mkdirSync(dist + "/" + item.name.charAt(0));
    }
    fse.moveSync(
      item.dir + "/" + item.base,
      dist + "/" + item.name.charAt(0) + "/" + item.name
    );
  });
  console.log("Done!");
};

readDir(src);
allFiles.sort();
moveFiles(src, dist, allFiles);
