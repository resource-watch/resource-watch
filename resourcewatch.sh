#!/bin/bash

case "$1" in
    test-frontend)
        type docker-compose >/dev/null 2>&1 || { echo >&2 "docker-compose is required but it's not installed.  Aborting."; exit 1; }
        docker-compose -f docker-compose-test.yml build && docker-compose -f docker-compose-test.yml up --abort-on-container-exit --exit-code-from cypress cypress frontend-test-server
        ;;
    test-backend)
        type docker-compose >/dev/null 2>&1 || { echo >&2 "docker-compose is required but it's not installed.  Aborting."; exit 1; }
        docker-compose -f docker-compose-test.yml build && docker-compose -f docker-compose-test.yml up --abort-on-container-exit --exit-code-from backend-test backend-test
        ;;
    start)
        type docker-compose >/dev/null 2>&1 || { echo >&2 "docker-compose is required but it's not installed.  Aborting."; exit 1; }
        docker-compose -f docker-compose-develop.yml build && docker-compose -f docker-compose-develop.yml up
        ;;
    develop)
        type docker-compose >/dev/null 2>&1 || { echo >&2 "docker-compose is required but it's not installed.  Aborting."; exit 1; }
        docker-compose -f docker-compose-develop.yml build && docker-compose -f docker-compose-develop.yml up
        ;;
    *)
        echo "Usage: service.sh {test-backend|test-frontend|start|develop}" >&2
        exit 1
        ;;
esac

exit 0
