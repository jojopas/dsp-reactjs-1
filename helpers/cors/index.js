import cors from 'cors';

import { runMiddleware } from './middleware';
import {constants} from "../../config";

const validateCors = async (req, res) => {
    const corsOptions = {
        methods: ['GET', 'HEAD', 'POST', 'OPTIONS'],
        origin: constants.CORS_WHITELIST
    };
    await runMiddleware(req, res, cors(corsOptions));
}

module.exports = {
    runMiddleware,
    validateCors
}
