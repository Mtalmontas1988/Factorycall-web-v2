import { AutoAwesomeOutlined, BuildOutlined, BusinessOutlined, HistoryOutlined, Inventory2Outlined, InsightsOutlined, NotificationsNoneOutlined, PeopleAltOutlined, PersonOutlineOutlined, PictureAsPdfOutlined, PlaylistAddCheckOutlined, PrecisionManufacturingOutlined, SettingsOutlined, SupportAgentOutlined, TimelineOutlined, WarningAmberOutlined } from '@mui/icons-material';
import type { PortalModule } from './portal-types';

const callRows = [
  ['FC-2084', 'Konvejerio juostos poslinkis', 'Pakavimo linija 02', 'Aukštas', 'Vykdomas', 'prieš 8 min.'],
  ['FC-2083', 'Pneumatinio cilindro gedimas', 'Surinkimo linija 01', 'Kritinis', 'Naujas', 'prieš 19 min.'],
  ['FC-2082', 'Temperatūros daviklio klaida', 'Dažymo linija 03', 'Vidutinis', 'Laukia dalių', 'prieš 42 min.'],
  ['FC-2081', 'Neįprastas guolio garsas', 'Pakavimo linija 01', 'Žemas', 'Uždarytas', 'prieš 1 val.'],
  ['FC-2080', 'Variklio perkaitimas', 'Ekstruzijos linija 01', 'Aukštas', 'Vykdomas', 'prieš 2 val.'],
  ['FC-2079', 'Apsauginio daviklio klaida', 'Pakavimo linija 02', 'Vidutinis', 'Uždarytas', 'vakar']
];

const genericRows = [
  ['FC-001', 'Aktyvus įrašas', 'Gamyba A', 'Aukštas', 'Aktyvus', 'šiandien'],
  ['FC-002', 'Planuojamas veiksmas', 'Gamyba B', 'Vidutinis', 'Vykdomas', 'šiandien'],
  ['FC-003', 'Sistemos įrašas', 'Gamyba A', 'Žemas', 'Uždarytas', 'vakar'],
  ['FC-004', 'Reikalingas patvirtinimas', 'Gamyba C', 'Aukštas', 'Naujas', 'liep. 24'],
  ['FC-005', 'Periodinis patikrinimas', 'Gamyba B', 'Vidutinis', 'Aktyvus', 'liep. 23'],
  ['FC-006', 'Atnaujintas įrašas', 'Gamyba A', 'Žemas', 'Uždarytas', 'liep. 22']
];

export const modules: PortalModule[] = [
  { slug: 'is-kvietimai', label: 'Iškvietimai', singular: 'iškvietimą', icon: SupportAgentOutlined, description: 'Visi gedimų ir techninės priežiūros iškvietimai.', columns: ['Numeris', 'Gedimas', 'Linija', 'Prioritetas', 'Būsena', 'Atnaujinta'], rows: callRows },
  { slug: 'gyvi-is-kvietimai', label: 'Gyvi iškvietimai', singular: 'gyvą iškvietimą', icon: TimelineOutlined, description: 'Realiu laiku stebimi šiuo metu vykdomi darbai.', columns: ['Numeris', 'Gedimas', 'Linija', 'Prioritetas', 'Būsena', 'Pradėta'], rows: callRows.filter(row => row[4] !== 'Uždarytas') },
  { slug: 'istorija', label: 'Istorija', singular: 'istorijos įrašą', icon: HistoryOutlined, description: 'Uždarytų iškvietimų ir atliktų veiksmų archyvas.', columns: ['Numeris', 'Gedimas', 'Linija', 'Prioritetas', 'Būsena', 'Uždaryta'], rows: callRows.filter(row => row[4] === 'Uždarytas') },
  { slug: 'statistika', label: 'Statistika', singular: 'ataskaitą', icon: InsightsOutlined, description: 'Patikimumo, prastovų ir darbų efektyvumo analizė.', columns: ['Rodiklis', 'Reikšmė', 'Linija', 'Pokytis', 'Būsena', 'Laikotarpis'], rows: genericRows },
  { slug: 'ataskaitos', label: 'Ataskaitos', singular: 'ataskaitą', icon: PictureAsPdfOutlined, description: 'PDF, Excel ir CSV ataskaitų eksportas.', columns: [], rows: [] },
  { slug: 'technikai', label: 'Technikai', singular: 'techniką', icon: PeopleAltOutlined, description: 'Technikų kompetencijos, prieinamumas ir darbo apkrova.', columns: ['ID', 'Technikas', 'Komanda', 'Prioritetas', 'Būsena', 'Atnaujinta'], rows: [['T-001', 'Mantas Jankauskas', 'Mechanika', 'Aukštas', 'Aktyvus', 'šiandien'], ['T-002', 'Tomas Vaitkus', 'Elektrika', 'Vidutinis', 'Aktyvus', 'šiandien'], ...genericRows.slice(2)] },
  { slug: 'operatoriai', label: 'Operatoriai', singular: 'operatorių', icon: PersonOutlineOutlined, description: 'Operatorių sąrašas, pamainos ir registruoti pranešimai.', columns: ['ID', 'Operatorius', 'Padalinys', 'Pamaina', 'Būsena', 'Atnaujinta'], rows: [['O-001', 'Aistė Petrauskė', 'Pakavimas', 'Rytinė', 'Aktyvus', 'šiandien'], ['O-002', 'Rokas Žukauskas', 'Surinkimas', 'Naktinė', 'Aktyvus', 'šiandien'], ...genericRows.slice(2)] },
  { slug: 'imones', label: 'Įmonės', singular: 'įmonę', icon: BusinessOutlined, description: 'Įmonių, padalinių ir atsakingų kontaktų valdymas.', columns: ['Kodas', 'Įmonė', 'Vieta', 'Prioritetas', 'Būsena', 'Atnaujinta'], rows: [['FC-LT', 'FactoryCall Lietuva', 'Kaunas', 'Aukštas', 'Aktyvus', 'šiandien'], ['FC-LV', 'FactoryCall Latvija', 'Ryga', 'Vidutinis', 'Aktyvus', 'vakar'], ...genericRows.slice(2)] },
  { slug: 'linijos', label: 'Linijos', singular: 'liniją', icon: PrecisionManufacturingOutlined, description: 'Gamybos linijų būklė, kritiškumas ir aktyvūs darbai.', columns: ['Kodas', 'Linija', 'Įmonė', 'Kritiškumas', 'Būsena', 'Atnaujinta'], rows: [['L-02', 'Pakavimo linija 02', 'FactoryCall Lietuva', 'Aukštas', 'Vykdomas', 'prieš 8 min.'], ['L-01', 'Surinkimo linija 01', 'FactoryCall Lietuva', 'Kritinis', 'Naujas', 'prieš 19 min.'], ...genericRows.slice(2)] },
  { slug: 'gedimai', label: 'Gedimai', singular: 'gedimą', icon: WarningAmberOutlined, description: 'Gedimų katalogas, priežastys ir sprendimo gairės.', columns: ['Kodas', 'Gedimas', 'Kategorija', 'Kritiškumas', 'Būsena', 'Atnaujinta'], rows: genericRows },
  { slug: 'irenginiai', label: 'Įrenginiai', singular: 'įrenginį', icon: BuildOutlined, description: 'Gamybos įrenginių registras ir eksploatacijos būklė.', columns: [], rows: [] },
  { slug: 'sandelys', label: 'Sandėlis', singular: 'sandėlio įrašą', icon: Inventory2Outlined, description: 'Atsargos, minimalūs likučiai, nurašymai ir tiekėjai.', columns: ['SKU', 'Detalė', 'Sandėlis', 'Likutis', 'Būsena', 'Atnaujinta'], rows: [['SKU-001', 'Guolis 6204', 'Pagrindinis', '48 vnt.', 'Aktyvus', 'šiandien'], ['SKU-002', 'Pneumatinis cilindras', 'Pagrindinis', '2 vnt.', 'Mažas likutis', 'šiandien'], ...genericRows.slice(2)] },
  { slug: 'prevenciniai-darbai', label: 'Prevenciniai darbai', singular: 'prevencinį darbą', icon: PlaylistAddCheckOutlined, description: 'Periodiniai planai, kontroliniai sąrašai ir terminai.', columns: ['Kodas', 'Darbas', 'Linija', 'Periodiškumas', 'Būsena', 'Terminas'], rows: genericRows },
  { slug: 'ai', label: 'AI', singular: 'AI užklausą', icon: AutoAwesomeOutlined, description: 'Gedimų analizė, rekomendacijos ir žinių bazės paieška.', columns: ['ID', 'Užklausa', 'Kontekstas', 'Prioritetas', 'Būsena', 'Atnaujinta'], rows: genericRows },
  { slug: 'vartotojai', label: 'Vartotojai', singular: 'vartotoją', icon: PeopleAltOutlined, description: 'Firebase vartotojų rolės ir prisijungimo būsena.', columns: ['ID', 'Vardas', 'El. paštas', 'Rolė', 'Būsena', 'Papildomai'], rows: [] },
  { slug: 'administratoriai', label: 'Administratoriai', singular: 'administratorių', icon: PeopleAltOutlined, description: 'Administratorių paskyros ir prieigos.', columns: [], rows: [] },
  { slug: 'roles', label: 'Rolės ir teisės', singular: 'rolę', icon: SettingsOutlined, description: 'Vartotojų rolės ir įmonių prieiga.', columns: [], rows: [] },
  { slug: 'fcm-diagnostika', label: 'FCM diagnostika', singular: 'FCM įrenginį', icon: NotificationsNoneOutlined, description: 'Registruotų pranešimų įrenginių diagnostika.', columns: [], rows: [] },
  { slug: 'pranesimai', label: 'Pranešimai', singular: 'pranešimą', icon: NotificationsNoneOutlined, description: 'Sistemos, SLA ir komandos pranešimų centras.', columns: ['ID', 'Pranešimas', 'Šaltinis', 'Prioritetas', 'Būsena', 'Laikas'], rows: genericRows },
  { slug: 'nustatymai', label: 'Nustatymai', singular: 'nustatymą', icon: SettingsOutlined, description: 'Vartotojai, rolės, SLA, katalogai ir integracijų paruošimas.', columns: ['Kodas', 'Nustatymas', 'Kategorija', 'Reikšmė', 'Būsena', 'Atnaujinta'], rows: genericRows }
];

export const getModule = (slug: string) => modules.find(item => item.slug === slug);
