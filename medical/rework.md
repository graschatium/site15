🗂 Nouvelle section : Fiches Médicales

Onglet dédié dans la nav entre Ordonnances et Patients
Formulaire complet en deux colonnes : identité (nom, ID, âge, genre, groupe sanguin, zone, médecin, allergies, statut, sévérité) + données médicales (diagnostic, antécédents, traitement, ordonnances liées, paramètres vitaux tension/pouls/temp, notes cliniques)
Cartes avec code couleur par sévérité (faible/modérée/élevée/critique) et bordure top colorée
Modal de vue détaillée avec tous les champs, bouton Modifier direct et export .txt
Filtres par statut (critique, quarantaine, observation, stable, guérison)
Stat "Critiques" dans la sidebar qui combine fiches + patients critiques

📋 Remake du formulaire Ordonnances

Interface en 4 étapes (stepper) : Identification → Prescriptions → Procédure → Aperçu
Étape 1 : médecin prescripteur, patient, date d'émission + expiration, sélecteur biohazard visuel (5 boutons cliquables)
Étape 2 : prescriptions médicamenteuses dynamiques (ajout/suppression de lignes médicament/dose/durée) + champ EPI
Étape 3 : procédure détaillée, contre-indications, notes
Étape 4 : aperçu formaté style document médical officiel avant sauvegarde


Collection user-rp dans Firestore, exactement comme demandé
Champs par agent : Nom Prénom RP, Username Roblox, Grade/Rang, Spécialité médicale, Statut (actif/inactif/suspendu/en congé), Date de recrutement + notes optionnelles
Accès admin uniquement pour créer/modifier/supprimer — les autres voient le roster en lecture seule
Deux vues : cartes visuelles avec initiales + badge statut, ou tableau compact
Filtres par statut + barre de recherche
Modal de détail par agent avec boutons Modifier/Supprimer visibles seulement aux admins
Stats sidebar : compteur agents total + agents actifs
Cartes colorées par statut (vert = actif, rouge = suspendu, gris = inactif, jaune = congé)

je veux qu'a laide de ça, j'aimerai que chaque personnel est accès à son espace

Q : Que doit contenir l'espace personnel de chaque agent ? (Sélectionnez toutes les réponses applicables)
R : Ses propres infos (grade, statut, spécialité), Ses évaluations reçues, Ses ordonnances / rapports qu'il a rédigés

Q : Comment l'agent accède-t-il à son espace ?
R : Un lien/bouton dédié après connexion

Q : L'agent peut-il modifier ses propres infos ?
R : Oui, certains champs (notes, statut)