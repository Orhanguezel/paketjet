import { AddressAutocomplete } from "@paketjet/locations";
import { Car, Truck, Bike, Package, BusFront, LockKeyhole } from "lucide-react";
import { Input } from "@/components/ui/Input";
import type { CreateIlanInput } from "../../ilan.type";
import { vehicleLabels } from "../../ilan-wizard";
type Props = { form: CreateIlanInput; setForm: React.Dispatch<React.SetStateAction<CreateIlanInput>> };
export function RouteFields({
  form,
  setForm,
  departure,
  arrival,
  setDeparture,
  setArrival,
}: Props & { departure: string; arrival: string; setDeparture: (v: string) => void; setArrival: (v: string) => void }) {
  return (
    <div className="listing-field-grid">
      {(["from", "to"] as const).map((prefix) => (
        <AddressAutocomplete
          key={prefix}
          label={prefix === "from" ? "Nereden" : "Nereye"}
          required
          value={form[`${prefix}_location`]?.label ?? form[`${prefix}_city`]}
          location={form[`${prefix}_location`]}
          onChange={(value, place) =>
            setForm((f) => ({
              ...f,
              [`${prefix}_city`]: place?.city || value.slice(0, 128),
              [`${prefix}_district`]: place?.district || "",
              [`${prefix}_location`]: place ?? (value ? { label: value } : null),
            }))
          }
        />
      ))}
      <Input
        label="Hareket tarihi ve saati"
        type="datetime-local"
        required
        value={departure}
        onChange={(e) => setDeparture(e.target.value)}
        hint="Türkiye saati (UTC+3)"
      />
      <Input label="Varış tarihi ve saati (isteğe bağlı)" type="datetime-local" value={arrival} onChange={(e) => setArrival(e.target.value)} />
    </div>
  );
}
const vehicleIcons = { car: Car, van: BusFront, truck: Truck, motorcycle: Bike, other: Package };
export function DetailFields({ form, setForm }: Props) {
  return (
    <div className="space-y-6">
      <fieldset>
        <legend className="mb-3 text-sm font-medium">Araç tipi</legend>
        <div className="listing-vehicles">
          {Object.entries(vehicleLabels).map(([key, label]) => {
            const type = key as keyof typeof vehicleLabels,
              Icon = vehicleIcons[type];
            return (
              <label key={key} className="listing-vehicle">
                <input
                  type="radio"
                  name="vehicle"
                  value={key}
                  checked={form.vehicle_type === key}
                  onChange={() => setForm((f) => ({ ...f, vehicle_type: type }))}
                />
                <span>
                  <Icon size={25} />
                  {label}
                </span>
              </label>
            );
          })}
        </div>
      </fieldset>
      <Input
        label="İlan başlığı (isteğe bağlı)"
        maxLength={255}
        value={form.title}
        onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
        placeholder="Örn. İstanbul’dan Ankara’ya gidiyorum"
      />
      <div>
        <label htmlFor="listing-description" className="text-sm font-medium">
          Açıklama (isteğe bağlı)
        </label>
        <textarea
          id="listing-description"
          rows={5}
          maxLength={4000}
          value={form.description}
          onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
          className="listing-textarea"
          placeholder="Aracındaki boş alanı ve güzergâhınla ilgili ayrıntıları yaz."
        />
        <p className="mt-2 text-sm leading-6 text-muted">Telefon ve e-postanı açıklamaya yazma; bir sonraki adımda özel iletişim alanına ekle.</p>
      </div>
    </div>
  );
}
export function ContactFields({ form, setForm }: Props) {
  return (
    <div className="space-y-6">
      <div className="listing-field-grid">
        <Input
          label="Ad soyad"
          required
          maxLength={160}
          autoComplete="name"
          value={form.contact_name}
          onChange={(e) => setForm((f) => ({ ...f, contact_name: e.target.value }))}
        />
        <Input
          label="Telefon"
          required
          type="tel"
          maxLength={25}
          autoComplete="tel"
          value={form.contact_phone}
          onChange={(e) => setForm((f) => ({ ...f, contact_phone: e.target.value }))}
        />
        <div className="sm:col-span-2">
          <Input
            label="E-posta (isteğe bağlı)"
            type="email"
            maxLength={255}
            autoComplete="email"
            value={form.contact_email ?? ""}
            onChange={(e) => setForm((f) => ({ ...f, contact_email: e.target.value }))}
          />
        </div>
        <div className="sm:col-span-2">
          <AddressAutocomplete
            label="İletişim adresi (isteğe bağlı)"
            maxLength={1000}
            value={form.contact_address ?? ""}
            onChange={(value) => setForm((f) => ({ ...f, contact_address: value }))}
          />
        </div>
      </div>
      <p className="listing-notice">
        <LockKeyhole size={19} />
        <span>İletişim bilgilerin yalnız ilanını satın alan kişiye açılır.</span>
      </p>
    </div>
  );
}
