import { createProjectRequest, deleteProjectRequest, getAllProjectsRequest, getProjectByIdRequest } from '@backend/controllers/projectController';
import express from 'express';

const projectRouter = express.Router();

projectRouter.post('/', createProjectRequest);

projectRouter.get('/', getAllProjectsRequest);

projectRouter.get('/:id', getProjectByIdRequest);

projectRouter.delete('/:id', deleteProjectRequest);

export default projectRouter;
