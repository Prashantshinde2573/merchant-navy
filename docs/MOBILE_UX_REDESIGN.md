# Merchant Navy mobile UX implementation and QA

## Scope and existing architecture

Reviewed the React 18 / Vite application, React Router routes, shared layout/navigation, page styles, data contexts, dialogs and existing mobile overrides before implementation. The implementation extends the existing Inter typography, navy primary color, pale page background, white cards, border treatments and icon set. The primary mobile/tablet navigation now applies below 1024px; desktop composition remains in place at larger widths.

## Screens reviewed and improved

| Screen / flow | Changes |
| --- | --- |
| Home | Compact composer and feed cards, consistent avatar sizing, readable previews, tighter card spacing and reachable primary navigation. |
| Login / OTP | Removed visible demo code, fill-code helper and credential hints in errors; numeric OTP entry, autofill support, resend countdown, readable instructions and feedback. Authentication verification behavior is retained. |
| My Posts | Compact summaries with full details still available; status badges, metadata and management actions organized; searchable content and useful empty/reset states; keyboard tab navigation. |
| My Merchants | Desktop table becomes labelled cards on mobile; all columns and actions remain available; search, port/service filters and clear-filter empty state work locally. |
| Wins | Denser cards, readable ratings and service details, compact search/filter area, primary detail action retained. |
| Notifications | Compact filters and rows, functioning category filters, mark-read actions, synchronized navbar unread count and caught-up state. |
| Chat | Independently scrolling content, compact composer above bottom navigation, back navigation, accessible editor and local typed-message interaction. Send enables when text is present. |
| Help / Support | Compact FAQ hierarchy, accessible accordion state, scrollable support form and keyboard focus containment. |
| Quotations | Wrapping header, readable vendor/price hierarchy, compact three-column match summary and mobile quotation cards. Invalid quotation IDs show the missing-quotation state. |
| Post Details | Scope appears before secondary information; compact header/actions, readable body content and retained application/report flows. |
| My Post Details | Compact title and four visible tabs; responsive quotation cards. Applied and In Discussion now render their relevant lists/empty states instead of repeating Scope. |
| Add Post | Full-screen mobile task dialog with persistent footer, compact formatting toolbar and consistent text scale; all formatting options retained. Service/port options expand within the form. |
| Apply / Report | Responsive dialogs, readable controls, retained validation, Escape dismissal, focus containment and return to opener. |
| Company Profile | Compact section selector, balanced uploads, readable section cards and mobile gallery sizing. Company details can be edited, saved locally and reverted with Cancel. |
| Account Settings | Compact section layout, labelled switches and larger touch targets. Fixed duplicate toggle handling that prevented settings from changing reliably. |
| Announcements | Mobile spacing/typography and an accessible search field. |

## Shared interaction and layout fixes

- Five-item bottom navigation: Home, My Posts, Merchants, Alerts, Chat; secondary destinations remain in menus.
- Corrected mobile header icon stacking and provided clear active navigation states.
- Safe-area padding and viewport configuration; keyboard-aware viewport sizing for chat and task dialogs.
- Menus close after route changes and with Escape.
- Dialogs lock background scrolling, keep keyboard focus inside and return focus to the opener.
- Arrow/Home/End keyboard navigation for tab controls.
- Mobile inputs use at least 16px to avoid unexpected browser zoom.
- Rich editor keeps its DOM formatting while typing. Pasting imports plain text to prevent external oversized fonts, colors or markup.

## Functional verification performed

- Typed input plus bold, italic, underline, ordered list, bullet list and clear formatting in Add Post.
- Pasted 72px HTML heading: inserted as plain text at the editor's 16px body size.
- Selected service, port and ASAP; confirmed persistent footer remains within the viewport.
- Escape closes dialogs and restores focus to Compose post.
- Application required-message validation and support modal opening/scrolling.
- OTP countdown, resend, invalid-code feedback and clean mobile OTP layout.
- Merchant search, unmatched results, reset and port selection.
- Notification category filtering and mark-all-read updates to the navbar badge.
- My Posts search/empty reset and arrow-key tab switching.
- Local chat typing, enabling Send, displaying the sent message and clearing the editor.
- Profile editing and Cancel restoration; settings switches toggle correctly.

## Responsive and build checks

- 14 page routes checked at 320, 375, 390, 430 and 768px: 70 checks with no page-level horizontal overflow.
- Additional Applied, Discussion, Quotation, Chat, Profile, Settings and quotation-detail states checked at all five widths: 35 further checks with no page-level horizontal overflow.
- Narrow-screen dialog bounds and footer placement inspected in the browser.
- Desktop Home compared with the captured original layout at 1440 × 900; composition, colors and spacing remain consistent.
- Production build and `git diff --check` pass. The existing large-bundle warning remains.
- Browser captures and measurement results: `/private/tmp/merchant-mobile-ux/`.

## Files changed during this mobile redesign

Shared: `index.html`, `src/App.jsx`, `src/main.jsx`, `src/styles/mobile.css`, `src/hooks/useDialogFocus.js`, `src/hooks/useViewportHeight.js`, `src/components/Layout/AppLayout.jsx`, `src/components/Header/Navbar.jsx`, `src/context/NotificationContext.jsx`, `src/context/AuthContext.jsx`.

Dialogs: `src/components/PostModal/PostModal.jsx`, `src/components/ApplyModal/ApplyModal.jsx`, `src/components/SupportModal/SupportModal.jsx`, `src/components/ReportModal/ReportModal.jsx`.

Pages: `src/pages/Home/Home.jsx`, `src/pages/MyPosts/MyPosts.jsx`, `src/pages/MyMerchants/MyMerchants.jsx`, `src/pages/MyMerchants/MyMerchants.css`, `src/pages/Notifications/Notifications.jsx`, `src/pages/Notifications/Notifications.css`, `src/pages/Chat/Chat.jsx`, `src/pages/Chat/Chat.css`, `src/pages/Help/Help.jsx`, `src/pages/Login/Login.jsx`, `src/pages/Login/Login.css`, `src/pages/CompanyProfile/CompanyProfile.jsx`, `src/pages/CompanyProfile/CompanyProfile.css`, `src/pages/ProfileSettings/ProfileSettings.jsx`, `src/pages/ProfileSettings/ProfileSettings.css`, `src/pages/QuotationDetail/QuotationDetail.jsx`, `src/pages/MyPostDetail/MyPostDetail.jsx`, `src/pages/MyPostDetail/MyPostDetail.css`, `src/pages/Announcements/Announcements.jsx`.

Generated production output is rebuilt in `dist/`.

## Remaining prototype limitations

- Authentication, notifications, messages and profile edits use the application's local prototype behavior; no live delivery service or new backend integration was introduced.
- Some original management controls remain static prototype controls, including Edit Post / Mark Close and parts of company certificate, team and gallery management. Their backend workflows are outside this mobile layout work; they should not be described as production-complete.
- Responsive checks used browser viewports. Physical iOS/Android keyboard, notch and installed-app behavior still require device testing.
