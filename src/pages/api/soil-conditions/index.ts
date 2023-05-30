import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { soilConditionValidationSchema } from 'validationSchema/soil-conditions';
import { convertQueryToPrismaUtil } from 'server/utils';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET':
      return getSoilConditions();
    case 'POST':
      return createSoilCondition();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getSoilConditions() {
    const data = await prisma.soil_condition.findMany(convertQueryToPrismaUtil(req.query, 'soil_condition'));
    return res.status(200).json(data);
  }

  async function createSoilCondition() {
    await soilConditionValidationSchema.validate(req.body);
    const body = { ...req.body };

    const data = await prisma.soil_condition.create({
      data: body,
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}
