---
label: Troubleshooting
description: Symptoms, causes, and fixes for common @fsegurai/scrollspy problems.
order: 3
tags: [ "help", "troubleshooting" ]
---

# Troubleshooting

| Symptom | Likely cause | Fix |
|---------|--------------|-----|
| Nothing is ever highlighted | The nav selector matched nothing when the constructor ran | Create the instance after the nav exists, or call `spy.init()` later |
| Some links never highlight | Fragment does not match any element `id` | Check `href="#id"` against the target's `id` |
| Links with `fragmentAttribute` are ignored | `navItemSelector` still defaults to `a[href*="#"]` | Set `navItemSelector` (for example `'a'`) |
| Section activates too late under a fixed header | No offset | Set `offset` to the header height |
| Offset seems ignored or nothing activates | `offset` was passed as a function | Pass a number; 1.0.x does not call offset functions |
| Last section never activates | Page cannot scroll far enough | Keep or raise `bottomThreshold` (default `100`) |
| A different section activates near the bottom | `bottomThreshold` activates the last section | Lower `bottomThreshold` or set it to `0` |
| New sections are not tracked | Map was built before they existed | Call `spy.refresh()` or use `observe: true` |
| Highlight is wrong after resizing | Detection only runs on scroll | Set `reflow: true` |
| A nested parent keeps `active-parent` | Deactivation removes `nestedClass` only from elements that also have `active` | In a `gumshoeactivate` listener, remove `nestedClass` from `<li>` elements that do not contain `event.detail.nav` |
| A `gumshoedeactivate` listener never runs | 1.0.x never dispatches it, despite the README | Track the previous section yourself in a `gumshoeactivate` listener |
| `TypeError` reading `content` on load | No link maps to a section and the page is within `bottomThreshold` of the bottom | Fix the fragments so at least one section resolves, or set `bottomThreshold: 0` |
| TypeScript error on `spy.nav` or `spy.destroyListeners()` | Not declared in `index.d.ts` | Query the nav yourself; call `destroy()` instead |
| Duplicate events / work | `init()` called twice or old instance not destroyed | Call `destroy()` before re-creating |

## Still stuck?

Open an issue at [github.com/fsegurai/scrollspy/issues](https://github.com/fsegurai/scrollspy/issues) with a minimal
reproduction.
