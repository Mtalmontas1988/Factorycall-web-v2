# i18n statinės analizės ataskaita

Data: 2026-08-02  
Apimtis: `components/**/*.tsx`, `hooks/**/*.tsx`.

Ši ataskaita yra RC3.1 automatinės paieškos pradinis sąrašas. Ji ieško JSX vaikų, `label`, `placeholder`, `title` ir pranešimų literalų. Dinaminiai duomenys, RTDB reikšmės, maršrutų adresai, spalvos ir techniniai `aria-*` atributai sąmoningai nevertinami kaip vertimo kandidatai. Kiekvieną rezultatą prieš migraciją reikia patvirtinti rankiniu būdu.

| Failas | Eilutė | Tekstas | Rekomenduojamas namespace |
| --- | ---: | --- | --- |
| `components/portal-shell.tsx` | 130 | Naujausi iškvietimai | dashboard |
| `components/portal-shell.tsx` | 130 | Paskutiniai sistemos atnaujinimai | dashboard |
| `components/portal-shell.tsx` | 130 | Ieškoti... | common |
| `components/portal-shell.tsx` | 139 | Loading būsena | common |
| `components/portal-shell.tsx` | 139 | Tuščia būsena | common |
| `components/portal-shell.tsx` | 139 | Klaidos būsena | common |
| `components/portal-shell.tsx` | 140 | Įrašų nerasta | common |
| `components/portal-shell.tsx` | 157 | Nepavyko įkelti Firebase duomenų | system |
| `components/company-management-module.tsx` | 23 | Nauja įmonė | companies |
| `components/company-management-module.tsx` | 23 | Ieškoti pagal pavadinimą, kodą ar kontaktus | companies |
| `components/company-management-module.tsx` | 23 | Pašalinti įmonę? | dialogs |
| `components/assets-module.tsx` | 28 | Redaguoti įrenginį | assets |
| `components/assets-module.tsx` | 28 | Pridėti įrenginį | assets |
| `components/assets-module.tsx` | 68 | Įrenginiai | assets |
| `components/assets-module.tsx` | 68 | Įkeliami įrenginiai… | common |
| `components/assets-module.tsx` | 68 | Įrenginių nerasta | assets |
| `components/live-calls-module.tsx` | 1 | Gyvi iškvietimai | liveCalls |
| `components/technicians-module.tsx` | 1 | Technikai | technicians |
| `components/admin-data-modules.tsx` | 1 | Paieška | common |
| `components/detailed-record-module.tsx` | 1 | Atšaukti | common |
| `hooks/use-factory-data.tsx` | 21 | Naujas | calls |
| `hooks/use-factory-data.tsx` | 82 | Tikrinama prieiga… | system |

## Išvada

RC3.1 šiame etape **nevertė** tekstų ir nekeičia i18n elgsenos. Lentelė skirta kitam vertimų migracijos etapui. Esama i18n infrastruktūra ir jau perkelti raktai lieka nepakitę.
