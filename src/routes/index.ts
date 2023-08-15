import express from 'express';
import apiRoute from './api.route';

const routes = (app: express.Application) => {
  app.use('/api/v1', apiRoute)
}

export default routes;