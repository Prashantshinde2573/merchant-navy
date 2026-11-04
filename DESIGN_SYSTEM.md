# Apply-based UI standards

The Apply page establishes the shared visual language. Existing page grids, navigation, content, actions and data behavior remain in place. `src/styles/design-system.css` is imported after legacy page styles so shared visual roles have one source of truth.

| Role | Standard |
| --- | --- |
| Page heading | 24px desktop / 20px mobile, 600 weight, 1.3em line height |
| Compact identity heading | 15px, 600 weight, 1.3em line height |
| Section heading | 16px / 24px, 600 weight |
| Body | 15px / 24px desktop; 14px / 22px mobile |
| Supporting metadata | 13px / 18–20px |
| Heading to description | 6px |
| Label to value | 4–6px according to form or read-only metadata role |
| Amount | 18px / 24px, 600 weight, aligned left, tabular figures |
| Status badge | 13px / 20px, 600 weight, 4px × 12px padding, 4px radius |
| Cards | 8px radius, light border and subtle shadow; 20px desktop / 16px mobile padding |
| Card stack | 16px desktop / 12px mobile |
| Section icon | 24px, 8px gap; supporting content starts under the heading text |
| Primary actions | 44px minimum height, 14px / 20px, 500 weight, 8px radius |
| Search | Existing shared 40px search component, retained across pages |

## Reusable roles

- `ui-card` applies the card surface; `ui-card-padding` marks the element that owns padding. Avoid adding padding to both a card and its body.
- `ui-section-card` aligns the content below an icon/title row. Ports/services keep their existing icon column and wrap values within the text column.
- `ui-section-title`, `ui-amount`, `ui-status`, `ui-field-label`, and `ui-button` describe visual roles rather than individual pages.
- `PortServiceIcon` uses the exact Material Symbols font asset and glyph settings from the desktop Home reference. Both glyphs remain 24 × 24px in #71717a across all viewports. `ContentIcon` delegates Ports and Services to this component; unrelated icons retain their existing rendering.
- `mobile-heading-group` is retained as a compatibility hook for heading/description rhythm on both desktop and mobile.

Tables, notification rows, chat messages, search controls, switches, avatars and editor toolbars retain the geometry appropriate to their role. Status colors and all event handlers remain intact.
