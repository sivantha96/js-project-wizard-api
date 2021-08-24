import axios from 'axios';
import { Request, Response } from 'express';
import {
    expressCommonConstants,
    expressCommonRoutes,
    expressEnvProd,
    expressEnvLocal,
    expressErrorConstants,
    expressErrorHandler,
    expressEslintrc,
    expressGitIgnore,
    expressMongoConfig,
    expressPackageJson,
    expressPrettierrc,
    expressResponseMessagesConstants,
    expressResponseService,
    expressRoutes,
    expressServer,
    expressServerConfig,
    expressSwagger,
    expressTsConfigJson,
} from '../constants/express.constants';

export class FilesController {
    // get express script
    public async getExpressScript(req: Request, res: Response) {
        const name = req.query.name;
        const description = req.query.description;
        const author = req.query.author;
        const dbType = req.query.dbType;
        const dbName = req.query.dbName;
        try {
            const packageJson = {
                name: 'package.json',
                path: '.',
                content: (await axios.get(expressPackageJson)).data,
            };

            packageJson.content.name = name;
            packageJson.content.description = description;
            packageJson.content.author = author;

            const envProd = {
                name: '.env.production',
                path: '.',
                content: (await axios.get(expressEnvProd)).data,
            };
            const envLocal = {
                name: '.env.local',
                path: '.',
                content: (await axios.get(expressEnvLocal)).data,
            };

            envProd.content = envProd.content + `\nEXPRESS_APP_NAME=${name}`;
            envLocal.content = envLocal.content + `\nEXPRESS_APP_NAME=${name}`;

            if (dbType === 'mongo') {
                envProd.content = envProd.content + `\nEXPRESS_APP_DB_URL=mongodb://localhost:27017/${dbName}`;
                envLocal.content = envLocal.content + `\nEXPRESS_APP_DB_URL=mongodb://localhost:27017/${dbName}`;
            }

            const jsonFiles = [
                packageJson,
                {
                    name: 'tsconfig.json',
                    path: '.',
                    content: (await axios.get(expressTsConfigJson)).data,
                },
                {
                    name: '.prettierrc',
                    path: '.',
                    content: (await axios.get(expressPrettierrc)).data,
                },
                {
                    name: 'swagger.json',
                    path: './lib/config',
                    content: (await axios.get(expressSwagger)).data,
                },
            ];
            const otherFiles = [
                envProd,
                envLocal,
                {
                    name: '.gitignore',
                    path: '.',
                    content: (await axios.get(expressGitIgnore)).data,
                },
                {
                    name: '.eslintrc.js',
                    path: '.',
                    content: (await axios.get(expressEslintrc)).data,
                },
                {
                    name: 'routes.ts',
                    path: './lib',
                    content: (await axios.get(expressRoutes)).data,
                },
                {
                    name: 'server.ts',
                    path: './lib',
                    content: (await axios.get(expressServer)).data,
                },
                {
                    name: 'server.config.ts',
                    path: './lib/config',
                    content: (await axios.get(expressServerConfig(dbType))).data,
                },
                ...(dbType === 'none'
                    ? []
                    : [
                          {
                              name: 'mongo.config.ts',
                              path: './lib/config',
                              content: (await axios.get(expressMongoConfig)).data,
                          },
                      ]),
                {
                    name: 'routes.ts',
                    path: './lib/modules/common',
                    content: (await axios.get(expressCommonRoutes)).data,
                },
                {
                    name: 'common.constant.ts',
                    path: './lib/modules/common/constants',
                    content: (await axios.get(expressCommonConstants)).data,
                },
                {
                    name: 'error.constant.ts',
                    path: './lib/modules/common/constants',
                    content: (await axios.get(expressErrorConstants)).data,
                },
                {
                    name: 'response-messages.constant.ts',
                    path: './lib/modules/common/constants',
                    content: (await axios.get(expressResponseMessagesConstants)).data,
                },
                {
                    name: 'global-error-handler.middleware.ts',
                    path: './lib/modules/common/middleware',
                    content: (await axios.get(expressErrorHandler)).data,
                },
                {
                    name: 'response.service.ts',
                    path: './lib/modules/common/services',
                    content: (await axios.get(expressResponseService)).data,
                },
            ];

            let mainFile = `const fs = require("fs"); const { series } = require("async"); const { execSync } = require("child_process"); series([ () => {execSync("git init -q"); console.log("Setting up the project boilerplate");`;

            jsonFiles.forEach((file) => {
                mainFile += ` if(!fs.existsSync("${file.path}")){fs.mkdirSync("${file.path}", { recursive: true });} fs.writeFileSync('${
                    file.path
                }/${file.name}', '${JSON.stringify(file.content)}');`;
            });

            otherFiles.forEach((file) => {
                mainFile += ` if(!fs.existsSync("${file.path}")){fs.mkdirSync("${file.path}", { recursive: true });} fs.writeFileSync('${
                    file.path
                }/${file.name}', ${JSON.stringify(file.content)});`;
            });

            mainFile += `execSync("npm install"); execSync("git add ."); execSync("git commit -m 'Initial commit'"); console.log("Project Initialized Successfully.")},]);`;

            res.send(mainFile);
        } catch (error) {}
    }
}
