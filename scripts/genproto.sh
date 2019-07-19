cd ../src
cd ./imguploadservice && ./genproto.sh
cd ../pgsqlservice && ./genproto.sh
cd ../exifservice && ./genproto.sh
cd ../imgproxyservice/scripts && ./genproto.sh
cd ../../faceapi && ./genproto.sh
