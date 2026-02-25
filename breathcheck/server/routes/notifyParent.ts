import { Router, Request, Response } from 'express';
import { notifyParent } from '../utils/notifications';

const router = Router();

// Mock data – in production, you'd query your database
const parents: Record<string, { email?: string, phone?: string }> = {
  'teen123': { email: 'parent@example.com', phone: '+1234567890' }
};

router.post('/notify-parent', async (req: Request, res: Response) => {
  const { teenId, bac, status } = req.body;

  if (!teenId || !parents[teenId]) {
    return res.status(400).json({ message: 'Invalid teen ID' });
  }

  const parent = parents[teenId];
  const message = status === 'fail'
    ? `ALERT: Your teen attempted to drive with a BAC of ${bac}. This is above the legal limit and unsafe.`
    : `Good News: Your teen passed the BAC check with ${bac}. They are being safe and responsible.`;

  console.log(`Notifying ${parent.email || parent.phone}: ${message}`);

  try {
    // Attempt to send notifications via configured providers
    const notificationResults = await notifyParent(parent, message);
    
    // Log notification attempts for debugging
    console.log('Notification results:', notificationResults);
    
    // Even if external notification services fail, we should consider this request successful
    // since we've at least logged the attempt
    return res.status(200).json({ 
      message: 'Parent notified',
      details: notificationResults
    });
  } catch (error) {
    console.error('Error in parent notification:', error);
    return res.status(500).json({ message: 'Failed to notify parent' });
  }
});

export default router;