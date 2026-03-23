import { Button } from "@/components/ui/Button";

interface Props {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function AdminPagination({ page, totalPages, onPageChange }: Props) {
  if (totalPages <= 1) return null;
  return (
    <div className="flex items-center justify-center gap-2 mt-6">
      <Button variant="secondary" size="sm" disabled={page === 1} onClick={() => onPageChange(page - 1)}>
        &larr; Onceki
      </Button>
      <span className="text-sm text-muted">{page} / {totalPages}</span>
      <Button variant="secondary" size="sm" disabled={page === totalPages} onClick={() => onPageChange(page + 1)}>
        Sonraki &rarr;
      </Button>
    </div>
  );
}
