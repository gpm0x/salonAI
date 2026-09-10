import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Manrope } from "next/font/google";
import { TemaProvider } from "@/components/shared/TemaProvider";
import { QueryProvider } from "@/components/providers/query-provider";
import { SCRIPT_ANTI_FLASH } from "@/lib/utils/tema";
import "./globals.css";

// Display: grotesca variável de largura apertada e contornos cortados —
// títulos e números de painel com presença, sem virar fonte de pôster.
const display = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["500", "600", "700", "800"],
  display: "swap",
});

// Texto: geométrica de aberturas amplas, ótima em 12–14px e com
// algarismos tabulares — o corpo denso do dashboard depende disso.
const sans = Manrope({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Salon AI — Gestão de Salões",
  description:
    "Plataforma de gestão para salões de beleza e barbearias: agenda, financeiro e inteligência de negócio.",
};

/*
  Escala real no celular: sem `maximumScale`/`userScalable: false`, para que
  quem precisa ampliar continue conseguindo. `viewportFit: "cover"` libera as
  variáveis `env(safe-area-inset-*)` usadas no layout — sem ele o entalhe e a
  barra de gestos do iOS comem conteúdo.
*/
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F5F5F0" },
    { media: "(prefers-color-scheme: dark)", color: "#12121F" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="pt-BR"
      className={`${display.variable} ${sans.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* Aplica o tema antes da primeira pintura — sem flash de tela clara */}
        <script dangerouslySetInnerHTML={{ __html: SCRIPT_ANTI_FLASH }} />
      </head>
      <body className="relative">
        <TemaProvider>
          <QueryProvider>{children}</QueryProvider>
        </TemaProvider>
      </body>
    </html>
  );
}
