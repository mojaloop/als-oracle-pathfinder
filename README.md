# als-oracle-pathfinder

[![Git Commit](https://img.shields.io/github/last-commit/mojaloop/als-oracle-pathfinder.svg?style=flat)](https://github.com/mojaloop/als-oracle-pathfinder/commits/master)
[![Git Releases](https://img.shields.io/github/release/mojaloop/als-oracle-pathfinder.svg?style=flat)](https://github.com/mojaloop/als-oracle-pathfinder/releases)
[![Docker pulls](https://img.shields.io/docker/pulls/mojaloop/als-oracle-pathfinder.svg?style=flat)](https://hub.docker.com/r/mojaloop/als-oracle-pathfinder)
[![CircleCI](https://circleci.com/gh/mojaloop/als-oracle-pathfinder.svg?style=svg)](https://circleci.com/gh/mojaloop/als-oracle-pathfinder)

An Account Lookup Service Oracle using GSMA PathFinder for resolution of MSISDNs. 

Code is based on the Mojaloop [ALS Oracle Template](https://github.com/mojaloop/als-oracle-template).

Notes:
* You need to supply your own PathFinder TLS keys via a k8s Secret for this service to work properly.
For more information check the `volumeMounts` property of `deployment.yaml` of the [mojaloop/helm](https://github.com/mojaloop/helm) repository.
The paths to these keys are defined in the `src/config.js` file under the property `secrets`.

* In order to execute the PathFinder tests, you'll need to supply the secrets in
    ```
        ./src/lib/pathfinder/secrets_test
    ```

## TODO

* pre-commit hook to run tests before commit (https://www.npmjs.com/package/pre-commit or DIY)
* go through and address all TODOs in pathfinder lib
* bring in openapi/header validation libs? hapi-openapi is considerably lacking
* if there is an error in server init, the server hangs forever. Try to throw an error from, for example, the db init method. This could be pretty annoying in production.
* Improve code-coverage to 90% across the board: [.nycrc.yml](./.nycrc.yml).
* Update CI-CD to include unit and code-coverage checks.
