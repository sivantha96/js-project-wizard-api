import { Application } from 'express';

import { CommonRoutes } from './modules/common/routes';
import { FilesRoutes } from './modules/files/routes';

export default (app: Application) => {
    const filesRoutes = new FilesRoutes();
    const commonRoutes = new CommonRoutes();

    filesRoutes.route(app);
    commonRoutes.route(app);
};
