export const generateExpressFile = (
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
) => {
    const mainFile = `
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

const stringifiedPackageJson = '${stringifiedPackageJson}'
const packageJson = JSON.parse(stringifiedPackageJson)
packageJson.name = "${name}";
packageJson.description = "${description}";
packageJson.author = "${author}";

const stringifiedTsConfigJson = ${stringifiedTsConfigJson}
const stringifiedGitIgnore = ${stringifiedGitIgnore}
const stringifiedPrettierrc = ${stringifiedPrettierrc}
const stringifiedEslintrc = ${stringifiedEslintrc}
const stringifiedEnv = ${stringifiedEnv}
const stringifiedServerConfig = ${stringifiedServerConfig}
const stringifiedMongoConfig = ${stringifiedMongoConfig}
const stringifiedSwagger = ${stringifiedSwagger}
const stringifiedCommonConstants = ${stringifiedCommonConstants}
const stringifiedErrorConstants = ${stringifiedErrorConstants}
const stringifiedResponseMessagesConstants = ${stringifiedResponseMessagesConstants}
const stringifiedErrorHandler = ${stringifiedErrorHandler}
const stringifiedResponseService = ${stringifiedResponseService}
const stringifiedCommonRoutes = ${stringifiedCommonRoutes}
const stringifiedRoutes = ${stringifiedRoutes}
const stringifiedServer = ${stringifiedServer}

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
`;
    return mainFile;
};
