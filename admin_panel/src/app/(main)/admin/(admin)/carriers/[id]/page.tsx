import CarrierDetailClient from '../_components/carrier-detail-client';

type Params = { id: string };

export default async function Page({ params }: { params: Promise<Params> }) {
  const p = await params;
  return <CarrierDetailClient id={p.id} />;
}
