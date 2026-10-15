function loadStrings(languageCode: string) {
  let strings: typeof import('../src/i18n').t | undefined;
  jest.isolateModules(() => {
    jest.doMock('expo-localization', () => ({ getLocales: () => [{ languageCode }] }));
    strings = require('../src/i18n').t;
  });
  return strings!;
}

// Lists every key path plus the length of each array, so missing tips or strings show up.
function shape(value: unknown, path = ''): string[] {
  if (Array.isArray(value)) return [`${path}[${value.length}]`];
  if (value && typeof value === 'object') {
    return Object.entries(value).flatMap(([key, v]) => shape(v, `${path}.${key}`));
  }
  return [path];
}

const es = loadStrings('es');
const en = loadStrings('en');

test('picks Spanish for Spanish devices and English otherwise', () => {
  expect(es.title).toBe('Limpiar altavoz');
  expect(en.title).toBe('Speaker Cleaner');
  expect(loadStrings('fr').title).toBe('Speaker Cleaner');
});

test('Spanish and English have the same strings', () => {
  expect(shape(es)).toEqual(shape(en));
});

test('no string is empty', () => {
  for (const strings of [es, en]) {
    const all = JSON.stringify(strings);
    expect(all).not.toMatch(/""/);
  }
});

test('copy avoids Apple trademarks (App Review 5.2.5)', () => {
  for (const strings of [es, en]) {
    const all = JSON.stringify(strings);
    expect(all).not.toMatch(/Apple|iPhone|Watch/);
  }
});
