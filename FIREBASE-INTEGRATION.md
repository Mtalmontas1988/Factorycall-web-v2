# FactoryCall Firebase integracija

Web portalas naudoja tas pačias Android Realtime Database šakas: `calls`, `technicians`, `operators`, `companies`, `lines`, `problems`, `users` ir `tokens`.

## Režimai

- Be `NEXT_PUBLIC_FIREBASE_*` reikšmių: saugus demonstracinis fallback režimas.
- Su užpildytu `.env.local`: Firebase Authentication ir Realtime Database listeneriai.

## Prieiga

Portalas leidžia roles `admin`, `administrator`, `vadovas` ir `manager`, nuskaitytas iš `/users/{uid}/role`.

## Esamos Android šakos

`/calls/{id}` paliekami Android laukai: `company`, `line`, `problem`, `description`, `technician`, `operator`, `priority`, `photo`, `photoAfterRepair`, `technicianComment`, `date`, `time`, `status`, `acceptedTime`, `arrivedTime`, `startedRepairTime`, `completedTime`, `createdTime`, `responseTime`, `travelTime`, `repairTime`, `totalDowntime`.

`sandelys`, `prevenciniai-darbai` ir `pranesimai` šiuo metu neturi atitinkamų pateiktų Android Firebase šakų. Jie sąmoningai paliekami demonstraciniai, kol bus patvirtintos esamos jų šakos arba papildoma duomenų struktūra.

## Taisyklės

Rekomenduojamos taisyklės pateiktos `firebase-database.rules.example.json`. Tai pavyzdys peržiūrai — jos nėra automatiškai publikuojamos į Firebase Console.
