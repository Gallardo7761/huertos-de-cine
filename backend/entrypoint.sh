#!/bin/sh
set -e

echo "*** Compilando..."
mvn clean package -DskipTests

echo "*** Lanzando Spring..."
java -agentlib:jdwp=transport=dt_socket,server=y,suspend=n,address=*:5005 -jar target/huertos-de-cine-2.0.0.jar