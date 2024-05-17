# Familink Stock

This Django Project will be use for manage the storage of the FAMILINK's

## Database tables
7 Database Table :

    "Object" Type Database :
        -Object
        -BatchStockObject
        -ConsoHistoryObject

    "Normal" Type Database
        -SAV Stock
        -SAV Conso
        -ConsoHistory
        -BatchStock


    TABLE SAV Stock
        -#id_SAVStock INT AUTOINCREMENT --> identify the line (primary Key)
        -//id_object OneToOneField --> Link with the Table Object
        -Count_Stock INT  --> Number of object in storage. Need to be increment when we received stock and Un-increment when we use an object

    TABLE SAV Conso
        -#id_SAVConso INT AUTOINCREMENT --> identify the line (primary key)
        -//id_object ForeignKey --> Link with the Table Object
        -conso_Count INT  --> Number of object used. Need to be increment when we use object
        -Date  --> I have forgot why this date is use

    TABLE ConsoHistory
        -#id_ConsoHistory INT AUTOINCREMENT --> identify the line (primary key)
        -date_Conso_History DateField --> When the ConsoHistory have been saved

    Table BatchStock
        -#id_BatchStock INT AUTOINCREMENT --> identify the line (primary key)
        -name CharField(50) --> BatchStock Name
        -//objects ManyToManyField --> Link with Object of the BatchStockObject
        -date DateField --> Date when the BatchStock is arrived


    Table Object
        -#id_Object INT AUTOINCREMENT --> identify the line (primary key)
        -name CharField(25) --> Name of the Object
        -description CharField(500) --> Describe the object

    TABLE BatchStockObject
        -//batch_stock ForeignKey --> Link with BatchStock
        -//object ForeignKey --> Link with Object
        -count IntegerField(=0) --> How many of the object have been delivered

    TABLE ConsoHistoryObject
        -//conso_history ForeignKey --> Link with ConsoHistory
        -//object ForeignKey --> Link with Object
        -count IntegerField(0) --> How many Object have been used ?



Theses Data bases is linked with signals and permit more automation :

    -update_SAVStock() --> (pre_save) This signal update the SAVStock when
    we use an object in SAVConso (reduce the count of SAVStock)

    -create_sav_stock_entry() --> (post_save) when we create new object in the table object.
    It created in the table SAVStock too with a count of 0

    -create_sav_conso_entry() --> (post_save) like create_sav_stock_entry but in the Table
    SAVConso

    -create_BatchStock_and_BatchStockObject_entry() --> (post_save) when we create an new BatchStock
    all existent object is created in BatchStockObject Table with an count of 0

    -update_previous_count() --> (pre_save) I have forgotten why I use this signal, but it's with BatchStockObject.
    maybe for security when we change the count (yes because when a BatchStock
    is created that fill the count with the objects in SAVStock)

    -update_SAVStock() --> (post_save) This is the signals that update SAVStock when a new BatchStock is here
    and create new object if unknown object is in (maybe I should deactivate this...)

## Getting started

### Install

    git config --global url."https://github.com/".insteadOf git://github.com/
    git clone https://github.com/Mateo-RENAC/DjangoSAVSM familink_stock
    cd familink_stock

    virtualenv venv
    source venv/bin/activate
    pip install -r requirments.txt
    cd stock
    
    python manage.py makemigrations panel
    python manage.py migrate
    python manage.py createsuperuser
    python manage.py runserver

- go to "http://localhost/"


### Migrate

    python manage.py migrate


### Run

    python manage.py runserver


### Create super user

    python manage.py createsuperuser
