## scripts/

This directory provides scripts for handling some of the build related tasks.

1. `dbmigrate.sh`: creates a fresh postgres db and creates new tables in that db.
2. `docker-cleanup.sh`: stops and removes all docker containers, images, volumes and networks.
3. `genproto.sh`: copies all pb/fileUploader.proto file into each of the service directories.
4. `freshstart.sh`: executes the above scripts in following sequence
    * docker-cleanup.sh
    * genproto.sh
    * dbmigrate.sh
