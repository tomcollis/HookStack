---
app_name: "HookStack"
title: "HookStack"
tagline: "This app stores webhooks for later retrieval and then auto deletes."
theme_color: "#4998d5"
git: "https://github.com/tomcollis/HookStack"
homepage: "https://tcollis.co.uk/2023/hookstack/"
---

This service allows webhooks to be **Pushed** (submitted) and saved, and then **Pulled** (retrieved) at any time in the future. The webhooks can be tagged with a source system identifier (source-id), and then downloaded by source system, this allows different processes or tools to download the webhooks from specific systems.

This app/service was created because I wanted to use webhooks with self-hosted apps and did not want the requirements of installing agents, opening firewall ports or needing a static IP and having the system be available 24/7 to ensure no webhooks are missed. There are many services (free and chargeable) that provide a webhook relay service, but the ones I looked at just relayed the information to another webhook, which did not solve my problem.

This service can also be used with some cloud hosted automation services that do not allow webhooks but do allow scheduled get requests (e.g., Microsoft Power Automate).
