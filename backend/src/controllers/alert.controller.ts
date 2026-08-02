import { Request, Response } from 'express';
import { getIo } from '../socket';
import crypto from 'crypto';

// In-memory state for the active alert
let activeAlert: any = null;

export const triggerAlert = async (req: Request, res: Response) => {
  try {
    const { animal, camera, threatLevel } = req.body;
    
    if (!animal) {
      return res.status(400).json({ success: false, error: 'Animal type is required' });
    }

    activeAlert = {
      id: crypto.randomUUID(),
      animal,
      camera: camera || 'Unknown',
      threatLevel: threatLevel || 'High',
      timestamp: new Date().toISOString()
    };

    console.log(`[ALERT] Triggered hardware alert for: ${animal}`);

    // Broadcast the alert to hardware devices via Socket.io
    const io = getIo();
    io.to('hardware_alerts').emit('hardware_alert_triggered', activeAlert);

    res.json({ success: true, alert: activeAlert });
  } catch (error) {
    console.error('Trigger alert error:', error);
    res.status(500).json({ success: false, error: 'Failed to trigger alert' });
  }
};

export const pollAlert = async (req: Request, res: Response) => {
  try {
    // Return the active alert, or null if none
    if (activeAlert) {
      res.json(activeAlert);
    } else {
      res.json({ animal: null }); // Using standard format frontend expects
    }
  } catch (error) {
    console.error('Poll alert error:', error);
    res.status(500).json({ success: false, error: 'Failed to poll alerts' });
  }
};

export const clearAlert = async (req: Request, res: Response) => {
  try {
    activeAlert = null;
    
    // Broadcast the clear event to hardware devices via Socket.io
    const io = getIo();
    io.to('hardware_alerts').emit('hardware_alert_cleared');

    console.log('[ALERT] Hardware alert manually cleared.');
    res.json({ success: true });
  } catch (error) {
    console.error('Clear alert error:', error);
    res.status(500).json({ success: false, error: 'Failed to clear alert' });
  }
};
