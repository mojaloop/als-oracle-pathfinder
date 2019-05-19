'use strict';

// This is a pretty basic check that input conforms to e164. Unlikely it could be much better.
module.exports = num => null != num.match(/^\+?[1-9]\d{1,14}$/);
