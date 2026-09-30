const PREFIXOS_13 = ['978', '979'];

export function limparIsbn(entrada) {
  return String(entrada ?? '')
    .trim()
    .replace(/^isbn(-1[03])?:?/i, '')
    .replace(/[\s-]/g, '')
    .toUpperCase();
}

export function digitoIsbn10(nove) {
  let soma = 0;
  for (let i = 0; i < 9; i++) soma += (10 - i) * Number(nove[i]);
  const d = (11 - (soma % 11)) % 11;
  return d === 10 ? 'X' : String(d);
}

export function digitoIsbn13(doze) {
  let soma = 0;
  for (let i = 0; i < 12; i++) soma += Number(doze[i]) * (i % 2 === 0 ? 1 : 3);
  return String((10 - (soma % 10)) % 10);
}

export function isbn10Valido(entrada) {
  const s = limparIsbn(entrada);
  return /^\d{9}[\dX]$/.test(s) && digitoIsbn10(s) === s[9];
}

export function isbn13Valido(entrada) {
  const s = limparIsbn(entrada);
  return /^\d{13}$/.test(s)
    && PREFIXOS_13.includes(s.slice(0, 3))
    && digitoIsbn13(s) === s[12];
}

export function isbn10Para13(entrada) {
  const s = limparIsbn(entrada);
  if (!isbn10Valido(s)) throw new Error(`ISBN-10 inválido: ${entrada}`);
  const doze = '978' + s.slice(0, 9);
  return doze + digitoIsbn13(doze);
}

// Só ISBN-13 com prefixo 978 tem equivalente em ISBN-10.
export function isbn13Para10(entrada) {
  const s = limparIsbn(entrada);
  if (!isbn13Valido(s) || !s.startsWith('978')) return null;
  const nove = s.slice(3, 12);
  return nove + digitoIsbn10(nove);
}

/** Retorna o ISBN-13 normalizado, ou null se a entrada não for um ISBN válido. */
export function normalizarIsbn(entrada) {
  const s = limparIsbn(entrada);
  if (s.length === 13) return isbn13Valido(s) ? s : null;
  if (s.length === 10) return isbn10Valido(s) ? isbn10Para13(s) : null;
  return null;
}
