# FactoryCall Web Assets modulis

## Firebase modelis

Modulis naudoja tik esamą Realtime Database šaką `/assets/{assetId}`. Įrašas turi laukus `id`, `company`, `line`, `name`, `code`, `serialNumber`, `manufacturer`, `model`, `location`, `description`, `installationDate`, `warrantyUntil`, `status`, `qrCode`, `createdTime` ir `updatedTime`. Web modulis nekeičia šios struktūros.

## Architektūra

- `types/firebase-models.ts` – Android suderinamas `Asset` ir `AssetStatus` tipas.
- `lib/firebase/assets-service.ts` – vienintelė vieta, kur Assets modulis naudoja Firebase `ref`, `onValue`, `push`, `set`, `update` ir `remove`.
- `hooks/use-assets.ts` – realtime prenumeratos būsenos sluoksnis. Unsubscribe iškviečiamas komponentui išsijungus.
- `components/assets-module.tsx` – sąrašas, filtrai, CRUD dialogai, detalės ir pranešimai.

## Ekranai ir srautai

`/irenginiai` pateikia responsive MUI lentelę, paiešką, filtrus, rezultatų skaičių, tuščią, įkėlimo ir klaidos būsenas. Kūrimo bei redagavimo dialogas validuoja įmonę, liniją, pavadinimą, būseną ir datas. Šalinimas reikalauja patvirtinimo; Firebase įrašas šalinamas tik patvirtinus.

Detalės dialoge informacija suskirstyta į pagrindinę, techninę, eksploatacijos ir QR sekcijas. QR reikšmė pateikiama kaip tekstas su kopijavimo veiksmu. QR paveikslėlis sąmoningai nepridėtas, nes projekte nėra tam skirtos bibliotekos.

## Filtrai ir indikatoriai

Paieška vykdoma pagal pavadinimą, kodą, serijos numerį, gamintoją, modelį ir vietą. Filtrai pagal įmonę, liniją ir būseną skaičiuojami su `useMemo`. Būsenos rodomos lietuviškai: Aktyvus, Aptarnaujamas ir Neaktyvus. Garantija saugiai apdoroja tuščią arba neteisingą datą, perspėja likus 30 dienų ir išskiria pasibaigusią garantiją.

## Dashboard ir navigacija

Mini Drawer turi naują punktą „Įrenginiai“, kuris veikia suskleistame bei išskleistame režimuose. Dashboard rodo bendrą, aktyvių, aptarnaujamų ir neaktyvių įrenginių KPI. KPI veda į `/irenginiai`.

## Rizikos ir būsima integracija

Šalinimo metu modulis negali saugiai patikrinti ryšių su `/calls` ar `/preventiveWorks`, nes šių ryšių laukai nėra patvirtinti šiame etape. Todėl UI pateikia šią riziką prieš šalinimą. Ateityje galima pridėti tik skaitymo ryšių patikrą, gedimų istoriją, prevencinių darbų sąrašą, MTTR ir MTBF statistiką, nekeičiant Assets modelio.
