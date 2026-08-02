import { Request, Response } from 'express';
import { supabase } from '../db';

export const getPosts = async (req: Request, res: Response): Promise<void> => {
  try {
    const { data, error } = await supabase
      .from('community_posts')
      .select('*, author:users(name, role), comments:community_comments(*)')
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json({ success: true, data });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createPost = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = (req as any).user;
    const { content, image_url } = req.body;

    const { data, error } = await supabase
      .from('community_posts')
      .insert([{ author_id: user.id, content, image_url }])
      .select('*')
      .single();

    if (error) throw error;
    res.status(201).json({ success: true, data });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const addComment = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = (req as any).user;
    const { id: post_id } = req.params;
    const { content } = req.body;

    const { data, error } = await supabase
      .from('community_comments')
      .insert([{ post_id, author_id: user.id, content }])
      .select('*')
      .single();

    if (error) throw error;
    res.status(201).json({ success: true, data });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const likePost = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    // In a real app we'd have a likes table to prevent double liking, 
    // but for simplicity based on the schema, we increment likes_count.
    // Fetch current likes
    const { data: post, error: fetchError } = await supabase
      .from('community_posts')
      .select('likes_count')
      .eq('id', id)
      .single();
      
    if (fetchError || !post) throw fetchError || new Error('Post not found');

    const { data, error } = await supabase
      .from('community_posts')
      .update({ likes_count: post.likes_count + 1 })
      .eq('id', id)
      .select('*')
      .single();

    if (error) throw error;
    res.json({ success: true, data });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const { count: totalFarmers, error: usersError } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true });

    if (usersError) throw usersError;

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const { count: todayAlerts, error: alertsError } = await supabase
      .from('detections')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', startOfDay.toISOString());

    if (alertsError) throw alertsError;

    res.json({
      success: true,
      data: {
        totalFarmers: totalFarmers || 0,
        todayAlerts: todayAlerts || 0
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
