export const generateMainFile = (
    name: string,
    templateVersion: string,
    author: string,
    description: string,
) => `

const fs = require("fs"); 
const { series } = require("async"); 
const { execSync } = require("child_process"); 

series([ () => {
    console.log("Setting up the project boilerplate"); 
    console.log("Sit back and relax. This will only take few minutes."); 
    execSync("npx react-native init ${name} --template react-native-template-awesome@${templateVersion}"); 

    var pkg=require('./${name}/package.json'); 
    pkg.author='${author}'; 
    pkg.description='${description}'; 
    fs.writeFileSync('./${name}/package.json', JSON.stringify(pkg, null, 2)); 
    
    execSync("cd ${name} && git init -q"); 
    
    execSync("cd ${name} && git add ."); 
    
    execSync("cd ${name} &&  git commit -m 'Initial commit'"); 
    
    console.log("Project Initialized Successfully.")},]);

`