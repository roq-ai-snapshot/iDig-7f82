import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { knowledgeBaseValidationSchema } from 'validationSchema/knowledge-bases';
import { convertQueryToPrismaUtil } from 'server/utils';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET':
      return getKnowledgeBaseById();
    case 'PUT':
      return updateKnowledgeBaseById();
    case 'DELETE':
      return deleteKnowledgeBaseById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getKnowledgeBaseById() {
    const data = await prisma.knowledge_base.findFirst(convertQueryToPrismaUtil(req.query, 'knowledge_base'));
    return res.status(200).json(data);
  }

  async function updateKnowledgeBaseById() {
    await knowledgeBaseValidationSchema.validate(req.body);
    const data = await prisma.knowledge_base.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });
    return res.status(200).json(data);
  }
  async function deleteKnowledgeBaseById() {
    const data = await prisma.knowledge_base.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}
