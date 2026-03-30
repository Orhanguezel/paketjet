import CarrierAgreementDetailClient from '../_components/carrier-agreement-detail-client';

type Params = { id: string };

export default async function Page({ params }: { params: Promise<Params> }) {
  const p = await params;
  return <CarrierAgreementDetailClient id={p.id} />;
}
