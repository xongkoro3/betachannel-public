const middleware = {}

middleware['auth'] = require('../middleware/auth.ts');
middleware['auth'] = middleware['auth'].default || middleware['auth']

middleware['check-auth'] = require('../middleware/check-auth.ts');
middleware['check-auth'] = middleware['check-auth'].default || middleware['check-auth']

export default middleware
