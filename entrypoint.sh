#!/bin/bash

set -e

case "$1" in
    develop)
        echo "Running development server"
        exec yarn dev
        ;;
    test)
        echo "Running tests"
        exec yarn test
        ;;
    start)
        echo "Running server"
        exec yarn start
        ;;
    *)
        exec "$@"
esac