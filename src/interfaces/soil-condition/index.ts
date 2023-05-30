import { ProjectInterface } from 'interfaces/project';

export interface SoilConditionInterface {
  id?: string;
  project_id: string;
  soil_type: string;
  depth: number;
  moisture_content: number;
  bearing_capacity: number;

  project?: ProjectInterface;
  _count?: {};
}
