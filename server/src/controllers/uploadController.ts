import { Request, Response } from 'express';
import axios from 'axios';
import fs from 'fs';

const APPS_SCRIPT_URL = process.env.GOOGLE_APPS_SCRIPT_URL || '';

export const uploadFotoRelawan = async (req: Request, res: Response) => {
  try {
    const { profileId, file, fileName, mimeType } = req.body;

    if (!file || !fileName) {
      return res.status(400).json({ message: 'File tidak ditemukan' });
    }

    if (!APPS_SCRIPT_URL) {
      return res.status(500).json({ message: 'Google Apps Script URL tidak dikonfigurasi' });
    }

    const base64Data = file.includes(',') ? file.split(',')[1] : file;

    const response = await axios.post(APPS_SCRIPT_URL, {
      action: 'upload',
      data: {
        file: base64Data,
        fileName,
        mimeType,
        profileId,
        category: 'Relawan/Foto'
      }
    }, {
      headers: { 'Content-Type': 'application/json' },
      timeout: 180000,
    });

    res.json(response.data);
  } catch (error: any) {
    console.error('Upload error:', error.message);
    res.status(500).json({ message: 'Gagal upload foto', error: error.message });
  }
};

export const uploadDokumenRelawan = async (req: Request, res: Response) => {
  try {
    const { profileId, file, fileName, mimeType, category = 'Relawan/Dokumen' } = req.body;

    if (!file || !fileName) {
      return res.status(400).json({ message: 'File tidak ditemukan' });
    }

    if (!APPS_SCRIPT_URL) {
      return res.status(500).json({ message: 'Google Apps Script URL tidak dikonfigurasi' });
    }

    const base64Data = file.includes(',') ? file.split(',')[1] : file;

    const response = await axios.post(APPS_SCRIPT_URL, {
      action: 'upload',
      data: {
        file: base64Data,
        fileName,
        mimeType,
        profileId,
        category
      }
    }, {
      headers: { 'Content-Type': 'application/json' },
      timeout: 180000,
    });

    res.json(response.data);
  } catch (error: any) {
    console.error('Upload error:', error.message);
    res.status(500).json({ message: 'Gagal upload dokumen', error: error.message });
  }
};
