import axios from 'axios';
import { google } from 'googleapis';

const GOOGLE_DRIVE_FOLDER_ID = process.env.GOOGLE_DRIVE_FOLDER_ID || '';
const GOOGLE_SERVICE_ACCOUNT_EMAIL = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || '';
const GOOGLE_PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY || '';

if (!GOOGLE_SERVICE_ACCOUNT_EMAIL || !GOOGLE_PRIVATE_KEY) {
  throw new Error('Google service account credentials are not configured');
}

const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: GOOGLE_SERVICE_ACCOUNT_EMAIL,
    private_key: GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  },
  scopes: ['https://www.googleapis.com/auth/drive'],
});

const drive = google.drive({ version: 'v3', auth });

export async function downloadTemplateFromDrive(fileName: string): Promise<Buffer> {
  const folderId = GOOGLE_DRIVE_FOLDER_ID;
  const response = await drive.files.list({
    q: `name='${fileName}' and '${folderId}' in parents and trashed=false`,
    fields: 'files(id, name, mimeType)',
  });

  const files = response.data.files;
  if (!files || files.length === 0) {
    throw new Error(`Template file "${fileName}" not found in Google Drive folder`);
  }

  const fileId = files[0].id;
  if (!fileId) {
    throw new Error(`Template file "${fileName}" has no id`);
  }

  const fileResponse = await drive.files.get({
    fileId,
    alt: 'media',
  }, { responseType: 'arraybuffer' });

  const arrayBuffer = fileResponse.data as unknown as ArrayBuffer;
  return Buffer.from(arrayBuffer);
}

export async function listDriveFiles() {
  const folderId = GOOGLE_DRIVE_FOLDER_ID;
  const response = await drive.files.list({
    q: `'${folderId}' in parents and trashed=false`,
    fields: 'files(id, name, mimeType, modifiedTime)',
    pageSize: 100,
  });
  return response.data.files;
}
