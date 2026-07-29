---
name: style-review
description: Review changed CSS/Astro/HTML files for specificity conflicts, scroll-snap interactions, responsive breakpoint coverage, and dead/duplicate rules. Use proactively after a batch of styling edits, or before declaring a visual task complete. Use this skill whenever the user invokes /style-review or asks for a "style review", "CSS review", or "responsiveness check".
---

# Style Review

This skill performs a focused audit of recent styling changes in this Astro + Tailwind portfolio. It is meant to catch the recurring friction patterns surfaced in past sessions:

- CSS rules that silently don't apply due to specificity
- Custom animations that conflict with `scroll-snap` / Lenis smooth scroll
- Missing or weak coverage at the project's standard breakpoints
- Dead or duplicate selectors left over from iteration

## When to use

- The user just asked for a series of CSS/animation/layout tweaks and you want to verify before stopping.
- The user explicitly types `/style-review` or asks for a "style review".
- A change "didn't visually apply" — run this skill before retrying with `!important`.

Do **not** auto-fix on the first pass. Report findings first, then ask the user which to address.

## Inputs to gather (in order)

1. **Scope of changes**: run `git status` and `git diff --stat` to find changed `.astro`, `.css`, and `.scss` files. If nothing is staged or modified, ask the user which files/components to review.
2. **Standard breakpoints in this codebase** (from prior work): `420px`, `560px`, `680px`, `780px`, `980px`, `1020px`. Anything narrower than 420px is mobile-tight; wider than 1020px is desktop. Flag changes that introduce new breakpoints without justification.
3. **Design tokens** live in `src/styles/global.css` as CSS custom properties (e.g. `--color-text`, `--color-gradient`, `--space-*`, `--text-*`, `--duration-*`, `--ease-*`). Hard-coded values that duplicate a token are a finding.

## Checks to run

For each changed CSS block / `<style>` tag:

### 1. Specificity & overrides
- Grep the codebase for the same selector defined elsewhere — multiple definitions of the same class are the most common cause of "my change didn't apply".
- Flag any new use of `!important`. If the user's change required it, suggest a refactor (more specific selector, removing the conflicting rule, or reordering).
- Flag inline `style={...}` props on elements that already have a class — these win silently and confuse later edits.

### 2. Scroll-snap & smooth-scroll interactions
- This site uses **Lenis** for smooth scroll (initialized in `BaseLayout.astro`). Any new `scroll-behavior: smooth`, `scroll-snap-type`, or `position: sticky` interaction with animated transforms should be called out.
- Animations that change `transform` on a scroll-snapped child can cancel the snap. If you find one, recommend animating `opacity`/`filter`/`clip-path` instead, or moving the animation to a non-snapped wrapper.

### 3. Responsive coverage
- For each component touched, confirm there is a media query covering `560px` (mobile) and at least one mid-breakpoint. The fixed elements (Navbar left, ContactPills right, ServiceDock bottom-center, copyright bottom-left) need to not collide on narrow screens — verify their `top`/`bottom`/`left`/`right` clamps don't overlap below 560px.
- `clamp()` is the project's preferred responsive sizing tool. Flag fixed `rem`/`px` values where a `clamp()` would scale better.

### 4. Token hygiene
- Hard-coded colors that match a token (`#2B221C` → `var(--color-text)`, `#F4EFE6` → `var(--color-bg)`, the 4-color gradient → `var(--color-gradient)`) should be flagged.
- New durations/easings should use `var(--duration-*)` and `var(--ease-*)`.

### 5. Dead & duplicate rules
- Selectors in the changed file that no element matches anymore (e.g. a class renamed but the old rule left behind).
- Two rules in the same `<style>` block targeting the same selector with overlapping properties.

### 6. Accessibility quick-pass on visual changes
- Color contrast: any text on the beige `#F4EFE6` background needs to clear 4.5:1. Flag rules that lower text opacity below ~0.55 on body copy.
- Focus rings: hover-only interactions without a `:focus-visible` equivalent.
- `prefers-reduced-motion`: any new animation should have a reduced-motion fallback (the existing `BaseLayout` doesn't cover component-scoped animations).

## Output format

Produce a single Markdown report with this shape:

```
## Style review — <N> findings

### Blocking (must fix before shipping)
- [file:line] <one-line description> — <suggested fix>

### Recommended
- [file:line] ...

### Nice to have
- [file:line] ...

### Verified clean
- <list of checks that passed>
```

End the report with: **"Want me to apply any of these? Reply with the numbers or 'all blocking'."** Wait for the user before editing.

## Out of scope

- Don't run the build or start the dev server unless the user asks.
- Don't reformat unrelated code.
- Don't touch JavaScript behavior unless a CSS finding requires it.
