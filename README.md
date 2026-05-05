<h1 align="center">Lumena</h1>
<p align="center">A patient portal built on the Lumena design system.</p>

---

## What this is

Lumena's patient-facing portal — health records, care plan, messaging, scheduling. Forked from [medplum/foomedical](https://github.com/medplum/foomedical) (the Medplum team's open-source patient-app sample, Apache-2.0) and reskinned to the [Lumena design system](https://github.com/Lumena-Systems): warm-paper neutrals, deep ink text, twilight slate-teal brand, Newsreader / Inter Tight / IBM Plex Mono.

The backend is [Medplum](https://www.medplum.com) — FHIR R4, hosted or self-hosted. By default the app points at Medplum's hosted demo project; swap the IDs in `src/config.ts` to point at your own.

## Run locally

```sh
npm install
npm run dev          # vite dev server
npm run build        # tsc + vite build
npm run lint         # eslint v9 flat config
npm test             # jest
```

Sign in / register flow uses Medplum's hosted auth by default. To wire up a different project, register at [Medplum](https://www.medplum.com/docs/tutorials/register) and replace the values in `src/config.ts`.

## Layout

- `src/lumena/` — the design system: tokens (`tokens.css`), primitives (`Btn`, `Pill`, `Card`, `Eyebrow`, `Avatar`, `Icon`), the app shell (sidebar + topbar wired to react-router), and Mantine overrides (`mantine-overrides.css`) that pull `@medplum/react` internals onto Lumena tokens.
- `src/pages/` — patient-facing routes: home, health record, care plan, messages, get care, account, plus the landing + auth surfaces.
- `src/components/` — shared in-app chrome (`InfoSection`, `InfoButton`, `SideMenu`, `Loading`, `Footer`, `LineChart`).

## Acknowledgements

Built on [Medplum](https://www.medplum.com) and [FHIR](https://www.hl7.org/fhir/). Forked from [Foo Medical](https://github.com/medplum/foomedical) — the original sample is © Orangebot, Inc. and Medplum contributors, Apache-2.0.

## License

Apache-2.0. See `LICENSE.txt`.
