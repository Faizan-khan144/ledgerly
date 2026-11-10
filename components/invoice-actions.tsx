"use client";

import { Copy, Printer, Trash2 } from "lucide-react";
import type { InvoiceStatus } from "@/lib/db";
import {
  deleteInvoiceAction,
  duplicateInvoiceAction,
  setInvoiceStatusAction,
} from "@/actions/invoices";
import { SubmitButton } from "./submit-button";

export function PrintButton() {
  return (
    <button className="btn btn-sm" onClick={() => window.print()}>
      <Printer size={13} />
      Print / PDF
    </button>
  );
}

export function InvoiceActions({ id, status }: { id: string; status: InvoiceStatus }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {status === "draft" ? (
        <form action={setInvoiceStatusAction}>
          <input type="hidden" name="id" value={id} />
          <input type="hidden" name="status" value="sent" />
          <SubmitButton className="btn btn-sm btn-primary" pendingLabel="Sending…">
            Mark as sent
          </SubmitButton>
        </form>
      ) : null}

      {status !== "paid" ? (
        <form action={setInvoiceStatusAction}>
          <input type="hidden" name="id" value={id} />
          <input type="hidden" name="status" value="paid" />
          <SubmitButton className="btn btn-sm btn-accent" pendingLabel="Updating…">
            Mark as paid
          </SubmitButton>
        </form>
      ) : (
        <span className="rounded-full bg-[#f9e5db] px-3 py-1.5 text-[11px] font-semibold text-[#d8451b]">
          Payment received
        </span>
      )}

      <form action={duplicateInvoiceAction}>
        <input type="hidden" name="id" value={id} />
        <SubmitButton className="btn btn-sm" pendingLabel="Copying…">
          <Copy size={13} />
          Duplicate
        </SubmitButton>
      </form>

      <form
        action={deleteInvoiceAction}
        onSubmit={(event) => {
          if (!window.confirm("Delete this invoice permanently? This cannot be undone.")) {
            event.preventDefault();
          }
        }}
      >
        <input type="hidden" name="id" value={id} />
        <SubmitButton className="btn btn-sm btn-danger" pendingLabel="Deleting…">
          <Trash2 size={13} />
          Delete
        </SubmitButton>
      </form>
    </div>
  );
}
