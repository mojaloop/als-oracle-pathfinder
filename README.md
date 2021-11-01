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

## Automated Releases

As part of our CI/CD process, we use a combination of CircleCI, standard-version
npm package and github-release CircleCI orb to automatically trigger our releases
and image builds. This process essentially mimics a manual tag and release.

On a merge to master, CircleCI is configured to use the mojaloopci github account
to push the latest generated CHANGELOG and package version number.

Once those changes are pushed, CircleCI will pull the updated master, tag and
push a release triggering another subsequent build that also publishes a docker image.

### Potential problems

*   There is a case where the merge to master workflow will resolve successfully, triggering
    a release. Then that tagged release workflow subsequently failing due to the image scan,
    audit check, vulnerability check or other "live" checks.

    This will leave master without an associated published build. Fixes that require
    a new merge will essentially cause a skip in version number or require a clean up
    of the master branch to the commit before the CHANGELOG and bump.

    This may be resolved by relying solely on the previous checks of the
    merge to master workflow to assume that our tagged release is of sound quality.
    We are still mulling over this solution since catching bugs/vulnerabilities/etc earlier
    is a boon.

*   It is unknown if a race condition might occur with multiple merges with master in
    quick succession, but this is a suspected edge case.

## Additional Notes

N/A

## TODO

* pre-commit hook to run tests before commit (https://www.npmjs.com/package/pre-commit or DIY)
* go through and address all TODOs in pathfinder lib
* bring in openapi/header validation libs? hapi-openapi is considerably lacking
* if there is an error in server init, the server hangs forever. Try to throw an error from, for example, the db init method. This could be pretty annoying in production.
* Improve code-coverage to 90% across the board: [.nycrc.yml](./.nycrc.yml).
* Update CI-CD to include unit and code-coverage checks.
