import { Request, Response } from 'express';
import { supabase } from '../db';

export const getFarms = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = (req as any).user;
    const { data, error } = await supabase
      .from('farms')
      .select('*')
      .eq('farmer_id', user.id);

    if (error) throw error;
    res.json({ success: true, data });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createFarm = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = (req as any).user;
    const { name, location, size_hectares } = req.body;

    const { data, error } = await supabase
      .from('farms')
      .insert([{ farmer_id: user.id, name, location, size_hectares }])
      .select('*')
      .single();

    if (error) throw error;
    res.status(201).json({ success: true, data });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
