import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { communityForumValidationSchema } from 'validationSchema/community-forums';
import { convertQueryToPrismaUtil } from 'server/utils';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET':
      return getCommunityForumById();
    case 'PUT':
      return updateCommunityForumById();
    case 'DELETE':
      return deleteCommunityForumById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getCommunityForumById() {
    const data = await prisma.community_forum.findFirst(convertQueryToPrismaUtil(req.query, 'community_forum'));
    return res.status(200).json(data);
  }

  async function updateCommunityForumById() {
    await communityForumValidationSchema.validate(req.body);
    const data = await prisma.community_forum.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });
    return res.status(200).json(data);
  }
  async function deleteCommunityForumById() {
    const data = await prisma.community_forum.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}
