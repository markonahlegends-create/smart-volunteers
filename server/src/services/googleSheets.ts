import axios from 'axios';

const APPS_SCRIPT_URL = process.env.GOOGLE_APPS_SCRIPT_URL || '';

export interface GoogleSheetPayload {
  sheet: string;
  data?: Record<string, any>[];
  action?: 'sync' | 'append' | 'update' | 'delete' | 'insert' | 'clear';
  type?: 'member' | 'unit' | 'relawan' | 'bencana' | 'kegiatan';
}

export async function syncToGoogleSheets(payload: GoogleSheetPayload) {
  if (!APPS_SCRIPT_URL) {
    throw new Error('GOOGLE_APPS_SCRIPT_URL is not configured');
  }

  const url = `${APPS_SCRIPT_URL.replace(/\/$/, '')}`;
  const response = await axios.post(url, payload, {
    headers: { 'Content-Type': 'application/json' },
    timeout: 180000,
  });

  return response.data;
}
