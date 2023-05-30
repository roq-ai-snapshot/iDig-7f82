import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { subscriptionValidationSchema } from 'validationSchema/subscriptions';
import { convertQueryToPrismaUtil } from 'server/utils';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET':
      return getSubscriptionById();
    case 'PUT':
      return updateSubscriptionById();
    case 'DELETE':
      return deleteSubscriptionById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getSubscriptionById() {
    const data = await prisma.subscription.findFirst(convertQueryToPrismaUtil(req.query, 'subscription'));
    return res.status(200).json(data);
  }

  async function updateSubscriptionById() {
    await subscriptionValidationSchema.validate(req.body);
    const data = await prisma.subscription.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });
    return res.status(200).json(data);
  }
  async function deleteSubscriptionById() {
    const data = await prisma.subscription.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}
