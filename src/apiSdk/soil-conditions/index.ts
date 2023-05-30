import axios from 'axios';
import queryString from 'query-string';
import { SoilConditionInterface } from 'interfaces/soil-condition';
import { GetQueryInterface } from '../../interfaces';

export const getSoilConditions = async (query?: GetQueryInterface) => {
  const response = await axios.get(`/api/soil-conditions${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createSoilCondition = async (soilCondition: SoilConditionInterface) => {
  const response = await axios.post('/api/soil-conditions', soilCondition);
  return response.data;
};

export const updateSoilConditionById = async (id: string, soilCondition: SoilConditionInterface) => {
  const response = await axios.put(`/api/soil-conditions/${id}`, soilCondition);
  return response.data;
};

export const getSoilConditionById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/soil-conditions/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteSoilConditionById = async (id: string) => {
  const response = await axios.delete(`/api/soil-conditions/${id}`);
  return response.data;
};
