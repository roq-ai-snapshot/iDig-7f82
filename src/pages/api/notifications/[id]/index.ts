import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { notificationValidationSchema } from 'validationSchema/notifications';
import { convertQueryToPrismaUtil } from 'server/utils';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET':
      return getNotificationById();
    case 'PUT':
      return updateNotificationById();
    case 'DELETE':
      return deleteNotificationById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getNotificationById() {
    const data = await prisma.notification.findFirst(convertQueryToPrismaUtil(req.query, 'notification'));
    return res.status(200).json(data);
  }

  async function updateNotificationById() {
    await notificationValidationSchema.validate(req.body);
    const data = await prisma.notification.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });
    return res.status(200).json(data);
  }
  async function deleteNotificationById() {
    const data = await prisma.notification.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}
