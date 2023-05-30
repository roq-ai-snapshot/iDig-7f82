import axios from 'axios';
import queryString from 'query-string';
import { KnowledgeBaseInterface } from 'interfaces/knowledge-base';
import { GetQueryInterface } from '../../interfaces';

export const getKnowledgeBases = async (query?: GetQueryInterface) => {
  const response = await axios.get(`/api/knowledge-bases${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createKnowledgeBase = async (knowledgeBase: KnowledgeBaseInterface) => {
  const response = await axios.post('/api/knowledge-bases', knowledgeBase);
  return response.data;
};

export const updateKnowledgeBaseById = async (id: string, knowledgeBase: KnowledgeBaseInterface) => {
  const response = await axios.put(`/api/knowledge-bases/${id}`, knowledgeBase);
  return response.data;
};

export const getKnowledgeBaseById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/knowledge-bases/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteKnowledgeBaseById = async (id: string) => {
  const response = await axios.delete(`/api/knowledge-bases/${id}`);
  return response.data;
};
