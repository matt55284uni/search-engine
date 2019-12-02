import express from 'express';
import path from 'path';
import { SERVER, DIRECTORY, ROUTES } from './config';
import Crawler from './lib/Crawler';
import Database from './lib/Database';

import { indexRouter } from './routes/index';

export const server = express();
export default server;

server.set('views', DIRECTORY.VIEWS);
server.set('view engine', SERVER.VIEW_ENGINE);
server.use(express.json());
server.use(express.urlencoded({ extended: false }));
server.use(express.static(DIRECTORY.PUBLIC));

server.use(ROUTES.INDEX.path, indexRouter);

Crawler.init();

