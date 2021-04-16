var admin = require("firebase-admin");

var serviceAccount = {
    "type": "service_account",
    "project_id": "fir-b9dbd",
    "private_key_id": "0a15b9601074def9bafb28ce629a00a62533c1c1",
    "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC3Emq/nuCae556\nJe2vk3fiHSzKe4lE8aMImNyTAhs2Rv0Jme5acctw8mV5P7O7q9drRVPK0xjQY8nP\nDsXxqfH2Yi9ejOO0GgaAOGLFb5bVXV0EQZXbZz81usXuxpbSKQZlyLlrB5g7VoAZ\nvYZrUM8hNWNKnwr8ferh3UGg1Qzqu+0TMGnA1TnlvbYfr8Xjj71jUv1XQjx/v5/P\n6+7t0J321E62VOh0Y2/PXxk7y/ZKYQS826424D924EPHj3r4VZAvEYt95zhEF9Wx\nrH4zEvQq0R+2CeuPemitrw0NowXhoJX4Z8aANJjvs2NdZb0DCdsg9sdesNY1mX6A\nc2Kmkh3zAgMBAAECggEAChMtZMDtmL2CNIlZ0fZ0+9tMgmgstGqdOkqPTlfTVOKw\nkj1dF1p5LmITS4pB7etrE4WL3aGjFUoolQiPGYRCGKPBT5wZUT64FN5a29q5m6G5\nDhQ97FvQ6A1l+doGpXzfKULT/BvoONEYg6d2ek7G12EExy/cKZZpvWcGcZTH/TL6\nhiXO/wYxba5eexC/chuTRjIM3y1ik1zfwnNCxs8V+7eyg6VsJrneOwsfuzPYWrO0\nZRHY3iZ0GzKpNTJnCme9B5QyH188TgRgV3Oq7HrME06g5hXtWmcLjXzuTbEPLvw3\nBEossK0DXp39xIRn9yTcJ1xaDgmeVbp5gf1CNF+tAQKBgQDnch1+yka4jePBDNas\nuB77AKeqw6bscnXmiZ9t8x2gTb2wlxe7GPPeukGKhC1BasZw0o/vOJOEpP7CaxfL\nhzdY9ocM5K1rGxwJugiVzJyI98FSuB4eSZ1Gwl8IJYL2riRZncJ6g0JCp17YW1Ul\n3Q/+Dnjw3eRB8YsQQEyWHjin4QKBgQDKfoHBEsT8SfQpNny9vAZJT3VBQ9rJO2qg\nPjq4GhT7MK6jwJqZzbYxz3WQiiDeDNZcBd27ZbG9QgWIwNAoDMrIorv3Ar9EILOb\nztmWz3wnARbiVGkMwK18EqX3eJcmAY7tS1L8SdzBiQ/Or8NsyCEwVuFMWVuNl8FC\nTg52e+mwUwKBgAqHCUpsHv1kDtkIIXenxFj8daPx1FTq++vplKPmrBFPl/JBXSX4\ng5c896A6VOil17LoEP37n9InwyLKxkFOvDjCte/jMvQtPoA+wwc1UGV2h4egslYE\nWTAPxUzUj/lygFrHL0JtWAU6IblLpjrbrE+NDvk9zpUlTIMHubQWWdNhAoGATQyw\nALBMphbZwejKtENcPP7wBeJ02Ic0Pj8Phsfd3eqbORHrgcSFpBRljpcQhI1r714I\nDetXI0WA55U+X07mxkstrIKuFpU+4nVl0/2lJw5CD+LAiiqymHhcEHshQEPth5tW\nu0q7piSqECJPARBxmHwmhC+oJ4tr7PfYhvsFY6MCgYEAyz07YMw9hRNzD4k4EYHF\nPURy+q7IoS9GtkuAv3zskjltE2if/RMmgwLPu92HzidlkR7sLmLioRcDMSJzP4PP\nO85qo8vfa5kH9njVqWwlaFctC7sVB+CVj7sLWNfsMkjMF/UJvMM712oehyB1pAa7\n9dyjr+Ft/ZvHWiCkRS9P8M4=\n-----END PRIVATE KEY-----\n",
    "client_email": "firebase-adminsdk-tyg97@fir-b9dbd.iam.gserviceaccount.com",
    "client_id": "101232631884225161652",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-tyg97%40fir-b9dbd.iam.gserviceaccount.com"
}


admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://fir-b9dbd-default-rtdb.firebaseio.com"
});

module.exports = { admin }