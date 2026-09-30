import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  limparIsbn, isbn10Valido, isbn13Valido,
  isbn10Para13, isbn13Para10, normalizarIsbn,
} from '../js/isbn.js';

test('limparIsbn remove hífens, espaços e prefixo', () => {
  assert.equal(limparIsbn('978-85-378-1065-1'), '9788537810651');
  assert.equal(limparIsbn(' 85 378 1065 x '), '853781065X');
  assert.equal(limparIsbn('ISBN-13: 978-0-306-40615-7'), '9780306406157');
  assert.equal(limparIsbn(null), '');
});

test('isbn13Valido', () => {
  assert.ok(isbn13Valido('9788537810651'));
  assert.ok(isbn13Valido('978-0-306-40615-7'));
  assert.ok(isbn13Valido('9791032305690'));
  assert.ok(!isbn13Valido('9788537810652'), 'dígito errado');
  assert.ok(!isbn13Valido('4006381333931'), 'EAN válido, mas não é livro');
  assert.ok(!isbn13Valido('978853781065'), 'curto');
  assert.ok(!isbn13Valido('978853781065A'));
});

test('isbn10Valido, inclusive com X', () => {
  assert.ok(isbn10Valido('0306406152'));
  assert.ok(isbn10Valido('0-8044-2957-X'));
  assert.ok(isbn10Valido('0-8044-2957-x'));
  assert.ok(!isbn10Valido('0306406153'));
  assert.ok(!isbn10Valido('X306406152'), 'X só na última posição');
});

test('isbn10Para13', () => {
  assert.equal(isbn10Para13('0-306-40615-2'), '9780306406157');
  assert.equal(isbn10Para13('080442957X'), '9780804429573');
  assert.equal(isbn10Para13('8537810657'), '9788537810651');
  assert.throws(() => isbn10Para13('0306406153'));
});

test('isbn13Para10', () => {
  assert.equal(isbn13Para10('9780306406157'), '0306406152');
  assert.equal(isbn13Para10('9780804429573'), '080442957X');
  assert.equal(isbn13Para10('9791032305690'), null);
});

test('normalizarIsbn aceita 10 ou 13 e devolve sempre 13', () => {
  assert.equal(normalizarIsbn('85-378-1065-7'), '9788537810651');
  assert.equal(normalizarIsbn('978-85-378-1065-1'), '9788537810651');
  assert.equal(normalizarIsbn('9788537810652'), null);
  assert.equal(normalizarIsbn('123'), null);
  assert.equal(normalizarIsbn(''), null);
  assert.equal(normalizarIsbn(undefined), null);
});
