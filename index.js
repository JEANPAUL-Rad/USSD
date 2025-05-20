
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// ✅ NEW: Health check endpoint to test if app is live
app.get('/health', (req, res) => {
    res.send('✅ App is running');
});

// ✅ Updated USSD route with logging for debugging
app.post('/ussd', (req, res) => {
    // ✅ NEW: Log full request body to monitor USSD request payload
    console.log('📥 Incoming USSD request:', req.body);

    const { sessionId, serviceCode, phoneNumber, text } = req.body;

    let response = '';

    const textValue = text.split('*'); // ✅ split user input to determine steps
    const level = textValue.length;

    // ✅ STEP 1: Language selection (first screen if text is empty)
    if (text === '') {
        response = `CON Choose your language / Hitamo ururimi\n1. English\n2. Kinyarwanda`;
    } 
    
    // ✅ STEP 2: English language selected
    else if (textValue[0] === '1') {
        if (level === 1) {
            response = `CON What would you like to check?\n1. My account\n2. My phone number`;
        } else if (text === '1*1') {
            response = `CON Choose account information you want to view\n1. Account number`;
        } else if (text === '1*2') {
            response = `END Your phone number is ${phoneNumber}`;
        } else if (text === '1*1*1') {
            const accountNumber = 'ACC100101';
            response = `END Your account number is ${accountNumber}`;
        } else {
            response = `END Invalid option`;
        }
    } 
    
    // ✅ STEP 3: Kinyarwanda language selected
    else if (textValue[0] === '2') {
        if (level === 1) {
            response = `CON Icyo ushaka kureba ni iki?\n1. Konti yanjye\n2. Nimero yanjye ya telefone`;
        } else if (text === '2*1') {
            response = `CON Hitamo amakuru ya konti wifuza kureba\n1. Nimero ya konti`;
        } else if (text === '2*2') {
            response = `END Nimero yawe ya telefone ni ${phoneNumber}`;
        } else if (text === '2*1*1') {
            const accountNumber = 'ACC100101';
            response = `END Nimero ya konti yawe ni ${accountNumber}`;
        } else {
            response = `END Hitamo ntibashije kumvwa`;
        }
    } 
    
    // ✅ Fallback: invalid main option
    else {
        response = `END Invalid input`;
    }

    res.set('Content-Type', 'text/plain'); // ✅ Required by Africa's Talking
    res.send(response);
});

// ✅ App start log
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`✅ USSD app running on port ${PORT}`);
});








// const express = require('express');
// const bodyParser = require('body-parser');

// const app = express();
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));

// app.post('/ussd', (req, res) => {
//     const { sessionId, serviceCode, phoneNumber, text } = req.body;

//     let response = '';

//     if (text === '') {
//         response = `CON What would you like to check?
// 1. My account
// 2. My phone number`;
//     } else if (text === '1') {
//         response = `CON Choose account information you want to view
// 1. Account number`;
//     } else if (text === '2') {
//         response = `END Your phone number is ${phoneNumber}`;
//     } else if (text === '1*1') {
//         const accountNumber = 'ACC100101';
//         response = `END Your account number is ${accountNumber}`;
//     } else {
//         response = `END Invalid option`;
//     }

//     res.set('Content-Type', 'text/plain'); // ✅ Corrected (was a syntax error)
//     res.send(response);
// });

// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//     console.log(`✅ USSD app running on port ${PORT}`);
// });
