import { useState, useEffect, useCallback } from "react";
import type { AdminListParams } from "@/modules/admin/admin.service";

interface UseAdminListOptions<T> {
  fetcher: (params: AdminListParams) => Promise<T[]>;
  limit?: number;
  params?: AdminListParams;
}

export function useAdminList<T>({ fetcher, limit = 20, params = {} }: UseAdminListOptions<T>) {
  const [rows, setRows] = useState<T[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState<string | null>(null);

  const paramsKey = JSON.stringify(params);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetcher({ page, limit, ...JSON.parse(paramsKey) });
      setRows(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [fetcher, page, limit, paramsKey]);

  useEffect(() => { load(); }, [load]);

  function resetPage() { setPage(1); }

  return { rows, page, setPage, loading, actionId, setActionId, reload: load, resetPage, limit };
}
