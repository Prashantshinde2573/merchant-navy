# Home reference matching — verification

final result: passed

Scope: Home, its Sort/Share/Report controls, company-profile dialogs, composer inner states, and the vendor/bookmark controls reached from Home's post cards. Authenticated reference access was restored and the previously blocked company/selector capture was completed. Private document downloads are deliberately excluded following the user's instruction; certificate and insurance metadata remain visible.

## Evidence

- Source visual: `/Users/prashant/Library/Mobile Documents/com~apple~CloudDocs/Recordings/Screenshot 2026-11-03 at 4.38.15 PM.png` (2940 × 1478, normalized to 1470 × 739).
- Source live page: https://www.merchant.navy/home, authenticated Chrome capture of the initial feed, Sort menu, Expiring first, Emergency, Saved items empty state, Profile menu, Report menu/dialog, Share dialog, compose dialog, and the mobile page at 390 × 844.
- Implementation desktop: `qa-evidence/home-desktop-sort.jpg` (1465 × 736 screenshot, browser CSS viewport 1470 × 739). Normalized to 1470 × 739 for comparison. Browser scrollbar/capture bounds account for the small difference.
- Full comparison: `qa-evidence/desktop-comparison.jpg` (source left, implementation right).
- Focused comparison: `qa-evidence/menu-comparison.jpg` (source left, implementation right). The focused menu comparison was necessary to check type size, selected background, row spacing, radius, check mark and menu position.
- Other rendered evidence: `qa-evidence/home-desktop-share.jpg`, `qa-evidence/home-mobile-sort.jpg`, `qa-evidence/home-mobile-share.jpg`, `qa-evidence/home-mobile-report.jpg`, `qa-evidence/home-1024.jpg`, `qa-evidence/home-1280.jpg`.

## Findings and comparison history

1. Fixed: source descriptions occupy up to three lines; existing local descriptions used two. Desktop card description now uses three lines with 21px leading. The first desktop card measures 588 × 304 at y=194, matching the normalized reference's geometry.
2. Fixed: inert Sort control. Implemented all four captured menu choices, selected indicator, outside dismissal, arrow/Home/End keys and Escape.
3. Fixed: inert save/share controls. Bookmarks persist, sidebar count updates, saved feed/empty state work, and the source-style Share dialog exposes platform links, copy feedback and native sharing with fallback.
4. Fixed: clipped post overflow menus. Menus now escape card clipping and Report remains available. Escape dismissal and semantic menu roles added.
5. Fixed: 1024px sidebars overlapped the feed. Sidebars now collapse below 1280px; intermediate desktop padding permits non-overlapping three-column layout at 1280px. Wide desktop layout is preserved.
6. Fixed: advertisement replacement differed from source. Uses the existing advertisement image. The used Inter and Material Symbols font files are now local.
7. Fixed after authenticated access was restored: company buttons open the reference's 800px dialog with Company, Certificates, Insurance, Team, Gallery and Reviews. All four feed companies use captured content. Empty company states and the seven real gallery images are included. Download controls are omitted by explicit user preference.
8. Fixed: simplified composer dropdowns lacked the source's nested dialogs. Services now has 15 groups/219 services; Ports has the captured 660 country/port rows. Search, group selection, indeterminate state, expand/collapse, clear, cancel and apply work.
9. Fixed: inert date icon/plain date field. Implemented range selection, month navigation, month/year choices, minimum-date handling, outside/Escape dismissal and ASAP hiding. Restored the paragraph-style menu.
10. Fixed during visual comparison: company Address spans a full row, field margins/row separators match source, reviews use five stars and right-aligned dates, and composer header/body/footer dimensions match the reference within roughly two pixels.
11. Fixed during mobile verification: Cancel had been hidden in the old mobile stylesheet and formatting controls could overflow. Cancel is visible and the toolbar wraps while preserving all controls.
12. Data limitation: the sample feed contains no expiry timestamps. Expiring first selects correctly and preserves the order observed on the reference; actual expiry-based ordering requires expiry data. View/notification counts differ because they are sample/local data.

## Required fidelity surfaces

- Fonts/type: source Inter and Material Symbols retained and stored locally for the used character sets. Menu size/weight and description leading compared in focused/full evidence.
- Spacing/layout: composer, feed, sidebars, card padding, rounded corners and menu anchoring compared. First card matches source height after the three-line fix. Small browser-gutter differences remain.
- Colors/tokens: original theme retained; selected menu gray and green Applied state matched. White dialog, gray preview and navy share action retained.
- Image quality/assets: existing logo, profile images, company images and cover retained. Real advertisement asset restored. Share social icons use the matching Lucide library.
- Copy/content: all four source Sort labels, saved empty-state text, Report and Share action labels retained. Local links intentionally point to this preview.
- Mobile: source itself overflows at 390px. Per the user's explicit request, local layouts adapt instead of reproducing that overflow.

## Browser verification

- Emergency shows exactly the four urgent fixture posts.
- Saved empty state verified.
- Bookmark a post, open sidebar Saved items, verify one result and count, reload, verify bookmark persists, then remove test bookmark.
- All four menu choices selectable; arrow navigation and Escape verified.
- Share dialog opens without navigating the card; Copy link displays `Link copied`; cancel/close work. Platform URLs are wired without publishing any message during verification.
- Report menu opens without card navigation. Submit initially disabled; enabled after sufficient text; cancel closes.
- Profile menu opens with Enter; Escape closes it.
- No captured browser console errors after the final Home changes.
- Responsive widths: 320, 390, 768, 1024, 1280 and 1470. No horizontal document overflow in checked mobile/compact views; Share dialog at 320px has equal client/scroll widths and fits vertically.
- Production build passes; existing large-bundle warning remains.

## Additional authenticated evidence and checks

- Source captures: `source-company.jpg`, `source-company-{certificates,insurance,team,gallery,reviews}.jpg`; company-specific captures for Polaris, Vendor1 and Dummy Company; `source-compose-services.jpg`, `source-services-expanded.jpg`, `source-compose-ports.jpg`, `source-compose-calendar.jpg`.
- Rendered implementation: corresponding `local-company*.jpg`, `local-compose-services.jpg`, `local-compose-calendar.jpg`, and mobile company/gallery/selector/calendar captures.
- Combined comparisons: `company-comparison.jpg`, `company-reviews-comparison.jpg`, `compose-services-comparison.jpg`, `compose-calendar-comparison.jpg`. These compare captured source and rendered implementation together, normalizing source 1470×900 and local 1465×896 captures to the same CSS viewport. Company-focused comparisons from prior iterations remain for certificates, insurance, team and gallery.
- Company initial layout, all six populated Indra tabs, Polaris gallery loading, and all empty tabs for Vendor1/Dummy verified. Gallery images checked for successful loading.
- Service categories: 15 collapsed checkboxes; 234 rows when expanded (15 groups plus 219 services). Search for Canal, select one service and Apply; parent composer remains open and selected value is visible.
- Search no-result state, clear search, port search for Chennai and selection/apply verified.
- Date range Nov 4–6 selected and field updates; ASAP hides dates; Escape closes the calendar without dismissing the composer.
- Mobile dialogs fit at 390px; no horizontal dialog overflow; date popup bounds remain within the viewport. Mobile Cancel restored and verified visible.
- Vendor profile opens from post details. Saving in post details updates Home's saved count; the temporary bookmark was removed after the check.
- Original Home menu, urgent/saved states and share/report behavior were retained. No messages, requests or reports were submitted to the live reference.
- Console checked: no captured errors on the final local Home/dialog pass.

## Acceptance and follow-up polish

No remaining actionable P0/P1/P2 findings in the scoped Home work. Browser-gutter offsets, native checkbox rendering and small capture/antialiasing differences are P3 polish. Reference desktop structure, type hierarchy, spacing, colors and real assets are retained. Responsive variants deliberately improve the source's mobile overflow. Existing sample data has no expiry timestamps, so Expiring first preserves the observed reference order; integrating real expiry data is a data/backend follow-up. No private document files are included in the local app.

Implementation checklist completed: source capture; local assets; missing Home controls; company dialog tabs; grouped composer selectors; calendar; cross-page bookmarks; desktop/mobile browser checks; combined visual comparisons; production build.

Final 320px check: composer/dialog width and scroll width equal; toolbar width and scroll width equal; Cancel, Save Draft and Publish Request all visible. `git diff --check` passes.

## My Posts follow-up — November 3, 2026

Matched the signed-in live reference for search styling, neutral tab counts, My Posts menus (Edit Post / Delete Post), and merchant menus (View Profile). The Figma file E4FGstSMfklNq09hxsIiMh, node 3:13 was supplied, but the connector rejected access; no Figma-specific measurements are claimed.

Implemented consistent 40px search fields and 6px title/subtitle spacing across My Posts, Wins, and My Merchants. Post detail actions now occupy a separate row below the title. Both owned and public post views hide mobile bottom navigation. My Posts card buttons have equal widths, including measured 135.5px widths at 390px. Edit/save, close/delete confirmation, and persisted local changes are implemented. Merchant cards are wired on My Merchants, quotation rows/cards, and application rows, including all six profile tabs. Document downloads remain excluded.

Validation: production build and diff whitespace check pass. Browser checks at 1470×900 and 390×844 confirm all six My Posts status tabs preserve a 40px search field and navy count text; search empty state, edit/save, share dialog, close confirmation, ID-card profile, and overflow-to-profile work. No horizontal page overflow on checked mobile/desktop post views. Both post views report mobile navigation `display: none`.

Evidence in `qa-evidence/my-posts/`: list-desktop.jpg, list-mobile.jpg, post-detail-desktop.jpg, post-detail-mobile.jpg, public-post-mobile.jpg, merchant-card-desktop.jpg. Unknown fixture companies show an explicit empty profile rather than invented company information. Existing build warning about large bundles remains.

## Apply Now footer follow-up — November 3, 2026

Split post-detail controls into a top-right Save/menu group and a fixed bottom application footer. Price and service dates are left-aligned, Apply Now/Applied is right-aligned. Footer includes safe-area padding and content clearance. Retained existing button colors, typography, bookmark state and menu/application handlers.

Verified at 390×844 and 1470×900: no horizontal overflow; footer bottom equals viewport bottom. After scrolling a long post, footer remained at y=844. Apply Now opens Send your application; header overflow opens Report. Applied state remains disabled. Production build and whitespace check pass. Evidence: qa-evidence/my-posts/apply-footer-mobile.jpg and apply-footer-desktop.jpg.

## Applied screen and desktop restoration

Added the supplied n8zXLc4RjgxncUntWUAPQ Applied reference, reachable from My Posts and by its matching local deep link. The desktop view follows the live reference: 64px shared title/actions row, tabs below, selectable merchant table, match breakdown, applied date, notes popover, company profile, Invite / Invite All, and private-notes sidebar with request ID and views. Empty quotation badges are hidden. Local invitations persist and appear in In Discussion; private notes persist per post. No live reference invitations were sent and document downloads remain excluded.

Desktop header changes intended for mobile are scoped below 1024px; desktop uses the source's single-row arrangement. Mobile uses a card layout with an expandable services summary, without changing desktop. Browser checks at 1470×900 and 390×844 show no horizontal overflow. Checked selection/Invite All enablement, application notes, overflow-to-profile, and the Applied deep link. Production build and diff whitespace check pass. Evidence: applied-desktop.jpg and applied-mobile.jpg in qa-evidence/my-posts/.

### Applied mobile card refinement

Grouped merchant identity/rating with selection aligned right, paired match and applied date into two columns, and placed notes, merchant card, Invite, and overflow in one action row with 40px controls. Changes are scoped below 1024px. Verified at 390px and 320px without horizontal overflow; selection enables Invite All, notes open, and the profile menu opens the company dialog. At 1470px the desktop retains table/table-row rendering and its 64px header. Build and whitespace checks pass. Evidence: qa-evidence/my-posts/applied-mobile-refined.jpg.

## Uniform mobile heading spacing — November 4, 2026

Added a shared mobile heading group with a single 6px title/description gap, resetting stacked margins so existing flex gaps cannot double it. Applied to paired page headings on My Posts, Wins, Merchants, Help, Notifications, Settings, Company Profile, owned/public post detail, quotation detail, and the authentication verification heading. The quotation recommendation badge follows the description on mobile so it does not interrupt the heading pair. Pages without descriptions gain no extra spacing.

At 390px, measured exactly 6px on all ten signed-in page types listed above. At 1470px the quotation header retains its original 2px gap and flex title/badge row. All new rules are restricted below 1024px. Build and whitespace checks pass. Evidence: qa-evidence/my-posts/mobile-heading-spacing.jpg.

## Page-title line-height

Applied a shared `.page-title` rule of `line-height: 1.3em` at all viewport sizes, including authentication, main page headings, post/quotation detail titles, and chat request title. Browser checks at 390px and 1470px on My Posts, Wins, Settings, owned/public posts, and quotations all report a computed ratio of 1.3. Production build and whitespace check pass. Evidence: qa-evidence/my-posts/page-title-line-height.jpg.

## Compact mobile My Posts detail header

Mobile title is now a single 14px line with ellipsis; Share and overflow occupy the right side of the same bar. Urgent and Edit Post form the row below. Services remain available underneath the title, including expansion. Verified at 390px and 320px without horizontal overflow; Share and overflow menus work. Desktop retains its 64px header and 18px title. Build and whitespace checks pass. Evidence: qa-evidence/my-posts/mobile-post-header.jpg.

## Search-field consistency

Removed the My Posts toolbar border beneath search; the divider now belongs only to the tabs. All search fields (My Posts, Wins, Merchants, Chats, Announcements, and service/port dialogs) share a 40px white surface, 1px light border, 8px corners, subtle shadow, 12px horizontal padding, 8px icon gap, and borderless inputs. A matching focus ring replaces individual input outlines. Browser measurements confirm identical surfaces on the five main pages and the service dialog, and the My Posts search filter works. Build and whitespace checks pass. Evidence: qa-evidence/my-posts/search-uniform-mobile.jpg.

## Shared Add/Edit Post form

Removed the separate two-field edit dialog. Both the detail Edit Post button and the My Posts overflow item now open the existing PostModal in edit mode, with scope/rich text, currency, budget bounds, attachments, services, ports, ASAP, and dates hydrated from the selected post. Save changes calls updatePost for the original ID and preserves unrelated owner/status/application data. New requests still call createPost. Structured form fields and display aliases are saved together; custom feed entries also reflect edits. The supplied reference fixture now includes its verified USD 5555–6666 budget and 25 selected ports.

The same shared form handles validation, attachment metadata, currency/selection/date interactions, scrolling, and responsive layout. Long scopes scroll inside the editor and modal instead of pushing the header/footer outside the viewport. Inline validation replaces blocking browser alerts. No reference posts were changed and no private document downloads were added.

Validation: four normalization/round-trip tests pass; production build and whitespace check pass. Browser checks at 1470×900 and 390×844 confirm pre-filled content, 12 selected services, 25 selected ports, ASAP, required-scope validation, and fresh empty Add mode. A budget edit persisted after reopening on the same post URL; the My Posts count stayed at 2. Restored the original budget afterward. Verified both detail-button and list-overflow entry points reuse the full form. Evidence: edit-shared-modal-desktop.jpg and edit-shared-modal-mobile.jpg in qa-evidence/my-posts/.

## Desktop popup and avatar follow-up — 2026-11-04
- Compared live Home Add Post at 1470×900 with the shared local Add/Edit form. Matched the 1200px modal, 728/400px columns, 24px spacing, desktop header typography, close button, selection fields, and date field spacing.
- Verified edit prefill: scope, USD 5555.00–6666.00, 12 services, 25 ports, ASAP; mobile retains its existing stacked layout at 390×844.
- Removed the desktop rule hiding profile images. View Post now tries available post/company image URLs before initials and handles failed images. Indra image verified loaded and visible on desktop.
- Validation: production build, four form tests, and diff whitespace check passed. Evidence: qa-evidence/my-posts/desktop-popup-reference-match.jpg and desktop-post-avatar.jpg.

## Mobile detail layout follow-up — 2026-11-04
- Logo receives 24px total left inset.
- Detail cards follow desktop DOM order; removed mobile Scope/Attachments reordering.
- Apply card bodies align beneath heading text; Save moves beside the sticky Apply action only on mobile.
- My Posts Urgent aligns with title content; Edit Post is hidden only on mobile.
- Production build and whitespace check passed. Browser verified at 390px: desktop section sequence, wrapped card content aligned with headings, Save beside Apply, Urgent aligned with title, and Edit hidden. Preview recovered after restart approval delay.

## Apply-based consistency pass — 2026-11-04
- Added a shared role-based style system in `src/styles/design-system.css`; usage and scale are documented in `DESIGN_SYSTEM.md`. Existing layouts, handlers, content, status colors, search controls and form state are retained.
- Standardized heading/description rhythm, page and section typography, card surfaces/padding, section icon columns, wrapped values, financial amounts, badges, field labels and primary action sizing. Applied to feed, My Posts, details, quotations, Wins, Merchants, profiles, notifications, support, settings, auth and shared forms.
- Reused `ContentIcon` across section/metadata rows so SVG icon widths do not depend on external fonts.
- Reviewed 14 route/state views at 390×844 and 1470×900, with screenshots and DOM measurements in `qa-evidence/design-system/`. No horizontal page overflow or error state was observed. Eight representative routes also passed horizontal-overflow checks at 320px and 768px.
- Interaction checks: My Posts search/empty state, tab filtering, overflow Edit, edit prefill, all six merchant profile tabs, settings switches (restored), Add Post dialog, and Apply dialog. Existing form tests passed (4/4); production build and whitespace checks passed.

## Mobile-only icon, spacing and application follow-up
- Reused Homepage `ContentIcon` on mobile in remaining legacy Ports/Services locations, including Wins, merchant profiles, custom feed entries and compact quotation match rows. Original desktop icons remain rendered; replacements are hidden above 1023px.
- View Details status follows the description group with a 4px gap. Wins price and View Details share one vertically centered row with an 8px gap; price matches Apply at 18px/24px, weight 600.
- Send Application footer: Cancel left; Save and Send on right with an 8px gap. Four next steps form a two-column grid.
- Verified at 390px and 320px; no footer overflow at 320px. Desktop footer/step layout remains flex and desktop legacy icons remain visible. Production build and whitespace check passed. Screenshots: mobile-application-refined.jpg, mobile-wins-refined.jpg and mobile-details-refined.jpg in qa-evidence/design-system.

## Exact Homepage Ports & Services assets — 2026-11-04
- Read the live Home reference: Material Symbols Outlined `anchor` / `settings`, 24px, weight 400, FILL 0, GRAD 0, opsz 24, #71717a. Downloaded the exact unmodified font from its stylesheet and served it locally; provenance is beside the asset.
- Added one `PortServiceIcon` and removed alternative SVGs and responsive duplicate icons across pages, match rows and popups. Kept Home's existing icon markup and spacing while using the identical local font asset. Unrelated navigation Settings icons are unchanged.
- Verified six routes/states at 320px, 390px and 1470px: every visible Ports/Services glyph has identical 24×24px dimensions, font and colour; no horizontal page overflow. Verified merchant profile and Add Post popup glyph dimensions as well.
- Evidence and measurements: `qa-evidence/port-service-icons/`. Production build and whitespace check passed.

## Mobile alignment and feed footer follow-up
- Centered Ports/Services glyphs inside their fixed 24px boxes; centered mobile feed/summary icon rows without moving section icons away from their headings.
- Wins mobile View Details aligns to the card's right edge.
- Home feed mobile prices are 16px and always precede their action row; verified every priced card at 320px with no footer overflow.
- Wins In Progress empty card uses explicit 32px vertical / 24px horizontal padding on mobile and desktop. Desktop Home retains its row-reverse layout and 18px pricing.
- Build and whitespace checks passed. Evidence saved under qa-evidence/mobile-layout/.

## Focus styling and intrinsic feed-footer correction
- Removed conflicting solid-outline utility classes from text inputs/areas. Added shared focus styling with a soft outer ring; wrapped inputs have no inner border, outline or shadow. Verified Company Profile, search, application message and desktop Add Post budget fields. Button/checkbox keyboard focus and validation styling are retained.
- Added `FeedFooter`, which measures price and action widths with ResizeObserver and stacks only when the actual content cannot fit. Mobile price remains 16px; default is one horizontal row, narrow fallback right-aligns the price above the actions. Removed redundant action margins and used compact gaps on smaller phones.
- Verified all priced feed cards at 320, 360, 375, 390 and 1470px, with no footer overflow. At 390px all prices/actions share one row; at 320px all priced cards use the right-aligned fallback. Desktop retains its original row-reverse layout.
- Production build, four existing form tests and whitespace checks passed. Evidence and measurements: qa-evidence/focus-footer/.

## Mobile navbar and merchant popup alignment
- Moved the existing mobile Profile destination into an upfront avatar link immediately before the hamburger; removed its duplicate hamburger item. Settings, support, announcements, logout, notification and desktop Profile behavior remain intact.
- Mobile navbar left/right insets are exactly 12px. Verified Profile navigation and hamburger open/close at 320px and 390px with no horizontal overflow.
- Merchant popup Ports/Services chip containers start at the same x-position as their heading text (60px in the inspected mobile popup), using a 32px icon-column inset. Narrow values wrap normally.
- Desktop Profile trigger stays visible and popup chip inset remains 0px. Production build and whitespace check passed; evidence in qa-evidence/mobile-navbar/.

## Connected mobile My Posts actions
- View Details, Mark Close and overflow now share one bordered, rounded action bar with dividers, equal 44px heights and a fixed 44px menu segment. Added an accessible Post actions group label.
- Verified 320px and 390px: same top alignment, no action wrapping or overflow. View Details navigation, overflow menu and close confirmation work; confirmation was cancelled without changing post state.
- Desktop remains its original borderless flex group with 12px gaps. Evidence: qa-evidence/mobile-actions/connected-actions.jpg. Build and whitespace checks passed.

## Correction: group post information, restore action buttons
- Reverted the connected action-bar CSS and group wrapper from the previous request. View Details, Mark Close and overflow are back to their original separate styling and 12px gaps.
- Mobile timestamp, views and quotation count now share a compact, aligned information container. Mobile timestamp shows the age without the redundant Posted prefix; desktop text and styling remain unchanged.
- Verified equal metadata baselines and no overflow at 320px; checked the corrected layout at 390px and desktop isolation at 1470px. Build and whitespace checks passed. Evidence: qa-evidence/mobile-metadata/post-information-row.jpg.

### Mobile refinements — Profile, navigation, editor, post metadata (2026-11-04)
- Profile heading matches measured Apply identity typography: title 15px/19.5px, weight 600; description 13px/19.5px, weight 400, #71717a; 6px gap. Desktop title remains 24px.
- Profile navigation control reduced to 32px wide beside the unchanged 44px hamburger control; removed excess inter-control space. Navbar outer padding remains 12px.
- Scope of Work toolbar stays on one horizontal row, with horizontal scrolling when controls exceed available width. At 320px all formatting buttons share the same y-position and the toolbar is 41px high.
- Post activity row uses 8px gaps and two centered 1px × 12px dividers. Verified 320px viewport: row width and scroll width both 257px, with no overflow. Existing action buttons unchanged.
- Checked 320px and 390px mobile layouts and 1280px desktop. Evidence: qa-evidence/mobile-refinements/.
- Validation: npm run build and git diff --check pass.

### Mobile Home and activity row follow-up (2026-11-04)
- Latest scope: mobile only; no further desktop design edits were made after that request.
- My Posts activity background is white with space-between distribution, existing dividers retained, no overflow at 320px (257px row/scroll width). Removed the empty footer placeholder on mobile and reduced divider bottom margin to zero; gap above the activity group is 12px.
- Home Create Post avatar and input container both measure 40px high and share the same top position (85px at 320px viewport).
- Sort By trigger measures 16px high instead of 44px; sorting options remain available and the Create Post control opens the shared editor.
- Desktop check: Create Post input remains 48px high. All latest selectors are inside max-width:1023px.
- Validation: production build and git diff --check pass. Screenshots: qa-evidence/mobile-home-activity/.
- Final result for this mobile follow-up: passed.

### Desktop reference work preceding the mobile follow-up
- Added a dedicated min-width:1024px stylesheet for reference typography, card geometry, detail headers and completion status color (#12a150).
- Captured 15 local desktop routes and source screenshots in qa-evidence/desktop-reference/. Verified 15 mobile route style/layout snapshots unchanged by that desktop stylesheet before the subsequent mobile request.
- Full desktop visual QA is incomplete: some initial source captures contain loading states and require recapture. Stopped further desktop edits when the user requested mobile-only changes. Do not treat the entire desktop reference pass as fully verified.
