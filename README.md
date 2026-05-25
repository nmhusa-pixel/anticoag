# Anticoagulant Hold App

Single-page clinical decision aid for anticoagulant and antiplatelet hold timing before neuraxial, deep plexus/peripheral, and interventional pain medicine injections.

The neuraxial/deep plexus rules are based on the ASRA Pain Medicine Evidence-Based Guidelines, fifth edition, for regional anesthesia in patients receiving antithrombotic or thrombolytic therapy. Pain-procedure risk buckets are based on ASRA interventional spine and pain procedure anticoagulation guidance. The app is meant to make timing logic inspectable; it does not replace clinician judgment, local policy, drug-specific assays, neurologic monitoring, or specialty consultation.

## Run

Open `index.html` in a browser. No build step is required.

## Installable Web App

This app is also configured as a Progressive Web App (PWA). To install it from a phone browser, host this folder on an HTTPS website, open the page on the device, then:

- iOS Safari: Share > Add to Home Screen
- Android Chrome: menu > Install app, or Add to Home screen

The app shell is cached for offline use after the first successful HTTPS load.

GitHub Pages instructions are available in `GITHUB_PAGES.md`.

## Android APK

An Android Studio project is available in `android`. It wraps this same app in an offline Android WebView and copies the top-level web files into APK assets during the build. See `android/README.md` for APK build instructions.

## iOS App

An Xcode project is available in `ios`. It wraps this same app in an offline iOS WKWebView and copies the top-level web files into the app bundle. See `ios/README.md` for build and signing instructions.

## Current Scope

- DOACs/direct thrombin inhibitors: apixaban, rivaroxaban, edoxaban, dabigatran, argatroban
- Heparins: IV UFH, SQ UFH, LMWH/enoxaparin
- Warfarin
- Antiplatelets: aspirin/NSAIDs, clopidogrel, prasugrel, ticagrelor, cangrelor, cilostazol
- Fondaparinux
- Thrombolytic/fibrinolytic therapy
- Renal-function branches where emphasized by the guideline
- Catheter removal/restart guidance and lab-clearance override notes
- Pain medicine procedure categories: low risk, medium/intermediate risk, high risk
- Bleeding-risk modifier that upgrades pain procedures one category when patient-specific risk warrants

## References

- RAPM article ID `rapm-2024-105766`: https://rapm.bmj.com/content/early/2025/10/16/rapm-2024-105766
- ASRA public guideline page: https://asra.com/news-publications/asra-updates/blog-landing/guidelines/2025/01/31/regional-anesthesia-in-the-patient-receiving-antithrombotic-or-thrombolytic-therapy-american-society-of-regional-anesthesia-and-pain-medicine-evidence-based-guidelines-%28fifth-edition%29
- ASRA interventional spine and pain procedure anticoagulation guideline summary: https://asra.com/news-publications/asra-updates/blog-landing/guidelines/2022/12/14/interventional-spine-and-pain-procedures-in-patients-on-antiplatelet-and-anticoagulant-medications-%28second-edition%29
- OpenAnesthesia ASRA antithrombotic therapy summary, part 2: https://www.openanesthesia.org/keywords/regional-anesthesia-in-patients-receiving-antithrombotic-or-thrombolytic-therapy-part-2/
- NYSORA regional anesthesia in anticoagulated patients: https://www.nysora.com/topics/sub-specialties/regional-anesthesia-in-anticoagulated-patients/
