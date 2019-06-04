# als-oracle-pathfinder
An Account Lookup Service Oracle for GSMA Pathfinder resolution of MSISDNs. Code based on the
Mojaloop [ALS Oracle Template](https://github.com/mojaloop/als-oracle-template).

## TODO
* Generally fix up swagger
* NOTE THAT MANY OF THESE TODOS PROBABLY APPLY TO THE MERCHANT ORACLE ALSO
* add merchant id regex validation to merchant oracle swagger
* Need to add FSPIOP_CALLBACK_URL_PARTICIPANT_PUT_ERROR to participantEndpoint table
* import openapi validation? port swagger to openapi?
* import header validation
* pre-commit hook to run tests before commit (https://www.npmjs.com/package/pre-commit or DIY)
* go through and address all TODOs in pathfinder lib
* make sure pathfinder tests are running
* bring in validation libs; hapi-openapi is considerably lacking
* if there is an error in server init, the server hangs forever. Try to throw an error from, for
    example, the db init method. This could be pretty annoying for deployment.
