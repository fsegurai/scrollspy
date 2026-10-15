---
label: Troubleshooting
description: Symptoms, causes, and fixes for common @fsegurai/scrollspy problems.
order: 2
tags: [ "help", "troubleshooting" ]
---

# Troubleshooting

| Symptom | Likely cause | Fix |
|---------|--------------|-----|
| Nothing is ever highlighted | The nav selector matched nothing when the constructor ran (`spy.nav` is `null`) | Create the instance after the nav exists, or call `spy.init()` later |
| Some links never highlight | Fragment does not match any element `id` | Check `href="#id"` against the target's `id` |
| Links with `fragmentAttribute` are ignored | `navItemSelector` still defaults to `a[href*="#"]` | Set `navItemSelector` (for example `'a'`) |
| Section activates too late under a fixed header | No offset | Set `offset` to the header height |
| Last section never activates | Page cannot scroll far enough | Keep or raise `bottomThreshold` (default `100`) |
| A different section activates near the bottom | `bottomThreshold` activates the last section | Lower `bottomThreshold` or set it to `0` |
| New sections are not tracked | Map was built before they existed | Call `spy.refresh()` or use `observe: true` |
| Highlight is wrong after resizing | Detection only runs on scroll | Set `reflow: true` |
| A nested parent keeps `active-parent` | Deactivation removes `nestedClass` only from elements that also have `active` | Clear stale parent classes in a `gumshoedeactivate` listener |
| Duplicate events / work | `init()` called twice or old instance not destroyed | Call `destroy()` before re-creating |

## Still stuck?

Open an issue at [github.com/fsegurai/scrollspy/issues](https://github.com/fsegurai/scrollspy/issues) with a minimal
reproduction.
