import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { communityForumValidationSchema } from 'validationSchema/community-forums';
import { convertQueryToPrismaUtil } from 'server/utils';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET':
      return getCommunityForums();
    case 'POST':
      return createCommunityForum();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getCommunityForums() {
    const data = await prisma.community_forum.findMany(convertQueryToPrismaUtil(req.query, 'community_forum'));
    return res.status(200).json(data);
  }

  async function createCommunityForum() {
    await communityForumValidationSchema.validate(req.body);
    const body = { ...req.body };
    if (body?.forum_comment?.length > 0) {
      const create_forum_comment = body.forum_comment;
      body.forum_comment = {
        create: create_forum_comment,
      };
    } else {
      delete body.forum_comment;
    }
    const data = await prisma.community_forum.create({
      data: body,
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}
