
const fs = require("fs");
const { series } = require("async");
const { execSync } = require("child_process");
const targetPackageJson = "./package.json";
const targetTsConfigJson = "./tsconfig.json";
const targetGitIgnore  = "./.gitignore";
const targetPrettierrc  = "./.prettierrc";
const targetEslintrc  = "./.eslintrc.js";
const targetEnv  = "./.env";
const targetEnvLocal  = "./.env.local";
const targetServerConfig  = "./lib/config/server.config.ts";
const targetMongoConfig  = "./lib/config/mongo.config.ts";
const targetSwagger  = "./lib/config/swagger.json";
const targetCommonConstants  = "./lib/modules/common/constants/common.constant.ts";
const targetErrorConstants  = "./lib/modules/common/constants/error.constant.ts";
const targetResponseMessagesConstants  = "./lib/modules/common/constants/response-messages.constant.ts";
const targetErrorHandler  = "./lib/modules/common/middleware/global-error-handler.middleware.ts";
const targetServices  = "./lib/modules/common/services/response.service.ts";
const targetCommonRoutes  = "./lib/modules/common/routes.ts";
const targetRoutes  = "./lib/routes.ts";
const targetServer = "./lib/server.ts";

const targetConfig  = "./lib/config";
const targetCommonConstantsDirectory  = "./lib/modules/common/constants";
const targetCommonMiddlewareDirectory  = "./lib/modules/common/middleware";
const targetCommonServicesDirectory  = "./lib/modules/common/services";

const stringifiedPackageJson = '{"name":"express-builder","version":"0.0.1","description":"express-builder","main":"server.js","author":"express-builder","license":"ISC","scripts":{"build":"npm version patch && tsc","start":"nodemon ./dist/server.js","dev":"tsnd --respawn ./lib/server.ts"},"dependencies":{"ajv":"^8.6.0","ajv-errors":"^3.0.0","axios":"^0.21.1","cookie-parser":"^1.4.5","cors":"^2.8.5","dotenv":"^10.0.0","dotenv-expand":"^5.1.0","express":"^4.17.1","express-bearer-token":"^2.4.0","http-status-codes":"^2.1.4","lodash":"^4.17.21","mongoose":"^5.12.14","nodemon":"^2.0.7","swagger-ui-express":"^4.1.6"},"devDependencies":{"@types/express":"^4.17.12","@typescript-eslint/eslint-plugin":"^4.27.0","@typescript-eslint/parser":"^4.27.0","eslint":"^7.29.0","eslint-config-prettier":"^8.3.0","eslint-config-standard":"^16.0.3","eslint-plugin-import":"^2.23.4","eslint-plugin-node":"^11.1.0","eslint-plugin-promise":"^5.1.0"}}'
const packageJson = JSON.parse(stringifiedPackageJson)
packageJson.name = "js-project-wizard-api";
packageJson.description = "JS Project Wizard API";
packageJson.author = "Sivantha";

const stringifiedTsConfigJson = {"compileOnSave":true,"compilerOptions":{"lib":["es2017","dom"],"target":"es6","module":"commonjs","moduleResolution":"node","typeRoots":["./node_modules/@types/"],"noImplicitAny":false,"emitDecoratorMetadata":true,"resolveJsonModule":true,"experimentalDecorators":true,"outDir":"./dist","skipLibCheck":true,"strictNullChecks":true},"exclude":["node_modules","app"]}
const stringifiedGitIgnore = "dist\nnode_modules\n.env\n.vscode\n.DS_Store\n"
const stringifiedPrettierrc = {"tabWidth":4,"singleQuote":true,"printWidth":140,"trailingComma":"all"}
const stringifiedEslintrc = "module.exports = {\n    env: {\n        browser: true,\n        es2021: true,\n    },\n    extends: ['standard', 'prettier'],\n    parser: '@typescript-eslint/parser',\n    parserOptions: {\n        ecmaVersion: 12,\n        sourceType: 'module',\n    },\n    plugins: ['@typescript-eslint'],\n    rules: {\n        'comma-dangle': ['error', 'always-multiline'],\n        semi: [2, 'always'],\n        camelcase: 0,\n        'max-len': ['error', { code: 150, tabWidth: 4 }],\n        'no-useless-constructor': 0,\n        indent: ['error', 4, { SwitchCase: 1, flatTernaryExpressions: 0 }],\n        'space-before-function-paren': [\n            'error',\n            {\n                anonymous: 'always',\n                named: 'never',\n                asyncArrow: 'always',\n            },\n        ],\n        '@typescript-eslint/no-unused-vars': 'warn',\n    },\n};\n"
const stringifiedEnv = "NODE_ENV=development\nEXPRESS_APP_PORT=8200\nEXPRESS_APP_DB_URL=mongodb://localhost:27017/${npm_package_name}\nEXPRESS_APP_BASE_URL=http://localhost:${EXPRESS_APP_PORT}/api/"
const stringifiedServerConfig = "import * as express from 'express';\nimport * as bearerToken from 'express-bearer-token';\nimport * as cookieParser from 'cookie-parser';\nimport * as dotenv from 'dotenv';\nimport * as cors from 'cors';\nimport { MongoConnection } from './mongo.config';\nimport * as swaggerUi from 'swagger-ui-express';\nimport * as swaggerDocument from './swagger.json';\nimport initiateRoutes from '../routes';\nvar dotenvExpand = require('dotenv-expand');\n\nclass App {\n    public app: express.Application;\n    private mongoConnection = new MongoConnection();\n\n    constructor() {\n        this.setConfig();\n        initiateRoutes(this.app);\n    }\n\n    private setConfig(): void {\n        const env = dotenv.config();\n        dotenvExpand(env);\n        this.app = express();\n        this.mongoConnection.connect();\n        this.app.use(express.json({ limit: '25mb' }));\n        this.app.use(express.urlencoded({ extended: false, limit: '25mb' }));\n\n        // Authorization header\n        this.app.use(bearerToken());\n\n        // Parse cookies\n        this.app.use(cookieParser());\n\n        // Set cors\n        this.app.use(cors());\n\n        if (process.env.NODE_ENV !== 'production') {\n            swaggerDocument.info.version = process.env.npm_package_version || '0.0.1';\n            swaggerDocument.info.title = process.env.npm_package_name || 'express-boilerplate';\n            //@ts-ignore\n            swaggerDocument.host = process.env.EXPRESS_APP_BASE_URL || `http://localhost:${process.env.EXPRESS_APP_PORT}/api/`;\n            this.app.use('/api/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocument));\n        }\n\n        // Add custom middleware\n        this.app.use((req, res, next) => {\n            // If request comes with the '/api' prefix, then have to remove it.\n            if (req.url.substr(0, 4) === '/api') {\n                req.url = req.url.substr(4);\n            }\n\n            next();\n        });\n    }\n}\n\nexport default new App().app;\n"
const stringifiedMongoConfig = "import { connect, set, connection } from 'mongoose';\n\nexport class MongoConnection {\n    public connect(): void {\n        const mongoDB = process.env.EXPRESS_APP_DB_URL || 'mongodb://localhost:27017/express-app';\n\n        connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });\n\n        set('useCreateIndex', true);\n        set('useFindAndModify', false);\n\n        connection.on('error', console.error.bind(console, 'MongoDB connection error:'));\n    }\n}\n"
const stringifiedSwagger = {"openapi":"3.0.3","info":{"title":"express-boilerplate","version":"0.0.1"},"host":"express-boilerplate","components":{"securitySchemes":{"bearerAuth":{"type":"http","scheme":"bearer","bearerFormat":"JWT"},"basicAuth":{"type":"http","scheme":"basic"}}},"tags":[],"paths":{"/":{"get":{"summary":"API check","description":"API check","operationId":"apiCheck"}}}}
const stringifiedCommonConstants = "export const ONE_HOUR_IN_SECONDS = 60 * 60;\nexport const ONE_MONTH_IN_SECONDS = 60 * 60 * 24 * 30;\nexport const ONE_YEAR_IN_SECONDS = 60 * 60 * 24 * 30 * 12;\n"
const stringifiedErrorConstants = "import { ERROR_MESSAGES } from './response-messages.constant';\n\nexport const ERROR_CODES = {\n    1001: {\n        error_code: 1001,\n        description: ERROR_MESSAGES.INVALID_CREDENTIALS,\n    },\n    1002: {\n        error_code: 1002,\n        description: ERROR_MESSAGES.USER_NOT_FOUND,\n    },\n    1003: {\n        error_code: 1003,\n        description: ERROR_MESSAGES.NOT_MATCHED,\n    },\n    1004: {\n        error_code: 1004,\n        description: ERROR_MESSAGES.EXPIRED_OTP,\n    },\n    1005: {\n        error_code: 1005,\n        description: ERROR_MESSAGES.ALREADY_EXISTS,\n    },\n    1006: {\n        error_code: 1006,\n        description: ERROR_MESSAGES.DATA_NOT_FOUND,\n    },\n};\n"
const stringifiedResponseMessagesConstants = "// Success messages\nexport const SUCCESS_MESSAGES = {\n    SUCCESS: 'SUCCESS',\n    CREATE: 'SUCCESSFULLY CREATED',\n    ADD: 'SUCCESSFULLY ADDED',\n    DELETE: 'SUCCESSFULLY DELETED',\n    UPDATE: 'SUCCESSFULLY UPDATED',\n    VERIFY: 'SUCCESSFULLY VERIFIED',\n};\n\n// General error messages\nexport const ERROR_MESSAGES = {\n    ERROR: 'ERROR',\n    NOT_MATCHED: 'NOT MATCHED',\n    NOT_FOUND: 'NOT FOUND',\n    INTERNAL_SERVER_ERROR: 'INTERNAL SERVER ERROR',\n    UNPROCESSABLE_ENTITY: 'UNPROCESSABLE ENTITY',\n    INSUFFICIENT_PARAMETERS: 'INSUFFICIENT PARAMETERS',\n    UNAUTHORIZED: 'UNAUTHORIZED',\n    TOKEN_EXPIRED: 'ACCESS TOKEN HAS EXPIRED',\n    TOKEN_INVALID: 'ACCESS TOKEN IS INVALID',\n    TOKEN_NOT_ACTIVE: 'ACCESS TOKEN IS NOT ACTIVE',\n    PAGINATION: 'PAGINATION PARAMETERS ARE NOT VALID',\n    INVALID_URL: 'CANNOT FIND THIS ENDPOINT ON THIS SERVER',\n    INVALID_CREDENTIALS: 'INVALID CREDENTIALS',\n    USER_NOT_FOUND: 'USER IS NOT FOUND',\n    DUPLICATE_INFORMATION: 'DUPLICATE INFORMATION',\n    TO_MANY_ATTEMPTS: 'TO MANY ATTEMPTS',\n    ERROR_SEND_OTP: 'OTP MESSAGE SENDING FAILED',\n    EXPIRED_OTP: 'OTP HAS EXPIRED',\n    ALREADY_EXISTS: 'USER ALREADY EXISTS',\n    DATA_NOT_FOUND: 'NO DATA FOUND',\n    ENCRYPTION_ERROR: 'ENCRYPTION ERROR',\n};\n"
const stringifiedErrorHandler = "import { Request, Response } from 'express';\nimport { internalServerErrorResponse } from '../services/response.service';\n\nexport class GlobalErrorHandler {\n    public handler(err: Error, req: Request, res: Response) {\n        internalServerErrorResponse(res, undefined, err.message);\n    }\n}\n"
const stringifiedResponseService = "import StatusCodes from 'http-status-codes';\nimport { Response } from 'express';\nimport { ERROR_CODES } from '../constants/error.constant';\nimport { ERROR_MESSAGES, SUCCESS_MESSAGES } from '../constants/response-messages.constant';\n\nexport function successResponse(res: Response, data?: any, message = SUCCESS_MESSAGES.SUCCESS, extraData = {}) {\n    res.status(StatusCodes.OK).json({\n        success: true,\n        message,\n        data,\n        ...extraData,\n    });\n}\n\nexport function successWithErrorResponse(res: Response, errorCode: number) {\n    const error = ERROR_CODES[errorCode];\n    res.status(StatusCodes.OK).json({\n        success: false,\n        message: error.description,\n        data: error,\n    });\n}\n\nexport function internalServerErrorResponse(res: Response, data?: any, message?: string) {\n    console.log('\\ntimestamp:', new Date().toISOString());\n    console.log(data, message);\n    if (data && data?.name === 'MongoError') {\n        mongoErrorResponse(res, data, message);\n    } else {\n        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({\n            success: false,\n            message: message || ERROR_MESSAGES.INTERNAL_SERVER_ERROR,\n            data,\n        });\n    }\n}\n\nexport function mongoErrorResponse(res: Response, data?: any, message?: string) {\n    console.log('\\ntimestamp:', new Date().toISOString());\n    console.log(data, message);\n    let statusCode = StatusCodes.INTERNAL_SERVER_ERROR;\n    if (data && data?.code === 11000) {\n        statusCode = StatusCodes.OK;\n        message = message || ERROR_MESSAGES.DUPLICATE_INFORMATION;\n        data = undefined;\n    } else {\n        message = message || ERROR_MESSAGES.INTERNAL_SERVER_ERROR;\n    }\n    res.status(statusCode).json({\n        success: false,\n        message,\n        data,\n    });\n}\n\nexport function unProcessableEntityErrorResponse(res: Response, data?: any, message = ERROR_MESSAGES.UNPROCESSABLE_ENTITY) {\n    res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({\n        success: false,\n        message,\n        data,\n    });\n}\n\nexport function validationErrorResponse(res: Response, errors?: any, message = ERROR_MESSAGES.UNPROCESSABLE_ENTITY) {\n    const errMessage = errors && errors.length > 0 && errors[0]?.message ? errors[0]?.message : message;\n    res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({\n        success: false,\n        message: process.env.NODE_ENV === 'production' ? ERROR_MESSAGES.UNPROCESSABLE_ENTITY : errMessage,\n    });\n}\n\nexport function insufficientParametersErrorResponse(res: Response, data?: any, message = ERROR_MESSAGES.INSUFFICIENT_PARAMETERS) {\n    res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({\n        success: false,\n        message,\n        data,\n    });\n}\n\nexport function unauthorizedErrorResponse(res: Response, data?: any, message = ERROR_MESSAGES.UNAUTHORIZED) {\n    res.status(StatusCodes.UNAUTHORIZED).json({\n        success: false,\n        message,\n        data,\n    });\n}\n\nexport function tokenExpireErrorResponse(res: Response, data?: any, message = ERROR_MESSAGES.TOKEN_EXPIRED) {\n    res.status(StatusCodes.UNAUTHORIZED).json({\n        success: false,\n        message,\n        data,\n    });\n}\n\nexport function tokenInvalidErrorResponse(res: Response, data?: any, message = ERROR_MESSAGES.TOKEN_INVALID) {\n    res.status(StatusCodes.UNAUTHORIZED).json({\n        success: false,\n        message,\n        data,\n    });\n}\n\nexport function notFoundErrorResponse(res: Response, data?: any, message = ERROR_MESSAGES.NOT_FOUND) {\n    res.status(StatusCodes.NOT_FOUND).json({\n        success: false,\n        message,\n        data,\n    });\n}\n"
const stringifiedCommonRoutes = "import { Application, Request, Response } from 'express';\nimport { ERROR_MESSAGES } from './constants/response-messages.constant';\nimport { notFoundErrorResponse } from './services/response.service';\n\nexport class CommonRoutes {\n    public route(app: Application) {\n        app.get('/', (req: Request, res: Response) => {\n            res.send(`${process.env.npm_package_name} API v${process.env.npm_package_version}`);\n        });\n\n        app.all('*', (req, res) => {\n            notFoundErrorResponse(res, undefined, ERROR_MESSAGES.INVALID_URL);\n        });\n    }\n}\n"
const stringifiedRoutes = "import { Application } from 'express';\n\nimport { CommonRoutes } from './modules/common/routes';\n\nexport default (app: Application) => {\n    const commonRoutes = new CommonRoutes();\n\n    commonRoutes.route(app);\n};\n"
const stringifiedServer = "import app from './config/server.config';\nimport { GlobalErrorHandler } from './modules/common/middleware/global-error-handler.middleware';\n\nconst PORT = process.env.EXPRESS_APP_PORT || 8200;\n\nprocess.on('uncaughtException', (err) => {\n    console.log('UNCAUGHT EXCEPTION! Shutting down...');\n    console.log(err.name, '/n');\n    console.log(err.message, '/n');\n    console.log(err.stack, '/n');\n    process.exit(1);\n});\n\napp.use(new GlobalErrorHandler().handler);\n\napp.listen(PORT, () => {\n    console.log(`${process.env.npm_package_name || ''} API is listening on port ${PORT}`);\n    if (process.env.NODE_ENV === 'production') {\n        console.log('PRODUCTION MODE: console.log() is disabled.');\n        console.log = () => {};\n    }\n});\n"

series([
() => {
    execSync("git init -q");
    console.log("Setting up the project boilerplate")
    fs.writeFileSync(targetPackageJson, JSON.stringify(packageJson, null, 2), () => {});
    fs.writeFileSync(targetTsConfigJson, JSON.stringify(stringifiedTsConfigJson, null, 2), () => {});
    fs.writeFileSync(targetGitIgnore, stringifiedGitIgnore, () => {});
    fs.writeFileSync(targetPrettierrc, JSON.stringify(stringifiedPrettierrc, null, 2), () => {});
    fs.writeFileSync(targetEslintrc, stringifiedEslintrc, () => {});
    fs.writeFileSync(targetEnv, stringifiedEnv, () => {});
    fs.writeFileSync(targetEnvLocal, stringifiedEnv, () => {});
    if (!fs.existsSync(targetConfig)){
    fs.mkdirSync(targetConfig, { recursive: true });
    }
    fs.writeFileSync(targetServerConfig, stringifiedServerConfig, () => {});
    fs.writeFileSync(targetMongoConfig, stringifiedMongoConfig, () => {});
    fs.writeFileSync(targetSwagger, JSON.stringify(stringifiedSwagger, null, 2), () => {});
    if (!fs.existsSync(targetCommonConstantsDirectory)){
    fs.mkdirSync(targetCommonConstantsDirectory, { recursive: true });
    }
    fs.writeFileSync(targetCommonConstants, stringifiedCommonConstants, () => {});
    fs.writeFileSync(targetErrorConstants, stringifiedErrorConstants, () => {});
    fs.writeFileSync(targetResponseMessagesConstants, stringifiedResponseMessagesConstants, () => {});
    if (!fs.existsSync(targetCommonMiddlewareDirectory)){
    fs.mkdirSync(targetCommonMiddlewareDirectory, { recursive: true });
    }
    fs.writeFileSync(targetErrorHandler, stringifiedErrorHandler, () => {});
    if (!fs.existsSync(targetCommonServicesDirectory)){
    fs.mkdirSync(targetCommonServicesDirectory, { recursive: true });
    }
    fs.writeFileSync(targetServices, stringifiedResponseService, () => {});
    fs.writeFileSync(targetCommonRoutes, stringifiedCommonRoutes, () => {});
    fs.writeFileSync(targetRoutes, stringifiedRoutes, () => {});
    fs.writeFileSync(targetServer, stringifiedServer, () => {});
    execSync("npm install");
    execSync("git add .");
    execSync("git commit -m 'Initial commit'");
    console.log("Project Initialized Successfully.")
},
]);
