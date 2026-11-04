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
