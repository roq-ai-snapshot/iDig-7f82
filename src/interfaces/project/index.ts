import { SoilConditionInterface } from 'interfaces/soil-condition';
import { ExcavatorInterface } from 'interfaces/excavator';
import { UserInterface } from 'interfaces/user';

export interface ProjectInterface {
  id?: string;
  excavator_id: string;
  contributor_id: string;
  location: string;
  soil_type: string;
  start_date: Date;
  end_date?: Date;
  soil_condition?: SoilConditionInterface[];
  excavator?: ExcavatorInterface;
  user?: UserInterface;
  _count?: {
    soil_condition?: number;
  };
}
