docker build -t schedulerapp .
docker run -p 8899:8899 -t -dit --restart=always schedulerapp
