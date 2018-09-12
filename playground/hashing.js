const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

var password = '123abc!';

var hashedPassword = '$2a$10$Sza6NLg/D8A3X97ioYec8eY838fhJ52Hi3NPVK1Px8yHOnLMvTtq2';

bcrypt.compare(password, hashedPassword, (err, res) => {
  console.log(res);
});
