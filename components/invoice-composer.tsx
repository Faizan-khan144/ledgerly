"use client";

import { useActionState, useMemo, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { createInvoiceAction, type InvoiceState } from "@/actions/invoices";
import { formatMoney, parseMoneyToCents } from "@/lib/money";
import { SubmitButton } from "./submit-button";

type ClientOption = { id: string; name: string; company: string };
type DraftItem = { key: string; description: string; quantity: number; unitPrice: string };

const initialState: InvoiceState = {};

export function InvoiceComposer({
  clients,
  number,
  today,
  dueDate,
  defaultClientId,
}: {
  clients: ClientOption[];
  number: string;
  today: string;
  dueDate: string;
  defaultClientId?: string;
}) {
  const [state, action] = useActionState(createInvoiceAction, initialState);
  const [items, setItems] = useState<DraftItem[]>([
    { key: crypto.randomUUID(), description: "", quantity: 1, unitPrice: "" },
  ]);
  const [taxRate, setTaxRate] = useState("0");

  const totals = useMemo(() => {
    const subtotal = items.reduce(
      (sum, item) => sum + item.quantity * parseMoneyToCents(item.unitPrice),
      0,
    );
    const tax = Math.round(subtotal * (Number(taxRate) / 100 || 0));
    return { subtotal, tax, total: subtotal + tax };
  }, [items, taxRate]);

  const payload = JSON.stringify(
    items.map((item) => ({
      description: item.description,
      quantity: item.quantity,
      unitPriceCents: parseMoneyToCents(item.unitPrice),
    })),
  );

  function updateItem(key: string, patch: Partial<DraftItem>) {
    setItems((current) => current.map((item) => (item.key === key ? { ...item, ...patch } : item)));
  }

  function addItem() {
    setItems((current) => [
      ...current,
      { key: crypto.randomUUID(), description: "", quantity: 1, unitPrice: "" },
    ]);
  }

  function removeItem(key: string) {
    setItems((current) => (current.length === 1 ? current : current.filter((item) => item.key !== key)));
  }

  return (
    <form action={action} className="grid gap-4 xl:grid-cols-[1.45fr_0.75fr]">
      <input type="hidden" name="items" value={payload} />

      <div className="space-y-4">
        <div className="card card-pad">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="eyebrow">Invoice details</p>
              <h2 className="serif mt-2 text-[26px]">The essentials</h2>
            </div>
            <span className="rounded-full bg-[#efebe2] px-3 py-1 text-[11px] font-bold tracking-[0.04em] text-[#6b6960]">
              {number}
            </span>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="label" htmlFor="clientId">
                Client
              </label>
              <select
                id="clientId"
                name="clientId"
                className="select"
                defaultValue={defaultClientId ?? ""}
                required
              >
                <option value="">Choose a client…</option>
                {clients.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.company} — {client.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="label" htmlFor="issueDate">
                Issue date
              </label>
              <input id="issueDate" name="issueDate" type="date" className="input" defaultValue={today} required />
            </div>
            <div>
              <label className="label" htmlFor="dueDate">
                Due date
              </label>
              <input id="dueDate" name="dueDate" type="date" className="input" defaultValue={dueDate} required />
            </div>
          </div>
        </div>

        <div className="card card-pad">
          <div className="flex items-center justify-between">
            <div>
              <p className="eyebrow">Line items</p>
              <h2 className="serif mt-2 text-[26px]">What is this for?</h2>
            </div>
            <button type="button" onClick={addItem} className="btn btn-sm">
              <Plus size={13} />
              Add item
            </button>
          </div>

          <div className="mt-5 space-y-3">
            {items.map((item, index) => (
              <div key={item.key} className="rounded-2xl border border-[#dad6ca] bg-[#fbfaf5] p-3">
                <div className="flex items-center justify-between">
                  <span className="text-[9.5px] font-bold uppercase tracking-[0.12em] text-[#928f84]">
                    Item {String(index + 1).padStart(2, "0")}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeItem(item.key)}
                    disabled={items.length === 1}
                    className="rounded-lg p-1.5 text-[#928f84] transition hover:bg-[#f9e4e1] hover:text-[#b3261e] disabled:opacity-30"
                    aria-label={`Remove item ${index + 1}`}
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
                <div className="mt-2 grid gap-2 sm:grid-cols-[1fr_78px_112px]">
                  <input
                    className="input"
                    placeholder="Description, e.g. Brand identity sprint"
                    value={item.description}
                    onChange={(event) => updateItem(item.key, { description: event.target.value })}
                    required
                  />
                  <input
                    className="input"
                    type="number"
                    min={1}
                    step={1}
                    aria-label="Quantity"
                    value={item.quantity}
                    onChange={(event) =>
                      updateItem(item.key, { quantity: Math.max(1, Number(event.target.value)) })
                    }
                    required
                  />
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[12px] text-[#928f84]">
                      $
                    </span>
                    <input
                      className="input pl-6"
                      inputMode="decimal"
                      placeholder="0.00"
                      aria-label="Unit price"
                      value={item.unitPrice}
                      onChange={(event) => updateItem(item.key, { unitPrice: event.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="mt-2 flex justify-end text-[10.5px] text-[#6b6960]">
                  Line total:{" "}
                  <span className="ml-1 font-semibold text-[#3a3931]">
                    {formatMoney(item.quantity * parseMoneyToCents(item.unitPrice))}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card card-pad">
          <label className="label" htmlFor="notes">
            Notes for the client
          </label>
          <textarea
            id="notes"
            name="notes"
            className="textarea"
            placeholder="Payment terms, a thank-you note, or a short project recap…"
          />
        </div>
      </div>

      <aside className="space-y-4">
        <div className="card card-pad xl:sticky xl:top-8">
          <p className="eyebrow">Summary</p>
          <h2 className="serif mt-2 text-[26px]">The numbers</h2>

          <div className="mt-5 space-y-3 text-[12.5px]">
            <div className="flex items-center justify-between text-[#6b6960]">
              <span>Subtotal</span>
              <span className="font-medium text-[#14140f]">{formatMoney(totals.subtotal)}</span>
            </div>
            <div className="flex items-center justify-between gap-3 text-[#6b6960]">
              <label htmlFor="taxRate" className="flex items-center gap-2">
                Tax
                <input
                  id="taxRate"
                  name="taxRate"
                  type="number"
                  min={0}
                  max={100}
                  step={0.1}
                  value={taxRate}
                  onChange={(event) => setTaxRate(event.target.value)}
                  className="w-16 rounded-lg border border-[#dad6ca] bg-white px-2 py-1 text-right text-[12px] outline-none"
                />
                %
              </label>
              <span className="font-medium text-[#14140f]">{formatMoney(totals.tax)}</span>
            </div>
            <div className="divider my-3" />
            <div className="flex items-end justify-between">
              <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#6b6960]">
                Total
              </span>
              <span className="serif text-[30px] leading-none">{formatMoney(totals.total)}</span>
            </div>
          </div>

          {state.error ? (
            <p className="mt-4 rounded-xl border border-[#e4c2bd] bg-[#f9e4e1] px-3 py-2 text-[12px] leading-5 text-[#b3261e]">
              {state.error}
            </p>
          ) : null}

          <SubmitButton className="btn btn-primary mt-5 w-full" pendingLabel="Creating invoice…">
            Create draft invoice
          </SubmitButton>
          <p className="mt-3 text-center text-[10.5px] leading-5 text-[#928f84]">
            Saved as a draft. Nothing is emailed until you mark it as sent.
          </p>
        </div>

        <div className="rounded-2xl border border-[#d9d4c7] bg-[#f9e5db] p-4">
          <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#d8451b]">
            Good to know
          </p>
          <p className="mt-2 text-[11.5px] leading-5 text-[#d8451b]">
            Ledgerly calculates tax on the subtotal and stores every amount in cents, so
            totals never drift.
          </p>
        </div>
      </aside>
    </form>
  );
}
