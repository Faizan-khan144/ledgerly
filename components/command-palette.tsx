"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import { useRouter } from "next/navigation";
import {
  ArrowUpRight,
  Download,
  FilePlus2,
  FileText,
  LayoutDashboard,
  Search,
  Settings,
  Users,
  type LucideIcon,
} from "lucide-react";

type Command = {
  id: string;
  label: string;
  hint: string;
  icon: LucideIcon;
  run: () => void;
};

export function CommandPalette() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);

  const commands = useMemo<Command[]>(
    () => [
      {
        id: "new-invoice",
        label: "Create a new invoice",
        hint: "N",
        icon: FilePlus2,
        run: () => router.push("/invoices/new"),
      },
      {
        id: "dashboard",
        label: "Go to overview",
        hint: "G D",
        icon: LayoutDashboard,
        run: () => router.push("/dashboard"),
      },
      {
        id: "invoices",
        label: "Go to invoices",
        hint: "G I",
        icon: FileText,
        run: () => router.push("/invoices"),
      },
      {
        id: "clients",
        label: "Go to clients",
        hint: "G C",
        icon: Users,
        run: () => router.push("/clients"),
      },
      {
        id: "settings",
        label: "Go to settings",
        hint: "G S",
        icon: Settings,
        run: () => router.push("/settings"),
      },
      {
        id: "export",
        label: "Export invoices as CSV",
        hint: "E",
        icon: Download,
        run: () => {
          window.location.href = "/api/export";
        },
      },
    ],
    [router],
  );

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return commands;
    return commands.filter((command) => command.label.toLowerCase().includes(term));
  }, [commands, query]);

  function close() {
    setOpen(false);
    setQuery("");
    setActive(0);
  }

  function openPalette() {
    setOpen(true);
    setQuery("");
    setActive(0);
  }

  function execute(command: Command | undefined) {
    if (!command) return;
    close();
    command.run();
  }

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen((current) => {
          if (current) {
            setQuery("");
            setActive(0);
            return false;
          }
          setQuery("");
          setActive(0);
          return true;
        });
        return;
      }

      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    if (!open) return;
    const timer = window.setTimeout(() => inputRef.current?.focus(), 20);
    document.body.style.overflow = "hidden";
    return () => {
      window.clearTimeout(timer);
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    setActive(0);
  }, [query]);

  function onInputKeyDown(event: ReactKeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActive((current) => (filtered.length ? (current + 1) % filtered.length : 0));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActive((current) =>
        filtered.length ? (current - 1 + filtered.length) % filtered.length : 0,
      );
    } else if (event.key === "Enter") {
      event.preventDefault();
      execute(filtered[active]);
    } else if (event.key === "Escape") {
      close();
    }
  }

  return (
    <>
      <button
        type="button"
        className="topbar-search"
        onClick={openPalette}
        aria-label="Open command palette"
        aria-haspopup="dialog"
      >
        <Search size={14} />
        <span className="topbar-search-label">Jump to…</span>
        <kbd>⌘K</kbd>
      </button>

      {open ? (
        <div
          className="command-backdrop modal-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) close();
          }}
        >
          <div
            className="command-panel modal-panel"
            role="dialog"
            aria-modal="true"
            aria-label="Command palette"
          >
            <div className="command-input-row">
              <Search size={16} className="text-[#928f84]" />
              <input
                ref={inputRef}
                className="command-input"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                onKeyDown={onInputKeyDown}
                placeholder="Jump to a page or run a command…"
                aria-label="Search commands"
              />
              <kbd>Esc</kbd>
            </div>

            <div className="command-list">
              {filtered.length ? (
                filtered.map((command, index) => {
                  const Icon = command.icon;
                  return (
                    <button
                      key={command.id}
                      type="button"
                      className="command-item"
                      data-active={index === active}
                      onMouseEnter={() => setActive(index)}
                      onClick={() => execute(command)}
                    >
                      <span className="command-item-icon">
                        <Icon size={14} />
                      </span>
                      <span>{command.label}</span>
                      <span className="command-hint">{command.hint}</span>
                    </button>
                  );
                })
              ) : (
                <p className="command-empty">No commands match “{query}”.</p>
              )}
            </div>

            <div className="command-footer">
              <span className="flex items-center gap-1.5">
                <kbd>↑</kbd>
                <kbd>↓</kbd>
                Navigate
              </span>
              <span className="flex items-center gap-1.5">
                <kbd>↵</kbd>
                Open
              </span>
              <span className="ml-auto flex items-center gap-1">
                <ArrowUpRight size={11} />
                Ledgerly command
              </span>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
