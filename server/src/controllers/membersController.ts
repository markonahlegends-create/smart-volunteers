import { Request, Response } from 'express';
import {
  getMembers,
  getMemberById,
  createMember,
  updateMember,
  deleteMember,
} from './membersGeneric';

export const getPMR = (req: Request, res: Response) => getMembers(req, res, 'pmr');
export const getPMRMemberById = (req: Request, res: Response) => getMemberById(req, res, 'pmr');
export const getKSRMembers = (req: Request, res: Response) => getMembers(req, res, 'ksr');
export const getKSRMemberById = (req: Request, res: Response) => getMemberById(req, res, 'ksr');
export const getTSRMembers = (req: Request, res: Response) => getMembers(req, res, 'tsr');
export const getTSRMemberById = (req: Request, res: Response) => getMemberById(req, res, 'tsr');
export const getDDSMembers = (req: Request, res: Response) => getMembers(req, res, 'dds');
export const getDDSMemberById = (req: Request, res: Response) => getMemberById(req, res, 'dds');

export const createAnggotaPMR = (req: Request, res: Response) => createMember(req, res, 'pmr');
export const updateAnggotaPMR = (req: Request, res: Response) => updateMember(req, res, 'pmr');
export const deleteAnggotaPMR = (req: Request, res: Response) => deleteMember(req, res, 'pmr');

export const createAnggotaKSR = (req: Request, res: Response) => createMember(req, res, 'ksr');
export const updateAnggotaKSR = (req: Request, res: Response) => updateMember(req, res, 'ksr');
export const deleteAnggotaKSR = (req: Request, res: Response) => deleteMember(req, res, 'ksr');

export const createAnggotaTSR = (req: Request, res: Response) => createMember(req, res, 'tsr');
export const updateAnggotaTSR = (req: Request, res: Response) => updateMember(req, res, 'tsr');
export const deleteAnggotaTSR = (req: Request, res: Response) => deleteMember(req, res, 'tsr');

export const createAnggotaDDS = (req: Request, res: Response) => createMember(req, res, 'dds');
export const updateAnggotaDDS = (req: Request, res: Response) => updateMember(req, res, 'dds');
export const deleteAnggotaDDS = (req: Request, res: Response) => deleteMember(req, res, 'dds');
