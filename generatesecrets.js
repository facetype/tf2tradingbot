require('dotenv').config();
const SteamUser = require('steam-user');


const client = new SteamUser();

const accountName = process.env.STEAMUSER;
const password = process.env.PASSWORD;

client.logOn({
  accountName,
  password
});

client.on('loggedOn', () => {
  console.log('Logged in');

  client.enableTwoFactor((err, response) => {
    if (err) {
      console.error('enableTwoFactor failed:', err);
      return;
    }
    client.getSteamGuardDetails((err, details) => {
      if (err) {
        console.error('getSteamGuardDetails error:', err);
        return;
      }
    
      console.log('Steam Guard details:', details);
    });

    //FIX ME (account issue not code issue)
    //steam responds with status code 2, refusing to generate 2fa secrets? account-restriction maybe?
    //phone number has been linked as well as wallet funds
    console.log('FULL RESPONSE:', response);
    console.log('shared_secret:', response.shared_secret);
    console.log('identity_secret:', response.identity_secret);
    console.log('revocation_code:', response.revocation_code);

  });
});
