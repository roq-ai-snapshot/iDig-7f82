import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { projectValidationSchema } from 'validationSchema/projects';
import { convertQueryToPrismaUtil } from 'server/utils';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET':
      return getProjects();
    case 'POST':
      return createProject();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getProjects() {
    const data = await prisma.project.findMany(convertQueryToPrismaUtil(req.query, 'project'));
    return res.status(200).json(data);
  }

  async function createProject() {
    await projectValidationSchema.validate(req.body);
    const body = { ...req.body };
    if (body?.soil_condition?.length > 0) {
      const create_soil_condition = body.soil_condition;
      body.soil_condition = {
        create: create_soil_condition,
      };
    } else {
      delete body.soil_condition;
    }
    const data = await prisma.project.create({
      data: body,
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}
