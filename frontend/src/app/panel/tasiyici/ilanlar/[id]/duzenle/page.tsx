'use client';
import { useParams } from 'next/navigation';
import IlanVerForm from '@/modules/ilan/components/IlanVerForm';
export default function EditListing(){const {id}=useParams<{id:string}>();return <div className="mx-auto max-w-3xl"><h1 className="mb-8 text-3xl font-bold">İlanı düzenle</h1><IlanVerForm editId={id}/></div>;}
