// src/db/seed/utils.ts

// Yorumları temizle + güvenli split
export function cleanSql(input: string): string {
  // -- satır sonuna kadar ve /* ... */ blok yorumlarını temizle
  return input
    .replace(/--.*?(\r?\n|$)/g, '$1')
    .replace(/\/\*[\s\S]*?\*\//g, '');
}

export function splitStatements(sql: string): string[] {
  const statements: string[] = [];
  let current = '';
  let quote: "'" | '"' | '`' | null = null;

  for (let i = 0; i < sql.length; i += 1) {
    const ch = sql[i];
    const next = sql[i + 1];
    current += ch;

    if (quote) {
      if (ch === '\\') {
        if (next) {
          current += next;
          i += 1;
        }
        continue;
      }
      if (ch === quote) {
        if (quote === "'" && next === "'") {
          current += next;
          i += 1;
          continue;
        }
        quote = null;
      }
      continue;
    }

    if (ch === "'" || ch === '"' || ch === '`') {
      quote = ch;
      continue;
    }

    if (ch === ';') {
      const statement = current.trim();
      if (statement) statements.push(statement);
      current = '';
    }
  }

  const tail = current.trim();
  if (tail) statements.push(tail.endsWith(';') ? tail : `${tail};`);
  return statements;
}

export function logStep(msg: string) {
  const ts = new Date().toISOString().replace('T',' ').replace('Z','');
  console.log(`[${ts}] ${msg}`);
}
