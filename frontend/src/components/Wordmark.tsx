// Marka kelime isareti: ad NEXT_PUBLIC_APP_NAME'den gelir, ikinci parca vurgu rengiyle cizilir.
import type { CSSProperties } from "react";
import { splitWordmark } from "@/lib/app-name";

export function Wordmark({ accentClassName, accentStyle }: { accentClassName?: string; accentStyle?: CSSProperties }) {
  const [head, tail] = splitWordmark();
  if (!head) return null;
  return <>{head}{tail ? <span className={accentClassName} style={accentStyle}>{tail}</span> : null}</>;
}
