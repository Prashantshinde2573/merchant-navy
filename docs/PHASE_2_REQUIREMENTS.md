# Merchant Navy Phase 2 — screenshot coverage and prototype boundary

Reference: four client screenshots dated 28 October 2026 (F1 voice, F2 translation, F3 package gating, F4 native mobile).

This deliverable is a React UI prototype. Browser speech recognition and device voice playback are live, and translation uses the existing no-key MyMemory provider. No conversational AI backend, billing system, analytics collector, notification delivery service or native SDK is connected. Existing app data and new previews remain local/in-memory or in browser storage. External image/font assets are not backend integrations.

## Review entry points

- Prototype Review and its navigation entries have been removed. Previous `/prototype` URLs fall back to the feed.
- `/plans?feature=voice`: illustrative packages with feature highlighting and an updating state. No checkout/payment.
- `/mobile-prototype`: separate phone interaction surface with iOS/Android appearance selectors. This is not a native application binary or a separate React Native/Flutter codebase.
- Existing request modal: manual form, right-column voice entry above Ports, side-panel assistant on desktop and full-width assistant on mobile. The duplicate header toggle is removed.
- Profile → Settings and navbar: same searchable preferred-language setting.

## F1 — voice agent for posting

| Screenshot requirement | Draft coverage |
| --- | --- |
| Right-column entry above Ports, “Describe it by voice”, “Talk to AI, we fill the form” | Compact entry in the existing form; original feed/home entry retained. |
| Microphone bubble, soft idle pulse | Existing animated central orb and pulsing entry microphone. |
| Hidden if no microphone API | The single right-column entry offers Voice and Chat; unsupported speech input offers an inline error and Chat fallback. The guide can show all capability states. |
| Tier badge | Shared `GatedFeature("voice")`; default preview plan is unlocked Premium. Set Silver in Packages to inspect a lock. |
| Idle, Permission, Connecting | The live assistant requests browser microphone permission; the standalone walkthrough retains illustrative permission states. Connecting expands into the desktop right panel. |
| Listening, waveform, transcript, Mute, End | Live browser recognition, animated orb, editable transcript, Stop listening and End Chat. |
| Speaking, interruptible | Live time-based greeting/prompt using a preferred natural female device voice; central control stops playback. ElevenLabs integration remains excluded. |
| Thinking | Chat processing indicator and explicit state walkthrough. |
| Filling, highlighted fields | End Chat maps the known demo or typed details through the existing local parser. Form cards highlight for review. |
| Review banner and missing fields | Missing/unclear fields listed; AI review acknowledgment required only for AI-added values. |
| Error / partial fill / Retry / Type instead | Inline help, retry and Chat fallback keep current values. |
| Ended / collapse / Start again | End Chat returns to the same editable form. Voice entry changes to Start again. |
| Profile language / switch language on reply | Initial profile language and localized demo fixture are used. Typed replies use the existing local detector and carry per-turn language; the assistant can change language without changing the saved profile preference. Unrestricted live speech detection is not claimed. |
| Scope: work, quantity, vessel/ETA, handling | Scope transcript retained; typed description remains editable. Short preview uses two lines. |
| Maximum three follow-ups per vague field | Local repeat limiter stops repeated questioning and directs remaining details to manual review. |
| Services taxonomy | Existing service catalog and known aliases; unknown values require user review rather than a fabricated confident match. |
| Ports / names / UN/LOCODE / aliases | Existing web catalog plus six code-bearing ports in the mobile preview. A real 511-port reference dataset was not supplied; no claim is made that the prototype contains it. |
| Budget min/max/currency, ASAP/date range | Existing local mapping and validation reused; updates processed in response order. |
| Attachments manual | Original file controls preserved; mobile picker stores file names locally. No upload. |
| Summary read-back / please review | Review state and editable summary shown. Spoken live-agent read-back is a future integration, not faked audio. |
| Four minutes / twelve turns | Local UI caps; no server session. |
| Sixty-second silence prompt then end | Scripted listening timer warns after 60 seconds and returns to review 15 seconds later. |
| Schema, confidence, transcript and agent version | Existing field schema; missing/unknown data flagged for confirmation. Transcript + `ui-prototype-1` retained on local prototype posts. No fabricated confidence scores. |
| Never auto-publish / manual override | End Chat only fills/reviews. Manual changes made during a session take precedence at handoff. Publication remains an explicit local action. |
| Starts/completions/fill/edits/publish metrics | Requirements retained for implementation handoff. The walkthrough shows local interaction events; it does not claim production analytics. |

## F2 — translation of posts

| Screenshot requirement | Draft coverage |
| --- | --- |
| Preferred language in Profile → Settings | Added, shared with existing navbar language menu. |
| Searchable dropdown, flag and native name | Search field, native labels, selected indicator and representative locale glyphs. Flags are illustrative rather than country identity guarantees. |
| Default browser locale; instant change | Supported browser language is used when no saved preference exists; context changes apply without reload. |
| V2 supported list TBD | Existing language catalog retained. Six fixture languages are available for the reference demo. Unknown fixture pairs show Unavailable, not fake translated text. |
| Scope only; metadata untouched | Only scope text/rich formatting is translated. Budget/date/file/service/port metadata is not passed through the translation preview. |
| Source language stored at publish | Stored with local posts; older data uses the existing detector. |
| Different language → translate; same language → nothing | Shared per-post flow, independently keyed by post, content, source and target language. |
| Translating skeleton | Local asynchronous skeleton state; explicit walkthrough selector for inspection. |
| Translated / Original toggle | Subtle sparkle caption and text link. Prior explicit user preference retained: **See Original / See Translation always remain English**. |
| Failed → original + unavailable/retry | Original preserved, no false translation; retry control shown. |
| Remember per-post selection for session | In-memory session selection; edits/content changes invalidate its key. |
| Feed below preview, detail above scope, muted 12px caption | Shared component supports feed/detail placement. |
| Rich formatting and RTL | Safe formatting-only renderer; rich-text translations preserve supported structure. Arabic/Urdu direction is per block. Failed translations fall back safely to original. |
| Notifications/emails in recipient language | Recipient-language preview exists in the walkthrough. Actual notification/email templates and delivery are outside this build. |
| Maritime glossary, OpenRouter, cache/version, top-ten prefetch, <1.5s target, rate limiting and costs | Handoff specifications only; no LLM, API, cost measurement, SLO claim or rate limiter. Visibility observer stages lightweight translation requests; content/language keys invalidate UI state. |
| Search original text | Existing search continues to use stored original fields. |
| Metrics | Local UI event preview; real translation rates, p95 latency and cost require later instrumentation. |

## F3 — package gating nudge

- One reusable `GatedFeature(featureKey)` and `useEntitlement(key)` hook.
- Locked feature stays visible; 20px amber badge with light border. Hover/tap/click opens the same contextual popover.
- Popover: tier eyebrow, availability, one-line benefit, Upgrade to tier and Not now.
- Upgrade navigates to plans with the feature highlighted. Preview plan change displays Updating until local state refreshes.
- Unlocked (no badge), Locked, Trial/expiring (teal/3 days left), Upgrading, and Downgraded states can be inspected.
- Not now is remembered until a new page session; changing plan never deletes old posts/drafts.
- Four preview tiers, illustrative matrix and local admin override. Final minimum-tier matrix, trial rules and whether translation is gated are explicitly TBD.
- Voice, attachments, post allowance, ports and translation each have a visible gated-feature sample in the walkthrough. Only voice is gated in the actual form preview; unconfirmed business limits are not silently imposed on existing fields.
- In-memory impression/click/upgrade events only. No API enforcement, admin service or production tracking.

## F4 — native mobile surface

| Screenshot requirement | UI prototype coverage |
| --- | --- |
| Auth/onboarding/profile/language | Sign-in/code/company/language preview and Profile tab. No auth backend. |
| Feed sort/filter by port/service | Cached demo feed, port/sort controls, search and service selector. Reference dataset is deliberately small. |
| Post + F1, detail + F2 | Six-step post flow, voice FAB/bottom sheet, editable voice-filled review and translated detail. |
| Quotes/responses/chat | Local quote preview and editable local conversation; existing web routes remain accessible. |
| Announcements/notifications | Alerts/deep-link previews plus announcement route. No push delivery. |
| Packages/F3 | Plans route and gated voice FAB. Preview entitlements share the same context as web. |
| Bottom Feed/Search/Post/Alerts/Profile tabs | Separate native-style tab bar. |
| Full-screen Scope → Services → Ports → Budget → Dates → Review | Back/Continue, optional fields, editable review, AI acknowledgment and submit-confirmation preview. |
| Pull refresh/skeleton | Touch pull or Refresh button invokes a local loading state. |
| Offline cached feed / queued drafts | Offline UI, local cached example, saved draft and local restore. No background synchronization claim. |
| Phone first, tablet later | Responsive phone frame and small-screen full viewport; tablet-specific native layouts deferred. |
| Push + deep links | In-app push banner preview opens the matching detail. No FCM/APNs. |
| Camera/file picker | User-triggered local picker/capture affordance; file names only, no upload. |
| Microphone | Scripted permission/listening states; not native capture. |
| Optional biometric | Clearly labeled successful unlock preview, no biometric data. |
| Share sheet | Local share-sheet chooser; no message/email is sent. |
| iOS 16+ / Android 10+ | Platform selectors/capability labels. No minimum-OS certification. |
| Versioned API / framework / CI / stores / crash + analytics / force update | Delivery handoff, M1/M2/M3 outlined in guide. Update notice is UI-only. These are not integrations and cannot be validated in a browser prototype. |

## Verification and remaining decisions

- Automated service checks exercise request mapping, review validation, language choice, cancellation and local translation boundaries.
- Production bundle must build without adding any backend dependency.
- No fresh browser/simulator screenshots were captured in this session; visual/mobile interaction acceptance remains unverified.
- Client/developer inputs still required before production: tier matrix, final language list/glossary, real 511-port data, live agent script/voice, native framework and deployment/instrumentation choices.
- The browser native preview is the agreed UI-only representation of F4; it must not be described as a delivered iOS/Android application.

## Latest live preview update

The Add Post assistant defaults to live browser speech and lightweight translation. Explicit demo fixtures remain for isolated walkthroughs and tests. Natural/neural female voices are preferred with slightly slower delivery and neutral pitch; exact quality and gender on fallback depend on the device voice catalog. Translation provider quotas or failures retain the original text with Retry. Complex service integrations remain deferred. Plans use realistic membership wording without prototype badges or payment claims.
