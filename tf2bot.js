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

/* -------- NOTES --------
appid
tf2 = 440
cs2 = 730


classid is whats needed to identify item, all keys have same classid, assetid is different for same item (?)


-------- TODO --------



*/

// finding item-ids
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

