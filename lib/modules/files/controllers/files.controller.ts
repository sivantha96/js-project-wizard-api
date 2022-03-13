import axios from 'axios';
import { Request, Response } from 'express';
import {
    expressCommonConstants,
    expressCommonRoutes,
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
import { THEME } from '../constants/react-native.constants';
import { generateMainFile } from '../helpers/react-native.helper';
import { FeatureContent } from '../types/react-native.types';

export class FilesController {
    // get express script
    public async generateExpressScript(req: Request, res: Response) {
        const { name, description, author, dbType, dbName } = req.body;
        try {
            const packageJson = {
                name: 'package.json',
                path: '.',
                content: (await axios.get(expressPackageJson)).data,
            };

            packageJson.content.name = name;
            packageJson.content.description = description;
            packageJson.content.author = author;

            const envLocal = {
                name: '.env.local',
                path: '.',
                content: (await axios.get(expressEnvLocal)).data,
            };

            envLocal.content = envLocal.content + `\nEXPRESS_APP_NAME=${name}`;

            if (dbType === 'mongo') {
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
                    content: (await axios.get(expressServerConfig(dbType === 'none' ? '' : '-mongo'))).data,
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

    // generate react native script
    public async generateReactNativeScript(req: Request, res: Response) {
        try {
            const { name, description, author, hasReactNavigation, hasRedux, hasVectorIcons, hasTheming, hasI18n } = req.body;

            let templateVersion;
            switch (true) {
                case hasReactNavigation && hasRedux && hasVectorIcons: // redux + navigation + vector icons
                    templateVersion = '0.0.1';
                    break;

                case hasReactNavigation && !hasRedux && !hasVectorIcons: // navigation
                    templateVersion = '0.0.3';
                    break;

                case hasRedux && !hasReactNavigation && !hasVectorIcons: // redux
                    templateVersion = '0.0.4';

                case hasVectorIcons && !hasReactNavigation && !hasRedux: // vector icons
                    templateVersion = '0.0.5';
                    break;

                case hasVectorIcons && !hasReactNavigation && hasRedux: // redux + vector icons
                    templateVersion = '0.0.6';
                    break;

                case hasVectorIcons && hasReactNavigation && !hasRedux: // navigation + vector icons
                    templateVersion = '0.0.7';
                    break;

                case !hasVectorIcons && hasReactNavigation && hasRedux: // redux + navigation
                    templateVersion = '0.0.8';
                    break;

                default:
                    break;
            }
            const files: FeatureContent[] = [];
            if (hasTheming) {
                files.push(THEME);
            }
            const mainFile = await generateMainFile(name, templateVersion, author, description, files);
            res.send(mainFile);
        } catch (error) {}
    }
}
