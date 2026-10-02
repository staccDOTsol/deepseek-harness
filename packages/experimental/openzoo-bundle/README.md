---
description: "Add zkAPI and OpenAnonymity model routes to the Web composition from the plugin manager."
kind: "package-bundle"
---

# @deepseek-ai/dsh-experimental-openzoo-bundle

English

## Summary

This optional bundle configures the shipped `llm-pi-ai` row with two OpenAI Chat Completions routes: `zkapi`, served by the local zkapi-clientd API, and `openanonymity`, mirroring OA Chat's shipped OpenRouter backend defaults. Shipped profiles leave it switched off.

## Table of Contents

- [Use this package](#use-this-package)
- [Understand the implementation](#understand-the-implementation)
- [Further Exploration](#further-exploration)
- [Model Experience](#model-experience)
- [Known Limitations and Deferred Work](#known-limitations-and-deferred-work)
- [Dev Note](#dev-note)

-----

<a id="use-this-package"></a>
## Use this package

Open Plugins in the Web sidebar and enable OpenZoo routes. Start `zkapi-clientd serve` before selecting the `zkapi` route; the route reads the local API at `http://127.0.0.1:8787/v1`. The daemon remains the owner of wallet setup, anonymous key leases, settlement, and its opt-in leCore context-recall setting. Select the `openanonymity` route when the deployment should use OA Chat's OpenRouter backend defaults; store `OPENROUTER_API_KEY` through the Models page or the launching environment. Use Settings → Models to fetch the endpoint's model list when the local zkapi-clientd catalog differs from the two declared starter models.

-----

<a id="understand-the-implementation"></a>
## Understand the implementation

<details>
<summary>Maintainer details — click to expand</summary>

`cordis.patch.yml` targets the existing `llm-pi-ai` row and replaces its config with the two provider profiles. `OPTIONAL_BUNDLES` in `packages/boot/app-boot/src/profile.ts` names this package and `apps/cli` depends on it, so every installation ships it switched off and the plugin manager offers it in the Official group. Selecting it appends the bundle to the profile's `dsh.profile.bundles` list. No runtime invariant companion is published because this configuration-only package owns no mutable runtime state.

| File | Role |
|---|---|
| [`cordis.patch.yml`](cordis.patch.yml) | Configures the `zkapi` and `openanonymity` provider profiles on `llm-pi-ai` |
| [`package.json`](package.json) | Names the configured adapter package as the bundle dependency |
| [`locale/en.json`](locale/en.json), [`locale/zh.json`](locale/zh.json) | Plugin-manager title and description |
| [`icon.svg`](icon.svg) | Plugin-manager icon |
| [`src/index.ts`](src/index.ts) | Empty module entry; the patch is the runtime content |

</details>

-----

<a id="further-exploration"></a>
## Further Exploration

- [Configure models](../../../docs/user/guide/providers.md) — provider settings, custom model APIs, and model discovery.
- [zkapi-clientd](https://github.com/ethereum/zkapi/tree/main/zkapi-clientd) — the local OpenAI-compatible API, wallet configuration, and leCore context-recall option.
- [OA Chat](https://github.com/OpenAnonymity/oa-chat) — the browser client whose OpenRouter backend defaults the `openanonymity` route mirrors.

-----

<a id="model-experience"></a>
## Model Experience

### zkAPI and OpenAnonymity routes

#### What the model sees

The model receives the same Harness request it would receive through another pi-ai route. This bundle changes only the provider route and endpoint; it does not add tools, system-prompt text, or a Harness-side history rewrite. On the `zkapi` route, zkapi-clientd receives the request at its local API and may apply its own opt-in leCore context recall before paid inference.

#### Token effect

Selecting the bundle makes two provider routes and their declared starter models available in model pickers. It adds no tool schemas and no durable context messages. A request sent through zkapi-clientd can use fewer provider input tokens when the daemon's leCore recall selects a smaller relevant history; the Harness session log still retains the full conversation.

#### KV Cache effect

The provider route changes the request destination and model identity. Existing provider-side cache entries for other routes do not apply to these routes.

## Known Limitations and Deferred Work

<a id="known-limitations-and-deferred-work"></a>

- The `zkapi` route requires a running zkapi-clientd whose `/v1/models` catalog contains the selected model, or a model added through Settings → Models discovery. The bundle does not install, fund, configure, or start that daemon.
- The Harness does not apply leCore to agent-loop history. leCore recall for this composition is the zkapi-clientd option on the `zkapi` route; OA Chat's browser-local switch remains in OA Chat.
- The `openanonymity` route mirrors OA Chat's shipped OpenRouter backend, not the unimplemented Enclaved Station or Provider Direct backend stubs.

-----

<a id="dev-note"></a>
### Dev Note

<details>
<summary>Maintainer details — click to expand</summary>

None.

</details>
