import { Plus } from "lucide-react";

const questions = [
  {
    q: "Is this a real full-stack app?",
    a: "Yes. It uses Next.js server components and server actions, a SQLite database, signed HTTP-only sessions, salted password hashes, and server-side validation. The interface is responsive and print-ready.",
  },
  {
    q: "How does the workspace start?",
    a: "Create an account and Ledgerly gives you a starter client, a draft invoice, and a clean dashboard. Add your studio details in settings and the invoice document updates instantly.",
  },
  {
    q: "Where does the data live?",
    a: "Locally the app writes to a SQLite file on disk. On the hosted demo it writes to a temporary serverless SQLite file, so it behaves like a real workspace for the lifetime of the deployment.",
  },
  {
    q: "Can I print or save an invoice?",
    a: "Every invoice has a dedicated print layout. Use Print / PDF on the detail page; the sidebar, actions, and app chrome disappear so only the document remains.",
  },
  {
    q: "What happens when an invoice is overdue?",
    a: "Overdue is a first-class status. The dashboard surfaces overdue invoices, and the invoice detail page keeps a clear status trail from draft to sent to paid.",
  },
  {
    q: "Is there a dark mode?",
    a: "No — the product is deliberately light. A calm, high-contrast paper palette is part of the design brief, not an afterthought.",
  },
];

export function Faq() {
  return (
    <div className="mx-auto mt-9 max-w-3xl space-y-2.5">
      {questions.map((item) => (
        <details key={item.q} className="faq-item">
          <summary>
            <span>{item.q}</span>
            <span className="faq-plus">
              <Plus size={14} />
            </span>
          </summary>
          <p>{item.a}</p>
        </details>
      ))}
    </div>
  );
}
