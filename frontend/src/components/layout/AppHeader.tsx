import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { LogIn, LogOut, Menu, X } from "lucide-react";
import logoTjrr from "@/assets/logo_tjrr_white.png";
import { HEADER, NAV_PAINEL } from "@/lib/header";
import { useAuth } from "@/lib/auth";
import { cn } from "@/lib/utils";

export function AppHeader() {
  const [menuAberto, setMenuAberto] = useState(false);
  const { podeAcessarPainel, usuario, sair } = useAuth();
  const nav = podeAcessarPainel ? [...HEADER.nav, NAV_PAINEL] : HEADER.nav;

  return (
    <header className="sticky top-0 z-40 overflow-hidden bg-ink print:hidden [&_:is(a,button):focus-visible]:outline-none [&_:is(a,button):focus-visible]:ring-2 [&_:is(a,button):focus-visible]:ring-lavrado">
      <div className="mx-auto flex min-h-16 max-w-7xl items-center justify-between gap-3 px-4 py-2 sm:min-h-20 sm:gap-4 sm:px-6">
        <Link
          to="/"
          className="flex min-w-0 flex-1 items-center gap-3"
          onClick={() => setMenuAberto(false)}
        >
          {/* Logo completa (símbolo + "Poder Judiciário do Estado de
              Roraima"), como no tjrr-certidoes-web: largura fixa e altura
              automática — o header cresce pra acompanhar. */}
          <img
            src={logoTjrr}
            alt=""
            aria-hidden
            className="h-auto w-24 shrink-0 object-contain sm:w-28"
          />

          {/* Abaixo de sm não cabe o título completo em uma linha — usa a
              marca curta pra não quebrar e estourar a altura do header. */}
          <span className="min-w-0 truncate text-[13px] font-semibold tracking-[0.06em] text-paper uppercase lg:hidden">
            {HEADER.marcaCurta}
          </span>
          <span className="hidden min-w-0 text-left leading-tight lg:block">
            <span className="block truncate text-xs font-semibold tracking-[0.06em] text-paper uppercase">
              {HEADER.marcaLinha1}
            </span>
            <span className="mt-0.5 block truncate text-[11px] tracking-[0.03em] text-paper/55 uppercase">
              {HEADER.marcaLinha2}
            </span>
          </span>
          <span className="sr-only">{HEADER.logoAlt}</span>
        </Link>

        <nav
          className="hidden items-center gap-1 lg:flex"
          aria-label="Principal"
        >
          {nav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) =>
                cn(
                  "rounded-full px-3.5 py-1.5 text-xs font-medium tracking-wide text-paper/80 uppercase transition hover:bg-paper/10 hover:text-paper",
                  isActive && "bg-lavrado text-ink hover:bg-lavrado",
                )
              }
            >
              {item.label}
            </NavLink>
          ))}
          {usuario ? (
            <button
              type="button"
              onClick={sair}
              title={`Sair (${usuario.nome})`}
              className="ml-1 inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium tracking-wide text-paper/80 uppercase transition hover:bg-paper/10 hover:text-paper"
            >
              <LogOut className="size-3.5" aria-hidden />
              Sair
            </button>
          ) : (
            <Link
              to="/acesso-interno"
              className="ml-1 inline-flex items-center gap-1.5 rounded-full border border-paper/30 px-3.5 py-1.5 text-xs font-medium tracking-wide text-paper/80 uppercase transition hover:bg-paper/10 hover:text-paper"
            >
              <LogIn className="size-3.5" aria-hidden />
              Entrar
            </Link>
          )}
        </nav>

        <button
          type="button"
          className="inline-flex size-10 items-center justify-center rounded-md text-paper transition hover:bg-paper/10 lg:hidden"
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
          className="border-t border-paper/15 px-4 py-3 lg:hidden"
          aria-label="Mobile"
        >
          <ul className="flex flex-col gap-1">
            {nav.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end={item.to === "/"}
                  onClick={() => setMenuAberto(false)}
                  className={({ isActive }) =>
                    cn(
                      "block rounded-md px-3 py-2.5 text-xs font-medium tracking-wide text-paper/80 uppercase hover:bg-paper/10",
                      isActive && "bg-lavrado text-ink",
                    )
                  }
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
            {usuario ? (
              <li>
                <button
                  type="button"
                  onClick={sair}
                  className="flex w-full items-center gap-2 rounded-md px-3 py-2.5 text-left text-xs font-medium tracking-wide text-paper/80 uppercase hover:bg-paper/10"
                >
                  <LogOut className="size-4" aria-hidden />
                  Sair ({usuario.nome})
                </button>
              </li>
            ) : (
              <li>
                <Link
                  to="/acesso-interno"
                  onClick={() => setMenuAberto(false)}
                  className="flex w-full items-center gap-2 rounded-md px-3 py-2.5 text-xs font-medium tracking-wide text-paper/80 uppercase hover:bg-paper/10"
                >
                  <LogIn className="size-4" aria-hidden />
                  Entrar
                </Link>
              </li>
            )}
          </ul>
        </nav>
      )}
    </header>
  );
}
