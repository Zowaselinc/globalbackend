/* --------------------- HANDLE ENCRYPTION HERE --------------------- */
const crypto = require('crypto');

/* ------------------------------------------------------------------------------------------------------------------ */
/*                                       ALL UNIQUE KEYS FOR ENCRYPTION ON MSIAQ                                      */
/* ------------------------------------------------------------------------------------------------------------------ */
const encryptionkeys = {
  //KEYS FOR ADMIN ENCRYPTION
  'configkey':'a4elp75c867r4e30fce11291da95ce665e61474cb44ded427b99edz2e69jn63f',
  'configiv':'2c9431b4eff3b243c18530b97131bj37',
}


/* ------------------------------- FUNCTION TO ENCRYPT AND DECRYPT COMPANY ON THE GO ------------------------------ */

 const EncryptConfig = ((val) => {
    let cipher = crypto.createCipheriv('aes-256-cbc', encryptionkeys.configkey.substr(32), encryptionkeys.configiv.substr(16));
    let encrypted = cipher.update(val, 'utf8', 'base64');
    encrypted += cipher.final('base64');
    return encrypted;
  });


/* ------------------------------- FUNCTION TO ENCRYPT AND DECRYPT COMPANY ON THE GO ------------------------------ */

 const DecryptConfig= ((encrypted) => {
    let decipher = crypto.createDecipheriv('aes-256-cbc',encryptionkeys.configkey.substr(32), encryptionkeys.configiv.substr(16));
    let decrypted = decipher.update(encrypted, 'base64', 'utf8');
    return (decrypted + decipher.final('utf8'));
  });



/* ------------------------------------------------------------------------------------------------------------------ */
/*                                                   MODULE EXPORTS                                                   */
/* ------------------------------------------------------------------------------------------------------------------ */

  module.exports={EncryptConfig,DecryptConfig};
