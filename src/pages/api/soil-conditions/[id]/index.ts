import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { soilConditionValidationSchema } from 'validationSchema/soil-conditions';
import { convertQueryToPrismaUtil } from 'server/utils';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET':
      return getSoilConditionById();
    case 'PUT':
      return updateSoilConditionById();
    case 'DELETE':
      return deleteSoilConditionById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getSoilConditionById() {
    const data = await prisma.soil_condition.findFirst(convertQueryToPrismaUtil(req.query, 'soil_condition'));
    return res.status(200).json(data);
  }

  async function updateSoilConditionById() {
    await soilConditionValidationSchema.validate(req.body);
    const data = await prisma.soil_condition.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });
    return res.status(200).json(data);
  }
  async function deleteSoilConditionById() {
    const data = await prisma.soil_condition.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}
