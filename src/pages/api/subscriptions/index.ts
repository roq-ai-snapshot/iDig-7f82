import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { subscriptionValidationSchema } from 'validationSchema/subscriptions';
import { convertQueryToPrismaUtil } from 'server/utils';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET':
      return getSubscriptions();
    case 'POST':
      return createSubscription();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getSubscriptions() {
    const data = await prisma.subscription.findMany(convertQueryToPrismaUtil(req.query, 'subscription'));
    return res.status(200).json(data);
  }

  async function createSubscription() {
    await subscriptionValidationSchema.validate(req.body);
    const body = { ...req.body };

    const data = await prisma.subscription.create({
      data: body,
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}
