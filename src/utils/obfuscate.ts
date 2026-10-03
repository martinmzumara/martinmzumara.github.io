// ============================================================================
// Contact-detail obfuscation.
//
// `ent()` converts a string to numeric HTML character references. Browsers
// decode entities in both text and attribute values, so the rendered result is
// byte-identical for visitors - but the served HTML contains no plain e-mail
// address or phone number, which defeats naive address-harvesting scrapers.
//
// NOTE: the built markup must be injected with `set:html` (Astro preserves it
// verbatim). Writing entities directly in a template, or via a normal
// expression, gets normalised/escaped back to plain text by the compiler -
// verified with a build probe during the domain migration.
// ============================================================================

/** "a@b" -> "&#97;&#64;&#98;" */
export function ent(value: string): string {
  return Array.from(value)
    .map((ch) => `&#${ch.codePointAt(0)};`)
    .join('');
}

/**
 * Options for {@link emailLink}.
 *
 * The href and the visible text are both derived from the same `email`
 * argument, so `showAddress: false` only drops the trailing visible copy -
 * the entity-encoded `mailto:` (and therefore the decode path) is untouched.
 */
export interface EmailLinkOptions {
  /** Append the entity-encoded address after `extraInnerHtml` (default true). */
  showAddress?: boolean;
}

/** Anchor markup for an e-mail address, entity-encoded end to end. */
export function emailLink(
  email: string,
  className?: string,
  extraInnerHtml = '',
  options: EmailLinkOptions = {}
): string {
  const cls = className ? ` class="${className}"` : '';
  const visible = options.showAddress === false ? '' : ent(email);
  return `<a${cls} href="${ent(`mailto:${email}`)}">${extraInnerHtml}${visible}</a>`;
}

/** Anchor markup for a phone number, entity-encoded end to end. */
export function phoneLink(display: string, e164: string): string {
  return `<a href="${ent(`tel:${e164}`)}">${ent(display)}</a>`;
}
