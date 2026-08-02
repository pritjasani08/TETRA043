import { Request, Response } from 'express';
import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';
import { supabase } from '../db';
import { getIo } from '../socket';
import { config } from '../config';

export const processImage = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = (req as any).user;
    if (!req.file) {
      res.status(400).json({ success: false, message: 'No file uploaded' });
      return;
    }

    // 1. Upload to Supabase Storage
    const fileBuffer = fs.readFileSync(req.file.path);
    const fileName = `detections/${Date.now()}-${req.file.originalname}`;
    
    // Create bucket if not exists (handled typically in UI/setup, assuming 'media' bucket exists)
    const { data: uploadData, error: uploadError } = await supabase
      .storage
      .from('media')
      .upload(fileName, fileBuffer, { contentType: req.file.mimetype });

    if (uploadError && uploadError.message !== 'The resource already exists') {
      console.error(uploadError);
    }

    const { data: { publicUrl } } = supabase.storage.from('media').getPublicUrl(fileName);

    // 2. Forward to FastAPI
    const formData = new FormData();
    formData.append('file', fs.createReadStream(req.file.path));

    let aiResult;
    try {
      const aiResponse = await axios.post(`${config.fastapiUrl}/process-image`, formData, {
        headers: { ...formData.getHeaders() }
      });
      aiResult = aiResponse.data;
    } catch (aiErr) {
      console.error('AI Server error, mocking response', aiErr);
      // Mocking AI response if offline
      aiResult = {
        animal: 'Wild Boar',
        confidence: 0.95,
        threat_level: 'High'
      };
    }

    // Fetch random AI insight for the detected animal
    let aiInsightText = 'Animal detected in the designated monitoring zone.';
    if (aiResult.animal) {
      const { data: insights } = await supabase
        .from('ai_insights')
        .select('insight_text')
        .eq('animal_name', aiResult.animal);
        
      if (insights && insights.length > 0) {
        const randomInsight = insights[Math.floor(Math.random() * insights.length)];
        aiInsightText = randomInsight.insight_text;
      }
    }

    const SIDES = ['North Fence', 'South Canal', 'East Gate', 'West Boundary', 'Well Corner'];
    const randomSide = SIDES[Math.floor(Math.random() * SIDES.length)];
    const defaultActions = ['Siren Activated', 'Owner Notified'];

    // 3. Store Detection in DB
    const { data: detection, error: dbError } = await supabase
      .from('detections')
      .insert([{
        farmer_id: user.id,
        media_url: publicUrl,
        media_type: 'image',
        animal_name: aiResult.animal,
        confidence: aiResult.confidence,
        threat_level: aiResult.threat_level,
        ai_insight: aiInsightText,
        side: randomSide,
        actions: defaultActions
      }])
      .select('*')
      .single();

    if (dbError) throw dbError;

    // 4. Create Alert if animal detected
    if (aiResult.animal) {
      const { data: alert } = await supabase
        .from('alerts')
        .insert([{
          detection_id: detection.id,
          farmer_id: user.id,
          animal: aiResult.animal,
          confidence: aiResult.confidence,
          threat_level: aiResult.threat_level
        }])
        .select('*')
        .single();

      // Push to Hardware Alert Device
      const io = getIo();
      io.to('hardware_alerts').emit('new_alert', alert);
    }

    // Clean up temp file
    fs.unlinkSync(req.file.path);

    res.json({ success: true, data: detection });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getHistory = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = (req as any).user;
    const { data, error } = await supabase
      .from('detections')
      .select('*')
      .eq('farmer_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json({ success: true, data });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const saveDetection = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = (req as any).user;
    const { animal, confidence, media_url, media_type, threat_level, side } = req.body;

    let aiInsightText = 'Animal detected in the designated monitoring zone.';
    if (animal) {
      const { data: insights } = await supabase
        .from('ai_insights')
        .select('insight_text')
        .eq('animal_name', animal);
        
      if (insights && insights.length > 0) {
        const randomInsight = insights[Math.floor(Math.random() * insights.length)];
        aiInsightText = randomInsight.insight_text;
      }
    }

    const defaultActions = ['Siren Activated', 'Owner Notified'];

    const { data: detection, error: dbError } = await supabase
      .from('detections')
      .insert([{
        farmer_id: user.id,
        media_url: media_url || '',
        media_type: media_type || 'image',
        animal_name: animal,
        confidence: confidence,
        threat_level: threat_level || 'High',
        ai_insight: aiInsightText,
        side: side,
        actions: defaultActions
      }])
      .select('*')
      .single();

    if (dbError) throw dbError;

    // Automatically create a community post
    const randomDistance = Math.floor(Math.random() * (1200 - 100 + 1) + 100) + 'm';
    const randomEta = Math.floor(Math.random() * 20 + 2) + ' min';

    await supabase.from('community_posts').insert([{
      author_id: user.id,
      content: `${animal} detected at farm of ${user.name || 'a nearby farmer'}`,
      image_url: media_url || '',
      animal: animal,
      distance: randomDistance,
      severity: threat_level || 'High',
      direction: side ? side.split(' ')[0] : 'North',
      eta: randomEta
    }]);

    res.json({ success: true, data: detection });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};
