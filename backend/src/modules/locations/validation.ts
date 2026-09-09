import {z} from 'zod';
export const locationValueSchema=z.object({id:z.string().max(100).optional(),label:z.string().trim().min(1).max(400),city:z.string().max(128).optional(),district:z.string().max(128).optional(),lat:z.number().min(-90).max(90).optional(),lng:z.number().min(-180).max(180).optional()}).refine(v=>(v.lat===undefined)===(v.lng===undefined),'Koordinatlar birlikte gönderilmeli');
export type LocationValue=z.infer<typeof locationValueSchema>;
export const locationSearchSchema=z.object({q:z.string().trim().min(3).max(400)});
