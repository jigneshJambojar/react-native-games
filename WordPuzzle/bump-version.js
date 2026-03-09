const fs = require("fs");
const path = "./android/gradle.properties";

let data = fs.readFileSync(path, "utf8");

let codeMatch = data.match(/VERSION_CODE=(\d+)/);
let nameMatch = data.match(/VERSION_NAME=(\d+)\.(\d+)\.(\d+)/);

let versionCode = parseInt(codeMatch[1]) + 1;

let major = parseInt(nameMatch[1]);
let minor = parseInt(nameMatch[2]);
let patch = parseInt(nameMatch[3]) + 1;

let versionName = `${major}.${minor}.${patch}`;

data = data.replace(/VERSION_CODE=\d+/, `VERSION_CODE=${versionCode}`);
data = data.replace(/VERSION_NAME=.*/, `VERSION_NAME=${versionName}`);

fs.writeFileSync(path, data);

console.log("New Version:");
console.log("versionCode:", versionCode);
console.log("versionName:", versionName);