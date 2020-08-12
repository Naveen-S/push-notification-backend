const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const webPush = require('web-push');

const app = express();
app.use(cors());
app.use(bodyParser.json());
const port = 4000;

const vapidKeys = {
    publicKey: 'BDJVVOgusKL4rEmSp9f63wIOYsRkaXF4sQIiNz5393JEPTSlmCCINPMorBhgm0Jai3V0o0f7mLDevOo6ME1OOxs',
    privateKey: 'ZuginnsFVx-8dc_8JEZ3dXG83QmVlwmyIZ-7UAt_KSE'
}

// Configure webPush
webPush.setVapidDetails(
    'mailto:naveen@perfios.com',
    vapidKeys.publicKey,
    vapidKeys.privateKey
);

app.get('/', (req, res) => {
    res.send('Push notification backend!');
});

const dummyDB = {subscription: null};
const saveToDatabase = async subscription => {
    dummyDB.subscription = subscription;
}

// function to send the notification to the subscribed device
const sendNotification = (subscription, dataToSend='') => {
    webPush.sendNotification(subscription,dataToSend);
}


app.post('/save-subscription', async (req, res) => {
    const subscription = req.body;
    await saveToDatabase(subscription);
    res.json({message: 'success'});
})

app.get('/send-notification', (req, res) => {
    const subscription = dummyDB.subscription;
    const message = 'Hello World, my first Push notification';
    sendNotification(subscription, message);
    res.json({message: 'message sent'});
})

app.listen(port, () => {
    console.log(`Listening on the port: ${port}`);
})