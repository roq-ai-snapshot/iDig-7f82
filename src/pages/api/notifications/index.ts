import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { notificationValidationSchema } from 'validationSchema/notifications';
import { convertQueryToPrismaUtil } from 'server/utils';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET':
      return getNotifications();
    case 'POST':
      return createNotification();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getNotifications() {
    const data = await prisma.notification.findMany(convertQueryToPrismaUtil(req.query, 'notification'));
    return res.status(200).json(data);
  }

  async function createNotification() {
    await notificationValidationSchema.validate(req.body);
    const body = { ...req.body };

    const data = await prisma.notification.create({
      data: body,
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}
