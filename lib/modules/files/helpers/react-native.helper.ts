import axios from 'axios';
import { FeatureContent } from '../types/react-native.types';

interface WriteFile {
    name: string;
    path: string;
    content: string;
}

export const getExtraFiles = (features: FeatureContent[], projectName: string) => {
    return new Promise(async (resolve, reject) => {
        let content = '';
        const writeFiles: WriteFile[] = [];

        const outerPromises = features.map(async (feature) => {
            try {
                const innerPromises = feature.files.map(async (file) => {
                    const fileContent = (await axios.get(feature.location + feature.path + file)).data;
                    writeFiles.push({
                        name: file,
                        path: `./${projectName}/${feature.path}`,
                        content: fileContent,
                    });
                });
                await Promise.all(innerPromises);
            } catch (error) {
                reject(error);
            }
        });

        await Promise.all(outerPromises);

        writeFiles.forEach((file) => {
            content += ` if(!fs.existsSync("${file.path}")){fs.mkdirSync("${file.path}", { recursive: true });} fs.writeFileSync('${file.path}/${file.name}', ${file.content});`;
        });

        console.log(content, 'content - getExtraFiles');

        resolve(content);
    });
};

export const generateMainFile = (name: string, templateVersion: string, author: string, description: string, files: FeatureContent[]) => {
    return new Promise(async (resolve, reject) => {
        try {
            const extra = await getExtraFiles(files, name);
            console.log(extra, 'extra - generateMainFile');
            console.log(JSON.stringify(files), 'files - generateMainFile');
            const mainFile = `

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

${extra}

execSync("cd ${name} && git init -q"); 

execSync("cd ${name} && git add ."); 

execSync("cd ${name} &&  git commit -m 'Initial commit'"); 

console.log("Project Initialized Successfully.")},]);






`;
            resolve(mainFile);
        } catch (error) {
            reject(error);
        }
    });
};
