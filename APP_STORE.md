# App Store release checklist

Bundle IDs: `com.edwintang.NFModalRemover` (app) and `com.edwintang.NFModalRemover.Extension`.
Minimum macOS: 13.0. Category: Utilities. Encryption: none (`ITSAppUsesNonExemptEncryption = NO`).

## 1. One-time setup
1. In **App Store Connect → Apps → +**, choose **New App** and set:
   - Platform: **macOS**
   - Name: **NF Modal Remover**, or another name if that one is taken
   - Bundle ID: `com.edwintang.NFModalRemover`. If it isn't listed yet, archive and upload once first. Xcode registers it during upload.
   - SKU: anything, e.g. `nfmodalremover`
2. **App Privacy:** choose **Data Not Collected**. The extension stores only your site list, in Safari's local extension storage, and makes no network requests.
3. **Privacy Policy URL:** this is required even when no data is collected. Linking to [PRIVACY.md](PRIVACY.md) on GitHub works.
4. **Support URL:** the GitHub repo page works.

## 2. Each upload
1. Increase the **Build** number by one: General tab → Identity → Build. Also change **Version** for a new release.
2. In Xcode, choose **Product → Archive**, with **My Mac** or **Any Mac** as the destination.
3. In the Organizer, choose **Distribute App → App Store Connect → Upload**. Keep automatic signing on. Xcode creates the Apple Distribution and Mac Installer Distribution certificates and both provisioning profiles.
4. Wait for the processing email, usually 5 to 30 minutes.

## 3. TestFlight
- **Internal testers** (people on your developer team) can install straight away. Add them under **TestFlight → Internal Testing**.
- **External testers** need a short Beta App Review first.
- Testers install through the **TestFlight** app on their Mac, then enable the extension in Safari → Settings → Extensions.
- Builds expire **90 days** after upload.

## 4. Submitting for review
- **Screenshots:** at least one Mac screenshot at 16:10 (1280×800, 1440×900, 2560×1600 or 2880×1800). Show the popup over a page where it's turned on.
- **Review notes**, ready to paste:

  > NF Modal Remover is a Safari web extension. The app itself only explains how to enable it in Safari → Settings → Extensions.
  >
  > The extension does nothing until the user adds a website from its toolbar popup ("This site" switch, or typing a domain). It then registers a content script for those sites only, which hides and removes page elements with the CSS class `nf-modal` and restores page scrolling. It never runs on sites that aren't in the user's list.
  >
  > It requests access to all websites only so the user can add any site they choose; Safari still asks the user for permission per site. No data is collected and no network requests are made.
  >
  > To test: enable the extension, visit any website, open the toolbar popup and turn on "This site".

## Before submitting
- Confirm what `.nf-modal` blocks on your sites. Apple rejects apps that get around paywalls or subscription gates (guideline 5.2, intellectual property). Cookie banners and nag screens are fine.
- If review comes back with "minimum functionality" (4.2), letting users set the CSS selector per site would make the app more general.
