#!/usr/bin/env bash

# install mdbtools first!
# mdbtools: https://github.com/brianb/mdbtools


DBMS=sqlite

for MDB in `ls | grep .mdb$`
do
    # extract the mdb file basename, and substitute upcase letters to lowercase
    MdbBASE=`basename ${MDB} .mdb`
    lMdbBASE=`basename ${MDB} .mdb | tr 'A-Z' 'a-z'`
    echo "Processing ${MdbBASE}"
    # create mdb file basename and create directory for output
    if [ ! -d ${lMdbBASE} ]; then
        mkdir -p ${lMdbBASE}
    fi
    

    mdb-schema ${MDB} ${DBMS} | sed 's/Char/Varchar/g' | sed 's/Postgres_Unknown 0x0c/text/g' | sed 's/Postgres_Unknown 0x10/INTEGER/g' >  ${lMdbBASE}/schema.sql
    
    # import data
    for T in $(mdb-tables ${MDB})
    do 
        mdb-json ${MDB} ${T} > ${lMdbBASE}/${T}.json
    done
done