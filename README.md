# n8n-nodes-opencode-go

n8n community node for [OpenCode Go](https://opencode.ai/go) — a low-cost AI provider with access to open-source coding models.

## Nodes

This package includes two chat model nodes:

### OpenCode Go Chat Model (`LmChatOpenCodeGo`)
OpenAI-compatible. Supports all Go models served via `/v1/chat/completions`: DeepSeek V4 Pro/Flash, GLM-5/5.1, Kimi K2.5/K2.6, MiMo-V2.5/Pro, Qwen3.5 Plus/3.6 Plus.

**Extra parameters:** Reasoning Effort (none/low/medium/high/max), Top K, Custom Headers

### OpenCode Go Chat Model (Anthropic) (`LmChatOpenCodeGoAnthropic`)
Anthropic-compatible. Supports MiniMax M2.5 and M2.7 via `/v1/messages`.

**Extra parameters:** Thinking Mode + Budget Tokens, Top K, Custom Headers

## Credential

Both nodes share a single `OpenCodeGoApi` credential with an API Key field. Get your key at [opencode.ai/auth](https://opencode.ai/auth).

## Installation

```bash
npm install n8n-nodes-opencode-go
```

Then restart n8n. The nodes appear under AI → Language Models.

## Build

```bash
npm run build
```

## Test

```bash
npm test
```

## License

MIT
