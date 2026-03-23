interface Props {
  message?: string;
}

export function AdminEmptyState({ message = "Kayit bulunamadi." }: Props) {
  return <p className="text-center text-muted py-12 text-sm">{message}</p>;
}
