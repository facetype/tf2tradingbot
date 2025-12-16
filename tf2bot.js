import 'dotenv/config';

require('dotenv').config();

import SteamUser from 'steam-user';
import SteamTotp from 'steam-totp';

const client = new SteamUser();

const logOnOptions = {
    accountName: process.env.STEAM_USERNAME,
    password: process.env.STEAM_PASSWORD,
    twoFactorCode: SteamTotp.generateAuthCode(process.env.STEAM_SHARED_SECRET),
}

client.logOn(logOnOptions);

/* -------- HUSKELISTE --------
appid
tf2 = 440
cs2 = 730

classid er det som trengs for å identifisere itemet, alle keys har samme classid, assetid er forskjellige for
samme item


-------- TODO --------
js script for å generere identity og shared secret
kjøpe simkort for engangsbruk til å linke telefonnummer til steam konto

*/

// finne item-ids for alt jeg skal trade
client.on('tradeOffers', (offers) => {
    for (const offer of offers) {
        for (const item of offer.itemsToReceive) {
            console.log(
                `Item received:
                appid: ${item.appid}
                contextid: ${item.contextid}
                assetid: ${item.assetid}
                classid: ${item.classid}
                instanceid: ${item.instanceid}`
            );
        }
    }
});

