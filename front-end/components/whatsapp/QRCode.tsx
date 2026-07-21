// QR Code placeholder: gera um padrão determinístico a partir de um seed,
// com os três "finder patterns" nos cantos — visualmente idêntico a um QR real.
// Quando a API de WhatsApp estiver conectada, troque este componente pela
// imagem/base64 do QR retornado pela API (ex.: Evolution API / Baileys).

const N = 25; // módulos por lado

function hash(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function dentroFinder(r: number, c: number): boolean {
  const inBox = (r0: number, c0: number) =>
    r >= r0 && r < r0 + 7 && c >= c0 && c < c0 + 7;
  return inBox(0, 0) || inBox(0, N - 7) || inBox(N - 7, 0);
}

function moduloFinder(r: number, c: number, r0: number, c0: number): boolean {
  const dr = r - r0;
  const dc = c - c0;
  // borda externa 7x7 e quadrado interno 3x3
  const borda = dr === 0 || dr === 6 || dc === 0 || dc === 6;
  const centro = dr >= 2 && dr <= 4 && dc >= 2 && dc <= 4;
  return borda || centro;
}

export function QRCode({ seed }: { seed: string }) {
  const rand = mulberry32(hash(seed));
  const cells: boolean[][] = [];

  for (let r = 0; r < N; r++) {
    const row: boolean[] = [];
    for (let c = 0; c < N; c++) {
      if (dentroFinder(r, c)) {
        let on = false;
        if (r < 7 && c < 7) on = moduloFinder(r, c, 0, 0);
        else if (r < 7 && c >= N - 7) on = moduloFinder(r, c, 0, N - 7);
        else on = moduloFinder(r, c, N - 7, 0);
        row.push(on);
      } else {
        row.push(rand() > 0.5);
      }
    }
    cells.push(row);
  }

  const size = 100;
  const quiet = 4;
  const step = (size - quiet * 2) / N;

  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      className="h-full w-full"
      shapeRendering="crispEdges"
      role="img"
      aria-label="QR Code para conectar o WhatsApp"
    >
      <rect width={size} height={size} rx="6" fill="#ffffff" />
      {cells.map((row, r) =>
        row.map((on, c) =>
          on ? (
            <rect
              key={`${r}-${c}`}
              x={quiet + c * step}
              y={quiet + r * step}
              width={step + 0.4}
              height={step + 0.4}
              fill="#0b141a"
            />
          ) : null,
        ),
      )}
    </svg>
  );
}
