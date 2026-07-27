import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, X } from "lucide-react";
import logoTjrr from "@/assets/logo_tjrr_white.png";
import { HEADER } from "@/lib/header";
import { cn } from "@/lib/utils";

export function AppHeader() {
  const [menuAberto, setMenuAberto] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-orange-500">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:h-[4.5rem] sm:px-6">
        <Link
          to="/"
          className="flex min-w-0 items-center gap-3"
          onClick={() => setMenuAberto(false)}
        >
          {/* Quadrado: só o símbolo (topo do PNG) */}
          <span className="flex size-12 shrink-0 items-start justify-center overflow-hidden sm:size-14">
            <img
              src={logoTjrr}
              alt=""
              aria-hidden
              className="h-15 w-auto shrink-0 max-w-none object-cover object-top"
            />
          </span>

          {/* Título ao lado do símbolo */}
          <span className="min-w-0 text-left text-xs font-semibold leading-tight tracking-wide text-white uppercase sm:text-sm">
            <span className="block">{HEADER.marcaLinha1}</span>
            <span className="block font-medium">{HEADER.marcaLinha2}</span>
          </span>
          <span className="sr-only">{HEADER.logoAlt}</span>
        </Link>

        <nav
          className="hidden items-center gap-1 md:flex"
          aria-label="Principal"
        >
          {HEADER.nav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) =>
                cn(
                  "rounded-md px-3 py-2 text-sm font-medium text-white/90 transition hover:bg-black/10 hover:text-white",
                  isActive && "bg-black/15 text-white"
                )
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <button
          type="button"
          className="inline-flex size-10 items-center justify-center rounded-md text-white transition hover:bg-black/10 md:hidden"
          aria-expanded={menuAberto}
          aria-controls="menu-mobile"
          aria-label={menuAberto ? "Fechar menu" : "Abrir menu"}
          onClick={() => setMenuAberto((v) => !v)}
        >
          {menuAberto ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </div>

      {menuAberto && (
        <nav
          id="menu-mobile"
          className="border-t border-white/20 px-4 py-3 md:hidden"
          aria-label="Mobile"
        >
          <ul className="flex flex-col gap-1">
            {HEADER.nav.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end={item.to === "/"}
                  onClick={() => setMenuAberto(false)}
                  className={({ isActive }) =>
                    cn(
                      "block rounded-md px-3 py-2.5 text-sm font-medium text-white/90 hover:bg-black/10",
                      isActive && "bg-black/15 text-white"
                    )
                  }
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
