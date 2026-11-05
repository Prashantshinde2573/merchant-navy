# Company workflow implementation and verification

## Verified product flow

The live site was explored with both supplied demo accounts. The post owner receives applications; the applying company supplies the quotation. The accepted local test direction is **Ronak posts → Yuvraj applies and quotes → Ronak awards**.

1. The owner publishes a service request.
2. An applicant opens the request and submits an introduction. It appears in the owner's **My Posts → request → Applied**, including application notes and merchant details. An application alone is not a quotation.
3. The owner invites the applicant with a message. This opens **In Discussion** and a shared chat immediately; there is no separate invitation acceptance step.
4. The owner requests a quotation in the discussion.
5. The applicant submits an amount, currency, expiry date and quotation details. The quotation appears in the owner's existing **Quotation** view and in the shared chat.
6. The owner reviews and confirms the award. The owner's request appears under **My Posts → Awarded**; the supplier sees the job under **Wins → In Progress**.
7. The supplier marks the job complete. It moves to **Wins → Completed**, and the owner's request appears under **Rate Now**.
8. The owner rates service quality, communication and timeliness and optionally adds feedback. The request moves to **History**; the supplier sees ratings and feedback on the completed win.

Verified live statuses were application/discussion, quotation requested, quoted, awarded and completed. Local state uses `applied`, `discussion`, `quotation_requested`, `quoted`, `awarded`, `completed`, with a separate completed-job review. Notifications are generated for the receiving participant at each relevant transition.

## Existing gaps and implemented features

Previously, applications were stored independently from static quotation, discussion and win fixtures. Account switching did not provide a complete connected journey. The implementation adds one shared local application record linking the post, participants, messages, quotation, award, completion, review and notifications.

Implemented: received application notes, invitation message dialog, shared discussions, quote requests, quotation submission/update, received quotation rows, award confirmation, provider wins, completion, owner ratings/feedback and recipient notifications. Role and stage checks reject self-applications, premature quotes, unauthorized awards/completion/reviews, expired quotes and incomplete ratings. Repeated apply/invite/award/complete operations do not create duplicate records.

Job-card budgets use compact K notation with one currency symbol (for example `₹250K - 300K`). A missing budget has no placeholder; cards do not add “Open for quotations”.

## Files and design preservation

Changed pages: Home, MyPosts, MyPostDetail, Chat, QuotationDetail, Wins and Notifications.
Changed shared components: Navbar, ApplyModal and AppliedMerchants.
Changed contexts: AuthContext, PostContext and NotificationContext.
Added: companyWorkflow utility and tests, useCompanyWorkflow hook, WorkflowDialog and ReviewDialog.

The tracked finalized baseline was restored before the mock implementation. Existing stylesheets, design tokens, spacing rules and responsive breakpoints have no changes. Required dialogs reuse existing dialog classes. Existing reference content remains as demo fixtures.

## Backend and storage

No backend, database, production API, external data integration or package dependency changes. Demo authentication remains local with OTP `123456`. Posts and workflow records persist in localStorage and synchronize between views/account switches; storage events refresh data in other tabs on the same origin.

This is a browser-local mock: separate browsers, devices, ports or origins do not share data. Attachments are mock filenames, not uploaded files. Demo authentication and client-side role checks are not production security controls.

## Testing results

Browser test on the built preview at `http://127.0.0.1:3002`:

- Ronak logged in and published `custom-post-1793876184071`, budget $250K–300K, Chennai, Canal Transit Agency Support.
- Yuvraj logged in and applied with an introduction; Applied was disabled after submission.
- Ronak logged in; Applied showed exactly one Yuvraj/Bluesea application and the submitted notes.
- Ronak invited Yuvraj and requested a quote in the shared thread.
- Yuvraj logged in, saw both messages and submitted ₹275,000, valid through 5 December 2026, with details.
- Ronak's Quotation view showed one actual quotation with matching amount/validity and an Award action.
- Ronak confirmed the award; the quotation became Awarded and My Posts → Awarded showed the job.
- Yuvraj's Wins showed In Progress; Mark Complete moved it to Completed.
- Ronak's Rate Now showed the request. Ratings 5/4/5 and feedback were submitted; History showed the request.
- Yuvraj logged in again and reloaded Wins. Completed status and feedback persisted.
- Mobile workflow was exercised in the existing narrow viewport. Desktop Wins at 1440px had no document overflow (content width 1435px).

Automated: `node --test src/utils/companyWorkflow.test.js src/utils/postForm.test.js` — 9 passed, covering serialized persistence, roles, dependencies, invalid input, idempotency, price formatting and original post form behavior.
Production build passes. The existing large JavaScript bundle warning remains. CSS output retains the finalized `index--hyQYVZS.css` hash.

Evidence: `qa-evidence/company-workflow/mock-completed-mobile.jpg` and `mock-completed-desktop.jpg`.

## Remaining limitations

No known blocker in the tested local journey. Cross-device synchronization and real file transfer are outside the requested mock-only scope. Static reference fixtures remain alongside newly created mock records. Visual verification covered the workflow and desktop Wins; it was not an exhaustive pixel comparison of every unrelated page.

Live exploration earlier in this task exercised an existing Yuvraj-owned request with Ronak as applicant through a clearly identified demo quote, award, completion and neutral demo rating. Those live demo records are separate from this mock implementation; the app no longer connects to live APIs.

## Invitation recheck (5 November 2026)

Rechecked live as Ronak on the existing “Need to shift the container” request and sent a clearly identified demo-only invitation to Yuvraj/Bluesea. The dialog title includes the merchant name. It contains a blank formatted message editor (bold, italic, ordered/bullet lists, link), a 0/1500 counter, one optional PDF/image attachment (20 MB limit), Cancel and Send Invite. Sending temporarily disables the buttons; success closes the dialog, preserves the Applied row with Open Thread, and adds the applicant to In Discussion. No subsequent confirmation dialog was observed.

The mock invitation now includes these controls using existing dialog/editor/upload styling. Selected attachment metadata is stored locally, and the filename is included in the discussion; no file is uploaded. Applied retains the invited merchant with Open Thread. Existing reference applications can also create a connected mock discussion. Cancel was browser-tested without sending; submission was browser-tested and the saved message appeared in the shared thread. Automated validation covers attachment size/type, message limit and preserved invitation metadata. 10 tests pass, build passes, CSS hash unchanged.

## Ratings, request flow, and simultaneous-account follow-up

A fresh live cycle was exercised on the Ronak-owned `Bdzuv9sKfgxmmzhhpkGsL` request: Ronak prepared and sent a quote request; Yuvraj submitted a clearly identified demo-only USD 1 quotation; Ronak awarded; Rate Now remained empty until Yuvraj marked the job complete in Wins. Ronak then saw Rate Now 1 and Rate Vendor. The form includes the supplier/job/completion summary, three required 1–5 ratings (service quality, communication, timeliness), optional feedback and a 600-character counter. Cancel and Submit Rating are present; submission closes the form and moves the request out of Rate Now into History. Yuvraj's completed Wins card showed the submitted scores and feedback. The live review explicitly says this was workflow verification and no actual service was performed.

The local rating form now includes this verified context and text, retaining the app's dialog palette and components. The Rate Now tab displays its pending count. The post owner rates the supplier after completion; this is not a reciprocal rating flow. Ratings/feedback remain visible on the supplier's completed Wins.

Chat selection now derives directly from the URL, with an explicit selected state and the existing navy/light background treatment. Quotation fields are scoped to the app's established input, border, typography and button patterns. Updating a quotation preserves its saved expiry date.

Request Quote now fills the editor with the verified editable request and waits for Send before changing status or notifying the supplier. Regular messages and invitations have participant-specific read tracking. Red unread counts appear on desktop Chat and mobile Chat navigation and the relevant conversation; opening that conversation marks its received messages read without clearing other conversations or bell notifications.

Demo authentication now uses sessionStorage, so each browser tab can keep a different account. Workflow records remain shared in localStorage on the same origin. Open two separate tabs at `http://127.0.0.1:3002/login`, sign into Ronak in one and Yuvraj in the other. Refresh preserves each tab's login; logging out of one does not log out the other. Existing localStorage authentication is intentionally not reused, so a fresh sign-in is needed after this change. Workflow data is retained.

Validation: 14 automated tests pass, including the complete serialized workflow, independent tab sessions/logout, invitation and message unread counts, and editable quote-request text. Production build passes. A fresh local post was created through the UI, but the remaining two-account browser test was interrupted by automatic approval review's usage limit before the applicant OTP action executed. Consequently the latest popup appearance and simultaneous-tab behavior have code/test validation but still require the final browser pass. No alternative browser control was used to bypass the review failure.
