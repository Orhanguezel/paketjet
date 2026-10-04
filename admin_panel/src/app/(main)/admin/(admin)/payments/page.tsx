"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useListPaymentOperationsQuery } from "@/integrations/hooks";
import { formatIlanPurchaseDate, formatIlanPurchaseMoney, paymentStateLabels } from "@/integrations/shared";

import { PaymentDetailDrawer } from "./_components/payment-detail-drawer";

const providerLabel = (provider: string) =>
  provider === "bank_test"
    ? "TEST HAVALESİ"
    : provider === "bank_transfer"
      ? "Havale"
      : provider === "shopier"
        ? "Shopier (kart)"
        : provider;
const kindLabel = (kind: string) =>
  kind === "listing" ? "İletişim alımı" : kind === "credits" ? "Hak paketi" : "Eski işlem";

export default function PaymentsPage() {
  const [page, setPage] = useState(1);
  const [state, setState] = useState("");
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState("");
  const [detailOpen, setDetailOpen] = useState(false);
  const list = useListPaymentOperationsQuery({ page, state: state || undefined, search: query || undefined });

  function openDetail(reference: string) {
    setSelected(reference);
    setDetailOpen(true);
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Ödeme inceleme kuyruğu</CardTitle>
          <CardDescription>
            Tahsilat, erişim teslimi ve iade takibi. Eski ve doğrulanmamış kayıtlar incelemede tutulur.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <form
            className="flex flex-wrap items-end gap-3"
            onSubmit={(event) => {
              event.preventDefault();
              setPage(1);
              setQuery(search);
            }}
          >
            <label htmlFor="payment-search" className="space-y-2 text-sm">
              Referans veya kullanıcı kimliği
              <Input
                id="payment-search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Ara"
              />
            </label>
            <label htmlFor="payment-state" className="space-y-2 text-sm">
              Durum
              <select
                id="payment-state"
                className="flex h-10 rounded-md border border-input bg-background px-3"
                value={state}
                onChange={(event) => {
                  setState(event.target.value);
                  setPage(1);
                }}
              >
                <option value="">Tümü</option>
                {Object.entries(paymentStateLabels).map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
            </label>
            <Button type="submit" variant="outline">
              Filtrele
            </Button>
            <Button type="button" variant="outline" disabled={list.isFetching} onClick={() => list.refetch()}>
              Yenile
            </Button>
          </form>
          {list.isError ? (
            <p role="alert">Ödeme kayıtları yüklenemedi. Yenile düğmesiyle tekrar deneyin.</p>
          ) : list.isLoading ? (
            <output>Ödemeler yükleniyor…</output>
          ) : (
            <>
              <div className="overflow-x-auto rounded-lg border border-border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Referans / zaman</TableHead>
                      <TableHead>İşlem</TableHead>
                      <TableHead>Tutar</TableHead>
                      <TableHead>Durum</TableHead>
                      <TableHead>İncele</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {list.data?.data.map((row) => (
                      <TableRow
                        key={row.payment_ref}
                        className="cursor-pointer"
                        onClick={() => openDetail(row.payment_ref)}
                      >
                        <TableCell>
                          <span className="block max-w-64 break-all font-mono text-xs">{row.payment_ref}</span>
                          <span className="text-muted-foreground text-sm">
                            {formatIlanPurchaseDate(row.created_at)}
                          </span>
                        </TableCell>
                        <TableCell>
                          {kindLabel(row.kind)}
                          <span className="block text-muted-foreground text-sm">{providerLabel(row.provider)}</span>
                        </TableCell>
                        <TableCell>{formatIlanPurchaseMoney(row.amount)}</TableCell>
                        <TableCell>
                          {paymentStateLabels[row.state] ?? row.state}
                          {row.error_code && (
                            <span className="block max-w-56 break-words text-muted-foreground text-xs">
                              {row.error_code}
                            </span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Button variant="outline" onClick={() => openDetail(row.payment_ref)}>
                            Detay
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    {!list.data?.data.length && (
                      <TableRow>
                        <TableCell colSpan={5} className="py-10 text-center">
                          Bu filtrede ödeme kaydı yok.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
              <div className="flex items-center justify-between gap-3 text-sm">
                <span>
                  {list.data?.total} işlem · Sayfa {page}
                </span>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    disabled={page === 1 || list.isFetching}
                    onClick={() => setPage((current) => current - 1)}
                  >
                    Önceki
                  </Button>
                  <Button
                    variant="outline"
                    disabled={page * (list.data?.limit ?? 20) >= (list.data?.total ?? 0) || list.isFetching}
                    onClick={() => setPage((current) => current + 1)}
                  >
                    Sonraki
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
      <PaymentDetailDrawer reference={selected} open={detailOpen} onClose={() => setDetailOpen(false)} />
    </div>
  );
}
