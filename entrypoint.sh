#!/bin/bash

echo "Waiting for postgres..."

while ! nc -z db 5432; do
    sleep 0.1
done

echo "PostgresSQL started"

alembic upgrade head

exec "$@"