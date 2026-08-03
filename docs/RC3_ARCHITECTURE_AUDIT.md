# RC3 architektūros auditas

## Įgyvendinta

- `Portal` vieną kartą kviečia `useFactoryData`, o `ActiveCompanyProvider` gauna jau prenumeruotą įmonių sąrašą.
- `NotificationsCenter`, Header varpelis ir Drawer naudoja vieną `NotificationsProvider` srautą.
- Šoninės navigacijos paspaudimai naudoja Next.js `router.push()`.
- Portalo MUI tema apibrėžia vienodus dialogų, Drawer, lentelių, mygtukų ir ikoninių mygtukų standartus.

## Rasti dubliavimai ir rekomendacijos

| Sritis | Radinys | Rekomenduojamas tolesnis veiksmas |
| --- | --- | --- |
| Drawer | `company-management-module.tsx` naudoja 620 px, kiti detalūs Drawer - 560 px. | Perkelti į vieną `StandardDrawer` komponentą. |
| CRUD | `record-management-module.tsx` ir `detailed-record-module.tsx` kartoja filtravimo, dialogų ir ištrynimo logiką. | Sujungti į konfigūruojamą CRUD komponentą. |
| Navigacija | Dashboard ir Login dar turi `window.location.assign()`. | Perkelti į `useRouter().push()`. |
| Įmonės kontekstas | Dalis modulių gauna visą `companies` masyvą per props. | Ateityje naudoti `useActiveCompany()` ten, kur reikia tik aktyvios įmonės. |

## i18n audito rezultatas

Vartotojui matomi hardcodinti tekstai dar randami šiuose failuose:

- `components/portal-shell.tsx`
- `components/live-calls-module.tsx`
- `components/technicians-module.tsx`
- `components/assets-module.tsx`
- `components/company-management-module.tsx`
- `components/admin-data-modules.tsx`
- `components/detailed-record-module.tsx`
- `hooks/use-factory-data.tsx`

Šiame RC3 etape tekstai nebuvo keičiami, nes i18n auditas yra informacinis.
# RC3.1 papildymas — 2026-08-02

## Užbaigta

- `window.location.assign()` ir `window.location.replace()` navigacijos srautai pakeisti `next/navigation` `router.push()` arba `router.replace()` srautais (Dashboard, pranešimų varpelis, prisijungimas ir prieigos apsauga).
- `ActiveCompanyProvider` yra vienas aktyvios įmonės šaltinis: jis teikia įmonių rinkinį, aktyvios įmonės ID, pavadinimą, logotipą, nustatymus, licenciją ir būsimų temų duomenis.
- Įmonių, ataskaitų ir įrenginių moduliai gauna įmonių sąrašą iš `useActiveCompany()`; jie nekuria papildomo `/companies` listenerio.
- Pridėti bendri `StandardDrawer` ir `StandardDialog` komponentai su vienu 600 px pločio, antraštės, uždarymo, scroll ir footer standartu.
- Portalo MUI temos nustatymai perkelti į `lib/theme/portal-theme.ts` ir naudojami `PortalShell`.
- Pridėta i18n statinės analizės ataskaita `docs/I18N_AUDIT.md`.

## RC4 darbai

- Laipsniškai pakeisti likusius konkrečių modulių `Drawer` ir `Dialog` panaudojimus į naujus standartinius apvalkalus, neprarandant jų specifinių formų.
- Perkelti `I18N_AUDIT.md` kandidatus į esamus vertimų namespace ir po migracijos atlikti naudojamų / nenaudojamų raktų patikrą.
- ActiveCompanyProvider įmonių kolekcija šiuo metu vieną kartą paduodama iš portalo duomenų šaknies; jei vėliau bus atsieta `useFactoryData`, kolekcijos listenerį reikia perkelti tiesiai į šį providerį, išlaikant vieną prenumeratą.
