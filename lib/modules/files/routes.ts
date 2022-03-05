const axios = require('axios');
import { Application, Request, Response } from 'express';
import { FilesController } from './controllers/files.controller';

export class FilesRoutes {
    private filesController = new FilesController();
    public route(app: Application) {
        app.post('/express', (req: Request, res: Response) => {
            this.filesController.generateExpressScript(req, res);
        });

        app.post('/react-native', (req: Request, res: Response) => {
            this.filesController.generateReactNativeScript(req, res);
        });
    }
}
