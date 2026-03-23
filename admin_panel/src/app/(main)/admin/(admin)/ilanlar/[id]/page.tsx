// =============================================================
// FILE: src/app/(main)/admin/(admin)/ilanlar/[id]/page.tsx
// =============================================================

interface Props {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: Props) {
  const { id } = await params;
  return (
    <div className="p-6 text-muted-foreground">
      İlan ID: {id}
    </div>
  );
}
