#!/bin/sh
set -e

exec su-exec app java -jar /app/app.jar "$@"
