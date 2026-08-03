# RC3 i18n apimties auditas

Data: 2026-08-03

## Patikrinti moduliai

| Modulis | Būsena | Pastaba |
| --- | --- | --- |
| Dashboard | Migracija baigta | Visi statiniai vartotojo tekstai naudoja `t(...)`. |
| Login | Migracija baigta | Formos, klaidų ir režimo tekstai naudoja `t(...)`. |
| Notifications | Migracija baigta | Centras ir Header varpelis naudoja `t(...)`. |
| Settings | Nėra atskiro komponento | Maršrutas šiuo metu naudoja bendrą PortalShell modulio vaizdą. |
| Company | Reikia užbaigti | Žr. toliau. |

## Likę Company modulio literalai

`components/company-management-module.tsx` vis dar turi perkelti šiuos vartotojui matomus tekstus: formos laukų pavadinimus, lentelės stulpelius, paieškos placeholder, validacijos klaidas, Drawer antraštes, veiksmų mygtukus, įmonės šalinimo dialogą ir Snackbar pranešimus.

Jiems jau yra paruošti pagrindiniai raktai `company.*`, `common.*` ir `crud.*` `locales/lt/common.json`; pilną vertimų migraciją būtina atlikti kartu su failo JSX performatavimu, nes dabartinis komponentas suglaudintas į vieną eilutę.

## Kalbos

`i18n-provider.tsx` saugiai naudoja lietuvių kalbos fallback, kai pasirinktoje kalboje trūksta rakto. Užtikrinant pilnus vertimus, kitame etape reikia sulyginti `common.json` raktų rinkinius šioms kalboms: `en`, `pl`, `de`, `lv`, `et`, `uk`.
