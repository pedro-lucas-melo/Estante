// Uso: node scripts/testar-apis.mjs [isbn] [--completo]
// Consulta as fontes de metadados e mostra o que cada uma devolve.
import { normalizarIsbn } from '../js/isbn.js';

const args = process.argv.slice(2);
const completo = args.includes('--completo');
const entrada = args.find((a) => !a.startsWith('--')) ?? '9788537810651';
const isbn = normalizarIsbn(entrada);
if (!isbn) {
  console.error(`ISBN inválido: ${entrada}`);
  process.exit(1);
}

const fontes = [
  { nome: 'BrasilAPI', url: `https://brasilapi.com.br/api/isbn/v1/${isbn}` },
  { nome: 'Google Books', url: `https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}` },
  {
    nome: 'Open Library',
    url: `https://openlibrary.org/api/books?bibkeys=ISBN:${isbn}&format=json&jscmd=data`,
  },
];

async function consultar({ nome, url }) {
  console.log(`\n=== ${nome}\n${url}`);
  const inicio = Date.now();
  try {
    const resp = await fetch(url, { signal: AbortSignal.timeout(15000) });
    const texto = await resp.text();
    console.log(`HTTP ${resp.status} em ${Date.now() - inicio} ms`);
    let json;
    try {
      json = JSON.parse(texto);
    } catch {
      console.log('Resposta não é JSON:', texto.slice(0, 300));
      return;
    }
    const saida = JSON.stringify(json, null, 2);
    console.log(completo || saida.length <= 4000 ? saida : saida.slice(0, 4000) + '\n… (use --completo)');
  } catch (err) {
    console.log(`Falhou: ${err.name}: ${err.message}`);
  }
}

async function testarCapa() {
  const url = `https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg?default=false`;
  console.log(`\n=== Capa Open Library\n${url}`);
  try {
    const resp = await fetch(url, { method: 'HEAD', redirect: 'follow', signal: AbortSignal.timeout(15000) });
    console.log(`HTTP ${resp.status} ${resp.headers.get('content-type') ?? ''} (final: ${resp.url})`);
  } catch (err) {
    console.log(`Falhou: ${err.name}: ${err.message}`);
  }
}

console.log(`ISBN normalizado: ${isbn}`);
for (const fonte of fontes) await consultar(fonte);
await testarCapa();
