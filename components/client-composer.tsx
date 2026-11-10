"use client";

import { useActionState, useState } from "react";
import { Plus, X } from "lucide-react";
import { createClientAction, type ClientState } from "@/actions/clients";
import { SubmitButton } from "./submit-button";

const initialState: ClientState = {};

export function ClientComposer() {
  const [open, setOpen] = useState(false);
  const [state, action] = useActionState(createClientAction, initialState);

  return (
    <div>
      <button className="btn btn-primary" onClick={() => setOpen(true)}>
        <Plus size={15} />
        Add client
      </button>

      {open ? (
        <div className="modal-backdrop fixed inset-0 z-50 flex items-end justify-center bg-[#14140f]/35 p-0 backdrop-blur-[2px] sm:items-center sm:p-6">
          <div className="modal-panel max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-[26px] border border-[#dad6ca] bg-[#ffffff] p-6 shadow-2xl sm:rounded-[26px]">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="eyebrow">New relationship</p>
                <h2 className="serif mt-2 text-[30px] leading-tight">Add a client</h2>
                <p className="mt-1 text-[12px] text-[#6b6960]">
                  Just the essentials. You can refine the details later.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-full border border-[#dad6ca] p-2 text-[#6b6960] hover:bg-[#f6f4ed]"
                aria-label="Close"
              >
                <X size={15} />
              </button>
            </div>

            <form action={action} className="mt-6 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="label" htmlFor="client-name">
                    Contact name
                  </label>
                  <input id="client-name" name="name" className="input" placeholder="Ayesha Siddiqui" required />
                </div>
                <div>
                  <label className="label" htmlFor="client-company">
                    Company
                  </label>
                  <input id="client-company" name="company" className="input" placeholder="Northwind Trading" required />
                </div>
              </div>
              <div>
                <label className="label" htmlFor="client-email">
                  Email
                </label>
                <input id="client-email" name="email" type="email" className="input" placeholder="hello@company.com" />
              </div>
              <div>
                <label className="label" htmlFor="client-phone">
                  Phone
                </label>
                <input id="client-phone" name="phone" className="input" placeholder="+92 300 0000000" />
              </div>
              <div>
                <label className="label" htmlFor="client-address">
                  Address
                </label>
                <textarea id="client-address" name="address" className="textarea" placeholder="Street, city, country" />
              </div>

              {state.error ? (
                <p className="rounded-xl border border-[#e4c2bd] bg-[#f9e4e1] px-3 py-2 text-[12px] text-[#b3261e]">
                  {state.error}
                </p>
              ) : null}

              <div className="flex justify-end gap-2 pt-1">
                <button type="button" className="btn" onClick={() => setOpen(false)}>
                  Cancel
                </button>
                <SubmitButton className="btn btn-primary" pendingLabel="Adding…">
                  Add client
                </SubmitButton>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
}
