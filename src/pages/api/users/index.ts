import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { userValidationSchema } from 'validationSchema/users';
import { convertQueryToPrismaUtil } from 'server/utils';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET':
      return getUsers();
    case 'POST':
      return createUser();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getUsers() {
    const data = await prisma.user.findMany(convertQueryToPrismaUtil(req.query, 'user'));
    return res.status(200).json(data);
  }

  async function createUser() {
    await userValidationSchema.validate(req.body);
    const body = { ...req.body };
    if (body?.community_forum?.length > 0) {
      const create_community_forum = body.community_forum;
      body.community_forum = {
        create: create_community_forum,
      };
    } else {
      delete body.community_forum;
    }
    if (body?.excavator?.length > 0) {
      const create_excavator = body.excavator;
      body.excavator = {
        create: create_excavator,
      };
    } else {
      delete body.excavator;
    }
    if (body?.forum_comment?.length > 0) {
      const create_forum_comment = body.forum_comment;
      body.forum_comment = {
        create: create_forum_comment,
      };
    } else {
      delete body.forum_comment;
    }
    if (body?.knowledge_base?.length > 0) {
      const create_knowledge_base = body.knowledge_base;
      body.knowledge_base = {
        create: create_knowledge_base,
      };
    } else {
      delete body.knowledge_base;
    }
    if (body?.notification?.length > 0) {
      const create_notification = body.notification;
      body.notification = {
        create: create_notification,
      };
    } else {
      delete body.notification;
    }
    if (body?.project?.length > 0) {
      const create_project = body.project;
      body.project = {
        create: create_project,
      };
    } else {
      delete body.project;
    }
    if (body?.subscription?.length > 0) {
      const create_subscription = body.subscription;
      body.subscription = {
        create: create_subscription,
      };
    } else {
      delete body.subscription;
    }
    const data = await prisma.user.create({
      data: body,
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}
