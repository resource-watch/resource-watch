#!/bin/bash

set -e

case "$1" in
    develop)
        echo "Running development server"
        exec yarn dev
        ;;
    test-frontend)
        echo "Running frontend tests"
        exec yarn test:frontend
        ;;
    test-backend)
        echo "Running backend tests"
        exec yarn test:backend
        ;;
    start)
        echo "Running server"
        exec yarn start
        ;;
    *)
        exec "$@"
esac
