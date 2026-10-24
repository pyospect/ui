// shadcn removes the documentation header during installation. Older components
// carry pyospect tokens; components using shared shadcn roles carry an explicit
// source marker instead. Generic popover/accent classes alone prove no ownership.
export const isPyospect = (source) =>
  /\b(bg|text)-(surface(-[23])?|text(-[23])?|brand(-[\w-]+)?|skeleton|scrim)\b/.test(source) ||
  /\bdata-pyospect-component\s*=\s*["']select["']/.test(source)
