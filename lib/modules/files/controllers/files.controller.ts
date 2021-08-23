import axios from 'axios';
import { Request, Response } from 'express';
import {
    expressCommonConstants,
    expressCommonRoutes,
    expressEnv,
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
import { generateExpressFile } from '../helpers/express-file-generator.helper';

export class FilesController {
    // get express script
    public async getExpressScript(req: Request, res: Response) {
        const name = req.query.name;
        const description = req.query.description;
        const author = req.query.author;

        let stringifiedPackageJson,
            stringifiedTsConfigJson,
            stringifiedGitIgnore,
            stringifiedPrettierrc,
            stringifiedEslintrc,
            stringifiedEnv,
            stringifiedServerConfig,
            stringifiedMongoConfig,
            stringifiedSwagger,
            stringifiedCommonConstants,
            stringifiedErrorConstants,
            stringifiedResponseMessagesConstants,
            stringifiedErrorHandler,
            stringifiedResponseService,
            stringifiedCommonRoutes,
            stringifiedRoutes,
            stringifiedServer;

        try {
            stringifiedPackageJson = await axios.get(expressPackageJson);
            stringifiedPackageJson = JSON.stringify(stringifiedPackageJson.data);

            stringifiedTsConfigJson = await axios.get(expressTsConfigJson);
            stringifiedTsConfigJson = JSON.stringify(stringifiedTsConfigJson.data);

            stringifiedGitIgnore = await axios.get(expressGitIgnore);
            stringifiedGitIgnore = JSON.stringify(stringifiedGitIgnore.data);

            stringifiedPrettierrc = await axios.get(expressPrettierrc);
            stringifiedPrettierrc = JSON.stringify(stringifiedPrettierrc.data);

            stringifiedEslintrc = await axios.get(expressEslintrc);
            stringifiedEslintrc = JSON.stringify(stringifiedEslintrc.data);

            stringifiedEnv = await axios.get(expressEnv);
            stringifiedEnv = JSON.stringify(stringifiedEnv.data);

            stringifiedServerConfig = await axios.get(expressServerConfig);
            stringifiedServerConfig = JSON.stringify(stringifiedServerConfig.data);

            stringifiedMongoConfig = await axios.get(expressMongoConfig);
            stringifiedMongoConfig = JSON.stringify(stringifiedMongoConfig.data);

            stringifiedSwagger = await axios.get(expressSwagger);
            stringifiedSwagger = JSON.stringify(stringifiedSwagger.data);

            stringifiedCommonConstants = await axios.get(expressCommonConstants);
            stringifiedCommonConstants = JSON.stringify(stringifiedCommonConstants.data);

            stringifiedErrorConstants = await axios.get(expressErrorConstants);
            stringifiedErrorConstants = JSON.stringify(stringifiedErrorConstants.data);

            stringifiedResponseMessagesConstants = await axios.get(expressResponseMessagesConstants);
            stringifiedResponseMessagesConstants = JSON.stringify(stringifiedResponseMessagesConstants.data);

            stringifiedErrorHandler = await axios.get(expressErrorHandler);
            stringifiedErrorHandler = JSON.stringify(stringifiedErrorHandler.data);

            stringifiedResponseService = await axios.get(expressResponseService);
            stringifiedResponseService = JSON.stringify(stringifiedResponseService.data);

            stringifiedCommonRoutes = await axios.get(expressCommonRoutes);
            stringifiedCommonRoutes = JSON.stringify(stringifiedCommonRoutes.data);

            stringifiedRoutes = await axios.get(expressRoutes);
            stringifiedRoutes = JSON.stringify(stringifiedRoutes.data);

            stringifiedServer = await axios.get(expressServer);
            stringifiedServer = JSON.stringify(stringifiedServer.data);

            const mainFile = generateExpressFile(
                name,
                description,
                author,
                stringifiedPackageJson,
                stringifiedTsConfigJson,
                stringifiedGitIgnore,
                stringifiedPrettierrc,
                stringifiedEslintrc,
                stringifiedEnv,
                stringifiedServerConfig,
                stringifiedMongoConfig,
                stringifiedSwagger,
                stringifiedCommonConstants,
                stringifiedErrorConstants,
                stringifiedResponseMessagesConstants,
                stringifiedErrorHandler,
                stringifiedResponseService,
                stringifiedCommonRoutes,
                stringifiedRoutes,
                stringifiedServer,
            );

            res.send(mainFile);
        } catch (error) {
            console.log(error);
        }
    }
}
