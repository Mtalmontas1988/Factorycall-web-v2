# Notifications Center

Naudojama tik `/notifications/{id}` šaka. Servisas prenumeruoja `recipientUserId`, atmeta `dismissed: true` ir niekada nenaudoja `remove()`.

`subscribeNotifications`, `getNotificationById`, `markNotificationRead`, `markAllNotificationsRead`, `dismissNotification` ir `dismissReadNotifications` apdoroja tik skaitymo bei soft-delete laukus.

`useNotifications` atstato Firebase Auth sesiją, filtruoja pagal prisijungusio naudotojo UID, saugiai atjungia realtime listenerį ir per `useMemo` apskaičiuoja neperskaitytų skaičių.

`/pranesimai` rodo paiešką, būsenos bei laikotarpio filtrus, rezultatų skaičių, grupes Šiandien/Vakar/Senesni, kortelių veiksmus ir loading, empty bei klaidos būsenas.

Eventų navigacija: call įvykiai veda į Iškvietimus, `call_completed` – į Istoriją, prevencijos įvykiai – į Prevencinius darbus, nežinomi – į Pranešimus. Konkretūs detalių maršrutai šiame portale dar neegzistuoja, todėl jie sąmoningai nekuriami.

Rizika: masinis „Išvalyti perskaitytus“ vykdomas individualiais soft-delete atnaujinimais; daug įrašų turinčiai šakai ateityje verta naudoti vieną daugialypį Firebase update.
