---
app_name: "HookStack"
title: "HookStack"
tagline: "A package that receives webhooks, stores them for later retrieval and then auto deletes."
theme_color: "#4998d5"
git: "https://github.com/tomcollis/HookStack"
homepage: "https://tcollis.co.uk/2023/hookstack/"
---

This app was created because I wanted to use webhooks with self-hosted apps and did not want the requirements of installing agents, opening firewall ports, needing a static IP or worrying about system uptime to ensure nothing is missed.

There are many services (free and chargeable) that provide a webhook relay service, but the ones I looked at just relayed the information to another webhook and many required agents or opening of ports, which did not solve my problem.

This service allows webhooks to be **Pushed** (submitted) and saved, and then **Pulled** (retrieved) at any time in the future. The webhooks can be tagged with a source system identifier (source-id), and then downloaded by source system, this allows different processes or tools to download the webhooks from specific systems.