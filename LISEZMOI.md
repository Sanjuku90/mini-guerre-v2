# Mini Guerre — jeu + serveur multijoueur

Un seul serveur fait tout : il héberge le jeu ET relaie les joueurs. Aucune dépendance à installer.

## Mettre en ligne (gratuit, ~5 min)
1. Crée un compte sur github.com, puis un dépôt « mini-guerre » et envoie-y tous ces fichiers
   (le dossier `public`, `server.js`, `package.json`).
2. Crée un compte sur render.com → New → Web Service → choisis ton dépôt.
   - Runtime : Node
   - Build Command : (laisser vide)
   - Start Command : `node server.js`
   - Plan : Free
3. Render te donne un lien du genre `https://mini-guerre.onrender.com`. C'est le lien du jeu : envoie-le à tes amis.

Le plan gratuit s'endort normalement après ~15 min sans visite. Le serveur se **ping maintenant lui-même**
toutes les 10 min (via `RENDER_EXTERNAL_URL`, fourni automatiquement par Render) : il ne devrait plus s'endormir.
Si jamais il s'endort quand même (redémarrage, etc.), ajoute un ping externe gratuit (UptimeRobot, cron-job.org)
sur `https://TON-SITE.onrender.com/healthz` toutes les 5 min. Le plan gratuit offre 750 h/mois, assez pour 1 service 24h/24.

## Jouer à plusieurs
Tout le monde ouvre le lien, tape le même code de salle (16 joueurs max) et choisit son équipe :
même couleur = alliés (pas de tirs amis). 1v1, 1v2, 1v4, 2v2, 4v4… à vous de répartir les équipes.
Il faut aussi choisir la même carte et le même mode de construction.

## Installer comme une app
- Android (Chrome) : menu ⋮ → « Installer l'application ».
- iPhone (Safari) : Partager → « Sur l'écran d'accueil ».

## Tester chez toi
`node server.js` puis ouvre http://localhost:3000 (ou l'adresse IP de ton PC sur le Wi-Fi depuis un autre appareil).

## Nouveautés (version compétitive)
- Manches : « Premier à 10/20/30/50 kills » (total d'équipe en mode équipes), écran de fin, nouvelle manche automatique après 10 s.
- Spawn loin des ennemis, tir à la tête ×1,5, hit markers + dégâts affichés, indicateur de direction des tirs, série de kills et multi-kills, « Éliminé par … ».
- Dash (Maj / bouton 💨 sur mobile / B sur manette), minimap (alliés + ennemis proches), tableau des scores (Tab), molette = arme.
- ⚙️ Réglages : volume, secousse d'écran, viseur (forme + couleur), FPS/ping, touches PC entièrement modifiables (AZERTY reconnu).
- Manette compatible (A jetpack, B dash, X recharger, Y construire, RT tirer, LT lunette, RB grenade, LB arme, R3 pioche, Start menu).
- Ping affiché (réglages), vibrations sur mobile.

Fichiers modifiés par rapport à la version précédente : server.js, public/index.html, public/net.js, public/sw.js.

## Nouveautés (version « rendu pro »)
- Nouveau menu : aperçu image de chaque carte, miniatures, flèches ← → (ou balayage), carte choisie mémorisée.
- Écran « Destination » avant chaque partie (image + description de la carte).
- 11 cartes : + Désert, Glacier, Jungle, Volcan (lave), Toits de la ville. Décors animés par thème (lune/étoiles, neige, braises, pluie, feuilles…).
- Plateformes texturées (herbe, glace, fenêtres des immeubles), lave/brume dans le vide, HUD, minimap et fil d'actions refaits.
- Anti-veille Render intégré (auto-ping de `/healthz`).

Fichiers modifiés : server.js, public/index.html, public/sw.js, LISEZMOI.md.

## Nouveautés (lot 1 : classes, power-ups, bots)
- **Classes** (menu → « Classe ») avec capacité spéciale, touche **Q** (réglable) ou bouton ✨ sur mobile :
  - 🪖 Soldat : équilibré, pas de capacité.
  - 🎯 Sniper : 80 PV, fusil de précision, **mine** (3 max, se pose au sol).
  - 🛡️ Tank : 160 PV mais lent, **bouclier** 5 s (−70 % de dégâts).
  - 🛰️ Éclaireur : 85 PV, très rapide, **drone espion** 9 s (ennemis révélés à l'écran et sur la minimap).
  - 💚 Soigneur : **onde de soin** (+45 PV) pour toi et tes alliés d'équipe proches.
- **Power-ups sur la carte** (réapparition 22 s) : ❤️ soin, 🛡️ bouclier, 💥 double dégâts, ⚡ vitesse, 🔫 munitions. Les bots les ramassent aussi.
- **Bots** : niveaux Facile / Normal / Difficile (précision, anticipation du tir, portée, vitesse, PV, grenades, usage des capacités). Les bots ont aussi une classe aléatoire.
- Multijoueur : classes, mines, soins et power-ups sont synchronisés via le relais existant (le serveur n'a pas changé).
- Fichiers modifiés : public/index.html, public/sw.js, LISEZMOI.md.

## Nouveautés (v6 : modes, armes, éditeur)
Tout est dans le nouveau fichier `public/extras.js` (chargé après le jeu). Fichiers modifiés : `index.html` (1 ligne), `sw.js`, `LISEZMOI.md`. Le serveur n'a pas changé.
- **Modes** (menu → « Mode de jeu », à choisir identique pour tout le monde dans une salle : il fait partie du nom de salle) :
  - 🚩 Capture de drapeau (Bleus vs Rouges, 3 captures) · 👑 Roi de la colline (90 s de présence) · ⚔️ Deathmatch par équipes à vies limitées (10 en solo, 15 en salle par équipe)
  - 🏝️ Battle Royale : une vie, zone rouge qui rétrécit (manche de 4 min synchronisée sur l'horloge en salle)
  - 🧟 Zombies : vagues croissantes, 3 vies de renfort. En salle, chaque joueur a sa propre horde (les zombies ne sont pas partagés entre joueurs).
  - En solo, CTF et Deathmatch d'équipes = toi (Bleus) contre 2 bots (Rouges). Les bots ne portent pas encore le drapeau.
- **Atelier d'armes** : 6 skins (Néon, Or, Camouflage, Rubis, Arc-en-ciel), silencieux, chargeur étendu (+50 %). Visibles seulement chez toi.
- **Killstreaks** : série de 3 = 🛰️ drone espion ; séries de 5 et 10 = ✈️ frappe aérienne (touche **H** ou bouton ✈️), synchronisée en salle.
- **Éditeur de cartes** (menu → 🛠️) : plateformes (glisser), spawns, gomme, thème, taille, vide mortel. ▶ Tester, 💾 Utiliser, 📋 Code de partage (`MG1.…`) et 📥 Importer. La carte perso est mémorisée sur l'appareil. En salle, les joueurs doivent importer le même code (le code est ajouté au nom de salle).

## Nouveautés (v7 : progression, social, classé)
Nouveau fichier `public/extras2.js` ; `server.js` et `net.js` évoluent un peu (hôte de salle, exclusion, signalements).
- **Pièces, XP, niveaux** : +2 pièces par kill, +5 par manche, +15 en cas de victoire, bonus de vagues en mode Zombies. Tout est stocké sur l'appareil (localStorage) : un joueur technique peut le modifier, ce n'est donc pas anti-triche.
- **Boutique** (menu → Profil & boutique) : avatars, couleurs de personnage, traînées de dash, emotes (4 emplacements, touches 7 8 9 0 ou boutons à droite), skins d'arme (verrouillés dans l'atelier tant que non achetés), titres (certains se débloquent par les stats).
- **Profil** : pseudo, avatar, titre, drapeau, niveau, rang. Avatar, drapeau, titre, niveau et traînée de dash sont visibles chez les autres joueurs.
- **Chat** : bouton ✉️ ou Entrée = message libre (80 caractères) + 8 messages rapides. **Pings** : bouton 📍 puis toucher la carte, ou clic molette ; flèche sur le bord si hors écran, visibles par ton équipe.
- **Modération** (Profil & boutique → Salle) : muet local, signalement (plusieurs signalements distincts = exclusion automatique), exclusion par l'hôte de la salle (premier arrivé, transmis au suivant s'il part). Un joueur exclu est banni de la salle (par adresse) tant qu'elle existe.
- **Partie classée** : salles par niveau (tranches d'ELO de 250), carte du jour commune, 2 équipes équilibrées à l'arrivée, premier à 30 kills ; ELO (K=24) mis à jour en fin de manche, rangs Bronze à Diamant.
- **Tournoi** (liste « Tournoi » avant de rejoindre, 3 ou 5 manches, même choix pour toute la salle) : points par place (10-7-5-3-2-1), classement cumulé à l'écran, bonus au champion.
- **Killcam** : à ta mort, mini-replay des 2,5 s précédentes centré sur ton tueur. **Meilleur moment** : à la fin de la manche, ton meilleur kill (multi-kill ou série) rejoue en boucle.

## v8 : correctif serveur
- Un joueur qui perd sa connexion brutalement est retiré de la salle immédiatement (avant : ~30 s de « fantôme »), et l'hôte est transmis aussitôt.
- Fichier modifié : server.js (1 ligne).

## Nouveautés (v9 : tutoriel + PWA complète)
Nouveau fichier `public/extras3.js`. Fichiers modifiés : `server.js`, `public/sw.js`, `public/manifest.webmanifest`, `public/index.html` (2 lignes), + nouvelle icône `icon-maskable-512.png`.
- **🎓 Tutoriel interactif** (menu → « Tutoriel interactif », proposé automatiquement au tout premier lancement) : 9 étapes qui attendent que tu fasses vraiment l'action (marcher, jetpack, dash, viser/tirer, recharger, changer d'arme, éliminer un mannequin immobile, grenade, construire). Les touches affichées suivent tes réglages (AZERTY/QWERTY, touches personnalisées) ; sur mobile, les consignes décrivent les boutons tactiles. On peut passer une étape ou quitter à tout moment ; tes choix de menu (classe, bots, carte…) sont restaurés à la fin.
- **📲 Installation** : bouton « Installer l'application » dans le menu (Android/Chrome/Edge/bureau). Sur iPhone/iPad, il affiche la marche à suivre (Partager → Sur l'écran d'accueil). Il disparaît une fois installé. Raccourcis d'icône : « Jouer en solo » (`/?play=solo`) et « Tutoriel » (`/?tuto=1`).
- **📴 Hors-ligne fiable** : tous les fichiers sont pré-téléchargés à l'installation et servis depuis le cache ; le solo (11 cartes, modes, éditeur, boutique, niveau) marche sans réseau, y compris au démarrage. Une pastille indique « Hors-ligne », et le bouton multijoueur répond tout de suite au lieu d'attendre 45 s.
- **🔄 Mises à jour propres** : la version du cache est calculée automatiquement par le serveur (empreinte des fichiers) : plus rien à numéroter à la main. Quand une nouvelle version est prête, un bandeau propose « Mettre à jour » sans couper la partie en cours.
- Demande de stockage persistant au navigateur (protège niveau, pièces et réglages contre un nettoyage automatique).
- Icône « maskable » séparée pour Android.
- Limites : le multijoueur nécessite toujours une connexion. Sur iOS, l'installation reste manuelle (Apple n'autorise pas de bouton).

## Nouveautés (v10 : interface mobile façon Mini Militia)
Nouveau fichier `public/extras4.js`. Fichiers modifiés : `public/index.html` (quelques lignes : masque l'ancien HUD en mode tactile), `public/extras2.js` (1 ligne : position de la killcam), `public/sw.js`. Rien ne change sur PC.
- **Barre du haut** : PV (violet) + jetpack (bleu) + bouton pause · chrono de manche · arme avec munitions (toucher le panneau = changer d'arme, le cercle montre l'arme suivante) · kills / morts.
- **Commandes** : gros stick gauche « Glisse pour bouger », gros stick droit « Viser & tirer » (rouge quand tu tires), bouton grenade avec compteur, poing (pioche), zoom, dash, recharger, capacité de classe, construire. Les temps de recharge s'affichent en « camembert » sur les boutons.
- **Fil d'actions en rouge** (« A a tué B »), **minimap compacte** en haut à droite.
- **Colonne sociale** à droite : 😀 emotes (se déplie), 💬 messages rapides, ✉️ chat, 📍 ping, 👥 joueurs / mute / signalement / exclusion par l'hôte.
- Bulles d'aide au tout début (3 premières parties), disparaissent dès que tu touches un stick.
- L'échelle de l'interface suit la taille de l'écran (téléphone → tablette). Les boutons restent déplaçables : menu → 🎮 Touches mobiles. La nouvelle disposition remplace une seule fois l'ancienne sauvegardée.
- La killcam s'affiche maintenant en haut au centre en mode tactile (elle passait sous le stick).

## Nouveautés (v11 : accueil + salon façon Mini Militia)
Nouveau fichier `public/extras5.js`. Fichiers modifiés : `public/index.html` (1 ligne : charge extras5.js), `public/sw.js` (cache), `LISEZMOI.md`. Le serveur et le jeu ne changent pas : l'ancien menu reste en dessous et sert de « moteur » (et de menu pause).
- **Écran d'accueil** : niveau + barre d'XP, pseudo, pièces, ELO, personnage (la couleur de sa veste suit la couleur équipée dans la boutique), boutons Profil / Atelier / Boutique à gauche, Classé / Éditeur / Tutoriel à droite, ⚙️ (réglages, touches mobiles…), stats (kills, parties, victoires, rang) et gros bouton **COMBAT**.
- **Salon** (COMBAT) : mode de jeu en haut (toucher = changer), **carte** avec ‹ › et aperçu (toucher = écran de choix), liste des joueurs (toi en jaune, bots en vert qui « arrivent » un par un, selon le mode), pastilles d'options (bots, classe, constructions, objectif), bouton **JOUER**. L'onglet **EN LIGNE** remplace la liste par le code de salle (+ équipe, tournoi) et le bouton REJOINDRE. Toucher ton nom = changer de pseudo.
- **Choix de carte** : grand aperçu + description + étiquettes, et vignettes des 11 cartes.
- En partie, ☰ ouvre l'ancien menu avec un nouveau bouton « 🏠 Quitter la partie » (retour à l'accueil).
- Le salon en ligne ne montre pas encore les amis avant d'entrer : le jeu n'a pas de salle d'attente côté serveur, on arrive directement en partie.

## Nouveautés (v12 : constructions, bois, armes)
Fichier modifié : `public/index.html` (+ `LISEZMOI.md`). Le serveur ne change pas.
- **Constructions temporaires** : chaque pièce disparaît toute seule (mur 22 s, tour 24 s, sol/rampe/pont 16 s). Une barre se vide sous les murs et ils clignotent les 4 dernières secondes. Durées modifiables dans `BTYPES` (champ `t`, en secondes) dans `index.html`.
- **5 types** (touche C / bouton ⇄) : 🧱 mur, ▬ sol, ◢ rampe, 🗼 tour (2 blocs de haut), 🌉 pont (2 sols côte à côte). Limite portée à 24 pièces, rendu en planches avec fissures et apparition animée.
- **Bois** : 120 au départ (avant 30), plafond 400 (avant 200), tas de bois ~2× plus nombreux (+70 chacun, réapparition 8 s), +15 par kill, +12 par coup de pioche sur un mur, et +1 toutes les 0,8 s tant que tu as moins de 80.
- **Armes** : 6 nouvelles (Uzi, Revolver, Minigun, Bazooka explosif, Laser, Lance-flammes). Les caisses d'arme (plus nombreuses) donnent une arme différente à chaque réapparition (nom affiché). 3 armes portées au lieu de 2. Les bots utilisent aussi les nouvelles armes.
- Multijoueur : fonctionne avec les anciennes mécaniques (les autres voient les tirs, les murs et les explosions).

## v12.1 : armes au sol
- Quand un joueur (ou un bot) meurt, il lâche son arme actuelle (sauf le pistolet) avec ses munitions restantes. Elle reste 30 s (clignote à la fin) : passe dessus pour la ramasser (3 armes max).
- Les armes au sol sont très visibles : halo doré qui pulse, faisceau de lumière vertical, cercle, nom + munitions et flèche ▼. Les caisses d'armes ont aussi un halo.
- Multijoueur : les drops et les ramassages sont synchronisés (événements `drop` / `dpk`).

## Nouveautés (v13 : menu pause + pages refaites)
Nouveau fichier `public/extras6.js` ; modifiés : `index.html`, `extras2.js`, `sw.js`.
- **Menu pause** compact (☰ / Échap) : kills, morts, arme, bois ; ▶ Reprendre, ⚙️ Réglages, 🎮 Touches mobiles (sur mobile), ❓ Commandes (touches réelles, suit tes réglages), 🏠 Quitter (confirmation en 2 temps). En solo la partie est vraiment figée ; en ligne elle continue.
- **Profil** : grande carte avec avatar cerclé de ta couleur, niveau, barre d'XP, 4 stats, champs pseudo / drapeau / titre.
- **Boutique** : onglets par catégorie, cartes avec aperçu (avatar, couleur, traînée, skin), état Équipé / Équiper / prix avec le nombre de pièces qui manque, solde de pièces toujours visible.
- **Salle** : cartes joueurs (avatar, ELO, niveau, couronne hôte).
- **Réglages, Atelier d'armes, Éditeur** : même habillage (panneaux, titre fixe, bouton OK fixe).

## v13.1 : retraits
- Plus de ping de carte (bouton 📍 et clic molette retirés).
- Plus de barre de chat en bas (bouton ✉️ et touche Entrée retirés). Les messages rapides du haut (💬 / touche T) restent.
- Plus d'éditeur de cartes ni d'import de code de carte ; la carte perso mémorisée n'est plus chargée.

## v13.2 : bots chacun pour soi
Les bots visent désormais l'ennemi le plus proche (toi OU un autre bot) au lieu de te viser tous. Ils gardent leur cible tant qu'elle n'est pas 40 % plus loin qu'une autre. Dans les modes par équipes (CTF, deathmatch d'équipes), les bots d'une même équipe ne s'attaquent pas ; en mode Zombies, les zombies te visent toujours.

## Nouveautés (v14 : 22 skins de personnage)
Nouveau fichier `public/skins.js` ; modifiés : `index.html` (1 balise script), `extras2.js` (boutique, profil, synchro), `extras5.js` (accueil), `sw.js` (cache). Le serveur ne change pas.
- **Boutique → onglet « Personnages »** (ouvert en premier) : 22 skins dessinés en code, de 100 à 1000 pièces.
  Commando, Punk, Zombie, Pirate, Ninja, Agent spécial, Astronaute, Viking, Samouraï, Chevalier, Spartiate, Cyborg, Chasseur de primes, Exterminateur, Cyberpunk, Démon, Faucheur, Phénix, Roi des glaces, Dragon, Seigneur noir, Roi doré.
- Chaque skin change le corps, le casque/visage, le torse (armure, gilet, piques…), parfois le dos (cape, ailes, katana, faux, écharpe) et une aura de particules. Capes et ailes bougent quand tu cours.
- Visible **en partie** (toi + les joueurs en ligne, synchronisé avec le profil), dans la boutique (aperçu) et sur l'**écran d'accueil**.
- En mode équipes, le corps garde la couleur de l'équipe (pour reconnaître les alliés) ; le casque et les accessoires du skin restent visibles.
- Ajouter un skin = une ligne dans le tableau `SP` de `skins.js` (couleurs + type de tête / torse / dos / aura) ; la boutique et le multijoueur le prennent en compte tout seuls (ne pas retirer ni réordonner les skins existants : les achats sont enregistrés par numéro).

## v14.1 : essai des skins en boutique + jetpack adouci
- **Essai en direct (boutique uniquement)** : Boutique → Personnages → bouton **👁 Essayer** sous chaque skin non acheté. Une fenêtre montre le personnage en grand et animé (aura, cape, ailes) avec **🏃 Courir** et **↔ Tourner**, plus un bouton Acheter. Rien n'est équipé : en sortant, le skin n'est pas utilisable tant qu'il n'est pas acheté, ni en partie, ni à l'accueil, ni pour les autres joueurs.
- **Jetpack moins violent** : accélération 2600 → 1300, vitesse de montée max 380 → 250, consommation 34 → 32 par seconde. Les 3 valeurs sont en haut de `index.html` (`JET_A`, `JET_V`, `JET_F`) si tu veux régler plus fort ou plus doux. Les bots et les zombies sont concernés aussi.

## Nouveautés (v15 : arsenal, skins d'arme Éternels & EVO, skins de personnage plus « badass »)
Nouveau fichier `public/arsenal.js` (chargé avant `extras.js`). Modifiés : `skins.js`, `extras.js`, `extras2.js`, `index.html` (1 balise script), `sw.js`.
- **6 nouvelles armes** : M4 Carbine, P90, Desert Eagle, Railgun, Lance-grenades (explosif), AA-12 (pompe automatique). Elles sortent des caisses, se ramassent au sol et sont utilisées par les bots. Les ajouter/modifier : tableau `NW` + dessin dans `art()` de `arsenal.js`.
- **Skins d'arme ÉTERNELS** (achat unique, animés, 300 à 800 pièces) : Obsidienne, Plasma, Lave, Glace, Or royal, Néant.
- **Skins d'arme EVO** (500 à 900 pièces) : Phénix, Foudre, Dragon, Cosmos. Ils **évoluent avec tes kills** (niveaux 1 à 5 à 0 / 10 / 30 / 60 / 100 kills) : bande lumineuse, halo, particules, puis éclair du canon au niveau max. Les points sous l'arme montrent le niveau. Progression mémorisée sur l'appareil.
- Boutique → « Skins d'arme » et 🔫 Atelier d'armes : les 10 nouveaux skins y apparaissent à la suite des 6 anciens.
- **Skins de personnage** : auras avec halo lumineux, braises et étincelles, reflet métallique qui balaie le torse, yeux lumineux qui pulsent.
- Limite : les skins d'arme ne sont visibles que chez toi (comme les anciens).

## Nouveautés (v16 : sons d'armes réalistes)
Nouveau fichier `public/sons.js` (aucun fichier audio : tout est synthétisé). Modifiés : `index.html` (1 balise script), `extras.js` (1 mot), `sw.js`.
- Chaque tir superpose un claquement, un souffle, une détonation grave et un écho de salle ; chaque arme a son profil (pistolet sec, AK lourd, shotgun avec « tchak-tchak » de pompe, sniper avec longue réverbération, Uzi/P90 crépitants, Desert Eagle puissant, laser/railgun électriques, bazooka avec souffle, flammes).
- Léger hasard à chaque tir (plus de « mitraillette de bips »), douilles qui tintent, silencieux = sons étouffés.
- **Les tirs des autres joueurs et des bots s'entendent** : volume selon la distance, stéréo gauche/droite.
- Recharges avec bruits mécaniques (chargeur, culasse ; cartouches une à une au shotgun), explosions profondes avec débris.
- Le curseur de volume des réglages s'applique. Réglage par arme : tableau `PR` dans `sons.js`.

## v16.1 : aperçu des skins d'arme
Boutique → **Skins d'arme** : chaque skin a une miniature et un bouton **👁 Aperçu** (modifs : `arsenal.js`, `extras2.js`). La fenêtre montre l'arme en grand et animée ; ◀ ▶ change d'arme (les 16), **💥 Tirer** joue le tir et le son, et pour les skins EVO les boutons **Niv. 1 à 5** montrent chaque évolution. On peut acheter depuis l'aperçu.

## v17 : rendu des armes
Dans `arsenal.js` (fonction `gun` remplacée) : les 16 armes sont redessinées dans un sprite haute résolution (net même en grand : aperçu, HUD) avec **dégradé de volume, arêtes éclairées en haut / ombrées en bas, contour sombre**, plus des détails (grain du bois, rails, stries, bandes de sécurité) et des **lueurs animées** (laser, railgun, flamme pilote du lance-flammes, éclat de la lunette du sniper). Flash de tir plus gros et étiré vers l'avant, main cerclée. Les skins d'arme, le silencieux et le chargeur étendu se superposent comme avant. Si le sprite ne peut pas se créer, l'ancien dessin sert de secours.

## v18 : rendu pro, sons d'armes « studio », skins d'armes iconiques
Nouveau fichier `public/pro.js` (chargé en dernier). Modifiés : `sons.js` (réécrit), `arsenal.js` (skins), `extras.js` (1 ligne), `index.html` (balise script + minimap décalée), `sw.js` (cache).
- **Graphisme global** : ombre portée sous les personnages (elle s'étire quand ils sautent), lueur autour des balles, lumière de bouche à chaque tir, fumée de canon, braises incandescentes, explosions avec onde de choc + fumée, plateformes avec arête éclairée / contour / ombre, étalonnage chaud en haut / froid en bas, HUD en « verre » (panneaux dégradés, barres brillantes), minimap décalée (plus de chevauchement avec les pièces et le bouton 👥), transitions et focus sur les boutons. Pour tout désactiver : retirer `<script src="pro.js">`.
- **Sons** : chaîne master avec saturation douce + égaliseur + compresseur ; réverbération sombre + écho lointain ; chaque tir = transitoire + claquement + corps + détonation + harmonique + douille. Profils distincts pour les 16 armes (AK métallique, Sniper avec écho et culasse, Shotgun avec pompe, Laser/Railgun en synthèse FM, Bazooka avec souffle, Lance-flammes crépitant, etc.). Tirs lointains plus sourds. **Nouveaux** : recharge propre à chaque type d'arme, explosion en couches, bruit de touche (tick) et « ding » de headshot, clic d'arme vide, bruit de changement d'arme.
- **Skins d'armes iconiques** : la texture est désormais peinte sur TOUTE l'arme (plus de simples liserés), en gardant ses détails : Néon (lignes cyan qui pulsent), Or (plaque gravée de losanges + reflet), Camouflage forestier, Rubis (facettes), Arc-en-ciel holographique, Obsidienne (veines violettes), Plasma (ondes cyan/magenta), Lave (magma craquelé), Glace (givre), Or royal (volutes + gemmes), Néant (nébuleuse + étoiles), Phénix (plumes de feu), Foudre (éclairs), Dragon (écailles, or au niveau 5), Cosmos (galaxie + étoiles filantes). Les skins EVO gagnent en intensité avec le niveau. Visible en jeu, dans l'aperçu et les miniatures de la boutique. Ajouter un skin = une entrée dans `SKP` de `arsenal.js` (fonctions `base` statique et `fx` animée).

## v19 : EVO, avatars, traînées de dash et emotes refaits
Nouveau fichier `public/fx.js` (chargé avant `extras2.js`). Modifiés : `extras2.js` (catalogues, boutique, plaque de nom), `arsenal.js` (2 skins EVO), `index.html` (1 balise script), `sw.js`. Le serveur ne change pas. Les anciens achats restent valides (les nouveaux objets sont ajoutés à la suite, rien n'est réordonné).
- **Skins EVO vivants** : chaque skin a maintenant ses effets en jeu, qui montent avec le niveau (1→5). Balles colorées + traînée d'effets (flammes, étincelles, écailles de feu, étoiles…), flash à la bouche du canon (niv. 3+), impact (niv. 2+, avec onde de choc niv. 4+) et **finish de kill** sur la victime (niv. 3+, version spectaculaire au niv. 5 : colonne de feu du Phénix, foudre tombée du ciel, souffle du Dragon, implosion + explosion d'étoiles du Cosmos…). **Montée de niveau** : bandeau, explosion autour de toi et petit jingle. Une **barre de progression** s'affiche en bas de l'écran avec le skin EVO équipé (kills / prochain palier). **2 nouveaux EVO** : Venin (800) et Spectre (1100). Effets visibles chez toi seulement (comme les skins d'arme).
- **Traînées de dash** : 15 au lieu de 6, avec ruban lumineux effilé + particules propres à chacune. Anciennes améliorées (Feu, Glace, Néon, Étoiles, Arc-en-ciel) + 9 nouvelles : Foudre, Fantôme (images rémanentes), Sakura, Glitch, Ombre (clones), Comète, Toxique, Galaxie, Or massif. Dessinées derrière le joueur. Visibles par les autres joueurs.
- **Emotes animées** : bulle qui rebondit à l'apparition, symbole animé (secoué, pulsé, tourné, battement…), et effets par emote (larmes, flammes, confettis, cœurs, pièces, éclairs, explosion…), avec un petit son. **22 emotes** (12 nouvelles : 👋 GG 👀 😭 🥶 💪 WOW 🤯 🥳 😈 ⚡ 🏆).
- **Avatars** : 29 au lieu de 9, avec **5 raretés** (Commun, Rare, Épique, Légendaire, Mythique) : cadre coloré, halo, reflet qui tourne, anneau arc-en-ciel animé pour les Mythiques. Le cadre s'affiche dans la boutique, le profil et au-dessus des joueurs en partie.
- **👁 Aperçu** sur les avatars, traînées et emotes dans la boutique : animation en boucle (le personnage dashe / joue l'emote), bouton ↻ Rejouer, achat depuis l'aperçu.
- Ajouter une traînée = une entrée dans `TR` + une fonction dans `TFX` (`fx.js`). Ajouter une emote = une entrée dans `EMD` + son libellé dans le catalogue `em` de `extras2.js`. Pour tout désactiver : retirer `<script src="fx.js">` (et revenir à l'ancien `extras2.js`).
