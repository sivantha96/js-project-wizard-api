const axios = require('axios');
import { Application, Request, Response } from 'express';
import { FilesController } from './controllers/files.controller';

export class FilesRoutes {
    private filesController = new FilesController();
    public route(app: Application) {
        app.get('/express', (req: Request, res: Response) => {
            this.filesController.getExpressScript(req, res);
        });
    }
}
