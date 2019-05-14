# als-oracle-pathfinder
An Account Lookup Service Oracle for GSMA Pathfinder resolution of MSISDNs. Code based on the
Mojaloop [ALS Oracle Template](https://github.com/mojaloop/als-oracle-template).

## TODO
* pre-commit hook to run tests before commit (https://www.npmjs.com/package/pre-commit or DIY)
* tidy up pathfinder lib config- it should allow a user to supply a pathfinder config and provide
    any missing defaults
* pathfinder module should use this.logger.{error, warn, info, debug}
