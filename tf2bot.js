require('dotenv').config();

const SteamUser = require('steam-user');
const SteamCommunity = require('steamcommunity');
const TradeOfferManager = require('steam-tradeoffer-manager');
const SteamTotp = require('steam-totp');
const fs = require('fs');

/*
appid: rust = 252490, tf2 = 440, cs2 = 730
contextid: 2 for all games above
classid identifies item type (e.g. all Mann Co. Keys share one classid)
assetid is the unique instance of a specific item in an inventory
*/

const client = new SteamUser();
const community = new SteamCommunity();
const manager = new TradeOfferManager({
    steam: client,
    community: community,
    language: 'en',
    pollInterval: 30000,
});

client.logOn({
    accountName: process.env.STEAMUSER,
    password: process.env.PASSWORD,
    twoFactorCode: SteamTotp.generateAuthCode(process.env.SHARED_SECRET),
});

client.on('loggedOn', () => {
    console.log('Logged into Steam');
    client.setPersona(SteamUser.EPersonaState.Online);
});

// Pass cookies to manager and community every time a web session is established
client.on('webSession', (sessionID, cookies) => {
    manager.setCookies(cookies, (err) => {
        if (err) {
            console.error('setCookies error:', err);
            process.exit(1);
        }
        console.log('Trade offer manager ready');
    });
    community.setCookies(cookies);
    community.startConfirmationChecker(10000, process.env.IDENTITY_SECRET);
});

// Save refresh token so we can log in without password on restart
client.on('refreshToken', (token) => {
    fs.writeFileSync('refresh-token.txt', token);
});

client.on('error', (err) => {
    console.error('Steam client error:', err);
});

// ── Trade offer handling ──────────────────────────────────────────────────────

manager.on('newOffer', (offer) => {
    const partner = offer.partner.getSteamID64();
    console.log(`New offer #${offer.id} from ${partner}`);

    offer.itemsToReceive.forEach(item => {
        console.log(`  Receiving: [appid:${item.appid}] [classid:${item.classid}] ${item.name}`);
    });
    offer.itemsToGive.forEach(item => {
        console.log(`  Giving:    [appid:${item.appid}] [classid:${item.classid}] ${item.name}`);
    });

    // TODO: replace with price evaluation logic
    offer.decline((err) => {
        if (err) console.error(`Failed to decline offer #${offer.id}:`, err);
        else console.log(`Declined offer #${offer.id}`);
    });
});

manager.on('sentOfferChanged', (offer, oldState) => {
    console.log(`Sent offer #${offer.id} changed: ${oldState} -> ${offer.state}`);
});
