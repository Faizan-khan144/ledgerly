"use client";

import { Trash2 } from "lucide-react";
import { deleteClientAction } from "@/actions/clients";
import { SubmitButton } from "./submit-button";

export function DeleteClientButton({ id, company }: { id: string; company: string }) {
  return (
    <form
      action={deleteClientAction}
      onSubmit={(event) => {
        if (!window.confirm(`Remove ${company} from your workspace?`)) {
          event.preventDefault();
        }
      }}
    >
      <input type="hidden" name="id" value={id} />
      <SubmitButton className="btn btn-sm btn-danger" pendingLabel="Removing…">
        <Trash2 size={13} />
        Delete
      </SubmitButton>
    </form>
  );
}
