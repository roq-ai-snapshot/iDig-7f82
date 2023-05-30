import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { knowledgeBaseValidationSchema } from 'validationSchema/knowledge-bases';
import { convertQueryToPrismaUtil } from 'server/utils';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET':
      return getKnowledgeBases();
    case 'POST':
      return createKnowledgeBase();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getKnowledgeBases() {
    const data = await prisma.knowledge_base.findMany(convertQueryToPrismaUtil(req.query, 'knowledge_base'));
    return res.status(200).json(data);
  }

  async function createKnowledgeBase() {
    await knowledgeBaseValidationSchema.validate(req.body);
    const body = { ...req.body };

    const data = await prisma.knowledge_base.create({
      data: body,
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}
