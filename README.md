# als-oracle-pathfinder
An Account Lookup Service Oracle for GSMA Pathfinder resolution of MSISDNs. Code based on the
Mojaloop [ALS Oracle Template](https://github.com/mojaloop/als-oracle-template).

## TODO
* remove secrets from config, then squash down to initial commit. Replace config mechanism with
    dotenv, .template.env and .env entry in gitignore to prevent secrets being committed
* pre-commit hook to run tests before commit (https://www.npmjs.com/package/pre-commit or DIY)
* tidy up pathfinder lib config- it should allow a user to supply a pathfinder config and provide
    any missing defaults
* pathfinder module should use this.logger.{error, warn, info, debug}
* go through and address all TODOs in pathfinder lib
* use dotenv? inside config.js?
* make sure pathfinder tests are running
* bring in validation libs; hapi-openapi is considerably lacking
* handle currency querystring in get participants by type and id?
