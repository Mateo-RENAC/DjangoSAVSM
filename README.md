# Service Après-Vente Storage Manager (SAVSM)

This Django Project will be use for manage the storage of the FAMILINK's SAV

## With 2 Database Table :
    -SAV Storage
    -SAV Conso

    TABLE SAV Storage
    #id_Stock_SAV INT AUTOINCREMENT --> Id AutoIncrement identify object
    Name Varchar(25)  --> Name : letter and number, identify object
    Count_Stock INT  --> Number of object in storage. Need to be increment when we received stock and Un-increment when we use an object

    TABLE SAV Conso
    #FK_id_SAV_Conso INT AUTOINCREMENT --> Foreign Key of id_Stock_SAV in SAV Storage Table and primary key of SAV Conso Table
    Name Varchar(25)  --> Foreign Key of Name from SAV Storage Table
    Count_Conso INT  --> Number of object used. Need to be increment when we use object
    Date_Precedent_Batch DATE  --> Change when a batch of the item arrived

## TODO

  ### Boutons
  - Remettre la consommation instannée à 0 et la date à today de tous les éléments cochés

  ### Automatisations
  - Créer automatiquement une consommation instantannée et historique lors de la création d'un nouveau type de stock
  - Lors de la diminution d'un stock, augmenter la conso et ajout 1 line par semaine dans l'historique
  - Lors d'un nouveau batch, remettre les consos à 0 et date à today/celle spécifiée
  
  ### Tables
  - Stock
  - Conso
  - Batch
  - Historique des consommations
  
  ### UI
  - Visualiseur liste type stock
  - Visualiseur liste type conso
  - Visualiseur liste historique conso d'un type (grâce à menu déroulant)
  - Visualiseur liste batch
  - View type stock :
      - Graphique de l'évolution du stock
      - Nombre actuelle
      - Conso instanée
      - Précédent batch associé
  - Panel de modification simplifiée avec gros boutons colorées pour ajout dans les différentes tables
  - Dans les visualiseur : permettre de générer des .pdf / .json (fiche produit, historique conso, recap global etc)
