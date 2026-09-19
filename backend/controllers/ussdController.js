const bcrypt = require('bcryptjs');
const User = require('../models/User');
const State = require('../models/State');
const LGA = require('../models/LGA');
const Ward = require('../models/Ward');
const FarmLocation = require('../models/FarmLocation');
const EmergencyContact = require('../models/EmergencyContact');
const CheckIn = require('../models/CheckIn');
const Alert = require('../models/Alert');
const { dispatchAlertSms } = require('../services/smsService');

const sessions = new Map();
const PAGE_SIZE = 8;

function getSession(sessionId) {
  if (!sessions.has(sessionId)) {
    sessions.set(sessionId, {
      step: 'INIT',
      data: {},
      page: 0,
    });
  }

  return sessions.get(sessionId);
}

function endSession(sessionId) {
  sessions.delete(sessionId);
}

function paginate(items, page) {
  const start = page * PAGE_SIZE;
  const itemsOnPage = items.slice(start, start + PAGE_SIZE);

  let text = itemsOnPage
    .map((item, i) => `${i + 1}. ${item.label}`)
    .join('\n');

  const hasMore = start + PAGE_SIZE < items.length;

  if (hasMore) {
    text += '\n9. More options';
  }

  if (page > 0) {
    text += '\n0. Back';
  }

  return {
    text,
    itemsOnPage,
    hasMore,
  };
}

exports.handleUssd = async (req, res) => {
  const { sessionId, phoneNumber, text } = req.body;

  const inputs = text ? text.split('*') : [];
  const lastInput = inputs[inputs.length - 1] || '';

  const session = getSession(sessionId);

  let response = '';

  try {
    response = await routeSession(
      session,
      phoneNumber,
      lastInput,
      inputs.length === 0
    );
  } catch (err) {
    console.error('USSD error:', err);

    response = 'END An error occurred. Please try again later.';
  }

  if (response.startsWith('END')) {
    endSession(sessionId);
  }

  res.set('Content-Type', 'text/plain');
  res.send(response);
};

async function routeSession(
  session,
  phoneNumber,
  input,
  isFirstRequest
) {
  /*
   * FIRST USSD REQUEST
   *
   * The farmer now gets access to:
   * 1. Register
   * 2. Login
   * 3. Panic Alert
   * 0. Exit
   *
   * Panic does not require PIN authentication.
   */
  if (isFirstRequest) {
    session.data.phoneNumber = normalizePhone(phoneNumber);
    session.step = 'INITIAL_MENU';

    return (
      'CON WELCOME TO FSDAMS\n' +
      '1. Register\n' +
      '2. Login\n' +
      '3. Panic Alert\n' +
      '0. Exit'
    );
  }

  switch (session.step) {
    case 'INITIAL_MENU':
      return handleInitialMenu(session, input, phoneNumber);

    case 'NEW_USER_MENU':
      return handleNewUserMenu(session, input, phoneNumber);

    case 'LOGIN_PIN':
      return handleLoginPin(session, input);

    case 'REG_NAME':
      return handleRegName(session, input);

    case 'REG_PIN':
      return handleRegPin(session, input);

    case 'REG_PIN_CONFIRM':
      return handleRegPinConfirm(session, input);

    case 'REG_STATE':
      return handleRegState(session, input);

    case 'REG_LGA':
      return handleRegLga(session, input);

    case 'REG_WARD':
      return handleRegWard(session, input, phoneNumber);

    case 'REG_CONTACTS_PROMPT':
      return handleRegContactsPrompt(session, input);

    case 'REG_CONTACT_NAME':
      return handleContactName(
        session,
        input,
        'REG_CONTACT_NAME'
      );

    case 'REG_CONTACT_PHONE':
      return handleContactPhone(
        session,
        input,
        'REG_CONTACT_PHONE'
      );

    case 'REG_CONTACT_REL':
      return handleContactRel(
        session,
        input,
        'REG_CONTACT_NAME',
        afterRegContactsDone
      );

    case 'MAIN_MENU':
      return handleMainMenu(session, input);

    case 'CHECKIN_SELECT_FARM':
      return handleCheckinSelectFarm(session, input);

    case 'CHECKIN_DURATION':
      return handleCheckinDuration(session, input);

    case 'PANIC_CONFIRM':
      return handlePanicConfirm(session, input);

    case 'PUBLIC_PANIC_CONFIRM':
      return handlePublicPanicConfirm(
        session,
        input,
        phoneNumber
      );

    case 'FARMS_MENU':
      return handleFarmsMenu(session, input);

    case 'FARM_ADD_NAME':
      return handleFarmAddName(session, input);

    case 'FARM_ADD_CROP':
      return handleFarmAddCrop(session, input);

    case 'FARM_ADD_SIZE':
      return handleFarmAddSize(session, input);

    case 'CONTACTS_MENU':
      return handleContactsMenu(session, input);

    case 'CONTACTS_SET_NAME':
      return handleContactName(
        session,
        input,
        'CONTACTS_SET_NAME'
      );

    case 'CONTACTS_SET_PHONE':
      return handleContactPhone(
        session,
        input,
        'CONTACTS_SET_PHONE'
      );

    case 'CONTACTS_SET_REL':
      return handleContactRel(
        session,
        input,
        'CONTACTS_SET_NAME',
        afterContactsSetDone
      );

    default:
      return 'END Session expired. Please dial again.';
  }
}

function normalizePhone(phone) {
  let digits = String(phone || '').replace(/\D/g, '');

  if (digits.startsWith('234')) {
    return '0' + digits.slice(3);
  }

  return digits;
}

/*
 * INITIAL USSD MENU
 */
async function handleInitialMenu(
  session,
  input,
  phoneNumber
) {
  const normalizedPhone = normalizePhone(phoneNumber);

  switch (input) {
    case '1':
      session.step = 'REG_NAME';

      return 'CON Enter your full name:';

    case '2': {
      const existing = await User.findOne({
        phone: normalizedPhone,
        role: 'farmer',
      });

      if (!existing) {
        return (
          'END No farmer account found for this number. ' +
          'Please dial again and select Register.'
        );
      }

      session.data.userId = existing._id.toString();
      session.step = 'LOGIN_PIN';

      return 'CON Enter your PIN:';
    }

    case '3':
      session.step = 'PUBLIC_PANIC_CONFIRM';

      return (
        'CON PANIC ALERT\n' +
        'Are you in an emergency?\n' +
        '1. YES - SEND ALERT\n' +
        '2. CANCEL'
      );

    case '0':
      return 'END Goodbye.';

    default:
      session.step = 'INITIAL_MENU';

      return (
        'CON Invalid option.\n\n' +
        'WELCOME TO FSDAMS\n' +
        '1. Register\n' +
        '2. Login\n' +
        '3. Panic Alert\n' +
        '0. Exit'
      );
  }
}

async function handleLoginPin(session, input) {
  const user = await User.findById(session.data.userId);

  if (!user) {
    return 'END Account not found. Please dial again.';
  }

  const match = await bcrypt.compare(input, user.pin);

  if (!match) {
    return 'END Incorrect PIN. Please dial again.';
  }

  session.data.user = user;
  session.step = 'MAIN_MENU';

  return `CON ${mainMenuText()}`;
}

async function handleNewUserMenu(
  session,
  input,
  phoneNumber
) {
  if (input === '1') {
    session.step = 'REG_NAME';

    return 'CON Enter your full name:';
  }

  return 'END Goodbye.';
}

async function handleRegName(session, input) {
  session.data.fullName = input;

  session.step = 'REG_PIN';

  return 'CON Create a 4-digit PIN:';
}

async function handleRegPin(session, input) {
  if (!/^\d{4}$/.test(input)) {
    return 'CON PIN must be exactly 4 digits. Try again:';
  }

  session.data.pin = input;
  session.step = 'REG_PIN_CONFIRM';

  return 'CON Confirm your PIN:';
}

async function handleRegPinConfirm(session, input) {
  if (input !== session.data.pin) {
    return 'END PINs did not match. Please dial again.';
  }

  session.step = 'REG_STATE';
  session.page = 0;

  const states = await State.find().sort('name');

  session.data.statesCache = states.map((s) => ({
    id: s._id.toString(),
    label: s.name,
  }));

  const { text } = paginate(
    session.data.statesCache,
    0
  );

  return `CON Select your State:\n${text}`;
}

async function handleRegState(session, input) {
  const nav = handlePaginationNav(
    session,
    input,
    session.data.statesCache
  );

  if (nav) {
    return nav;
  }

  const selected = resolveSelection(
    session,
    input,
    session.data.statesCache
  );

  if (!selected) {
    return 'END Invalid selection.';
  }

  session.data.stateId = selected.id;
  session.step = 'REG_LGA';
  session.page = 0;

  const lgas = await LGA.find({
    state: selected.id,
  }).sort('name');

  session.data.lgasCache = lgas.map((l) => ({
    id: l._id.toString(),
    label: l.name,
  }));

  const { text } = paginate(
    session.data.lgasCache,
    0
  );

  return `CON Select your LGA:\n${text}`;
}

async function handleRegLga(session, input) {
  const nav = handlePaginationNav(
    session,
    input,
    session.data.lgasCache
  );

  if (nav) {
    return nav;
  }

  const selected = resolveSelection(
    session,
    input,
    session.data.lgasCache
  );

  if (!selected) {
    return 'END Invalid selection.';
  }

  session.data.lgaId = selected.id;
  session.step = 'REG_WARD';
  session.page = 0;

  const wards = await Ward.find({
    lga: selected.id,
  }).sort('name');

  session.data.wardsCache = wards.map((w) => ({
    id: w._id.toString(),
    label: w.name,
  }));

  const { text } = paginate(
    session.data.wardsCache,
    0
  );

  return `CON Select your Ward:\n${text}`;
}

async function handleRegWard(
  session,
  input,
  phoneNumber
) {
  const nav = handlePaginationNav(
    session,
    input,
    session.data.wardsCache
  );

  if (nav) {
    return nav;
  }

  const selected = resolveSelection(
    session,
    input,
    session.data.wardsCache
  );

  if (!selected) {
    return 'END Invalid selection.';
  }

  const hashedPin = await bcrypt.hash(
    session.data.pin,
    10
  );

  const user = await User.create({
    fullName: session.data.fullName,
    phone: normalizePhone(phoneNumber),
    pin: hashedPin,
    role: 'farmer',
    state: session.data.stateId,
    lga: session.data.lgaId,
    ward: selected.id,
  });

  session.data.user = user;

  session.step = 'REG_CONTACTS_PROMPT';

  return (
    'CON Account created!\n' +
    'Add your 3 emergency contacts now?\n' +
    '1. Yes\n' +
    '2. Skip for now'
  );
}

async function handleRegContactsPrompt(
  session,
  input
) {
  if (input === '2') {
    session.step = 'MAIN_MENU';

    return (
      'CON Setup saved. You can add contacts and farms later.\n\n' +
      mainMenuText()
    );
  }

  session.data.contacts = [];
  session.step = 'REG_CONTACT_NAME';

  return 'CON Contact 1 - Enter name:';
}

async function handleContactName(
  session,
  input,
  currentStep
) {
  session.data.currentContact = {
    name: input,
  };

  session.step =
    currentStep === 'CONTACTS_SET_NAME'
      ? 'CONTACTS_SET_PHONE'
      : 'REG_CONTACT_PHONE';

  return 'CON Enter their phone number:';
}

async function handleContactPhone(
  session,
  input,
  currentStep
) {
  session.data.currentContact.phone = input;

  session.step =
    currentStep === 'CONTACTS_SET_PHONE'
      ? 'CONTACTS_SET_REL'
      : 'REG_CONTACT_REL';

  return 'CON Relationship (e.g. Wife, Brother):';
}

async function handleContactRel(
  session,
  input,
  loopBackStep,
  doneCallback
) {
  session.data.currentContact.relationship =
    input;

  session.data.contacts.push(
    session.data.currentContact
  );

  session.data.currentContact = null;

  if (session.data.contacts.length < 3) {
    session.step = loopBackStep;

    return (
      `CON Contact ${session.data.contacts.length + 1} - ` +
      'Enter name:'
    );
  }

  return doneCallback(session);
}

async function afterRegContactsDone(session) {
  await EmergencyContact.insertMany(
    session.data.contacts.map((c) => ({
      ...c,
      farmer: session.data.user._id,
    }))
  );

  session.step = 'MAIN_MENU';

  return (
    'CON All 3 contacts saved.\n\n' +
    mainMenuText()
  );
}

async function afterContactsSetDone(session) {
  await EmergencyContact.deleteMany({
    farmer: session.data.user._id,
  });

  await EmergencyContact.insertMany(
    session.data.contacts.map((c) => ({
      ...c,
      farmer: session.data.user._id,
    }))
  );

  session.step = 'MAIN_MENU';

  return (
    'CON Emergency contacts updated.\n\n' +
    mainMenuText()
  );
}

function mainMenuText() {
  return (
    'Main Menu:\n' +
    '1. Check In\n' +
    '2. Check Out\n' +
    '3. Panic Alert\n' +
    '4. My Farms\n' +
    '5. Emergency Contacts\n' +
    '6. My Status\n' +
    '0. Exit'
  );
}

async function handleMainMenu(session, input) {
  const userId = session.data.user._id;

  switch (input) {
    case '1': {
      const farms = await FarmLocation.find({
        farmer: userId,
        'gps.lat': { $exists: true },
      });

      if (farms.length === 0) {
        return (
          'END You have no farms with a location set. ' +
          'Add a farm location on the FSDAMS app first, then check in.'
        );
      }

      const activeSession = await CheckIn.findOne({
        farmer: userId,
        status: 'active',
      });

      if (activeSession) {
        return (
          'END You already have an active check-in. ' +
          'Please check out first.'
        );
      }

      session.data.farmsCache = farms.map((f) => ({
        id: f._id.toString(),
        label: f.farmName,
        gps: f.gps,
      }));

      session.step = 'CHECKIN_SELECT_FARM';
      session.page = 0;

      const { text } = paginate(
        session.data.farmsCache,
        0
      );

      return `CON Select farm to check in:\n${text}`;
    }

    case '2': {
      const activeSession = await CheckIn.findOne({
        farmer: userId,
        status: 'active',
      });

      if (!activeSession) {
        return 'END You have no active check-in.';
      }

      activeSession.status = 'completed';
      activeSession.checkOutTime = new Date();

      await activeSession.save();

      await User.findByIdAndUpdate(userId, {
        status: 'idle',
      });

      return (
        'END You have checked out safely. Stay safe!'
      );
    }

    case '3':
      session.step = 'PANIC_CONFIRM';

      return (
        'CON Send emergency alert to your contacts, ' +
        'coordinator and security post?\n' +
        '1. YES\n' +
        '2. Cancel'
      );

    case '4':
      session.step = 'FARMS_MENU';

      return (
        'CON My Farms:\n' +
        '1. View my farms\n' +
        '2. Add new farm\n' +
        '0. Back'
      );

    case '5':
      session.step = 'CONTACTS_MENU';

      return (
        'CON Emergency Contacts:\n' +
        '1. View contacts\n' +
        '2. Set/replace all 3\n' +
        '0. Back'
      );

    case '6': {
      const activeSession = await CheckIn.findOne({
        farmer: userId,
        status: { $ne: 'completed' },
      })
        .populate('farm')
        .sort('-checkInTime');

      if (
        !activeSession ||
        activeSession.status === 'completed'
      ) {
        return 'END You have no active session right now.';
      }

      return (
        `END Status: ${activeSession.status}\n` +
        `Farm: ${activeSession.farm?.farmName || 'N/A'}\n` +
        `Expected return: ${new Date(
          activeSession.expectedReturnBy
        ).toLocaleString()}`
      );
    }

    case '0':
      return 'END Goodbye.';

    default:
      return 'END Goodbye.';
  }
}

async function handleCheckinSelectFarm(
  session,
  input
) {
  const nav = handlePaginationNav(
    session,
    input,
    session.data.farmsCache
  );

  if (nav) {
    return nav;
  }

  const selected = resolveSelection(
    session,
    input,
    session.data.farmsCache
  );

  if (!selected) {
    return 'END Invalid selection.';
  }

  session.data.selectedFarm = selected;
  session.step = 'CHECKIN_DURATION';

  return (
    'CON How long will you be at the farm?\n' +
    '1. 2 hours\n' +
    '2. 4 hours\n' +
    '3. 6 hours\n' +
    '4. 8 hours'
  );
}

async function handleCheckinDuration(
  session,
  input
) {
  const hoursMap = {
    '1': 2,
    '2': 4,
    '3': 6,
    '4': 8,
  };

  const hours = hoursMap[input];

  if (!hours) {
    return 'END Invalid selection.';
  }

  const expectedReturnBy = new Date(
    Date.now() + hours * 3600000
  );

  await CheckIn.create({
    farmer: session.data.user._id,
    farm: session.data.selectedFarm.id,
    expectedReturnBy,
    gpsAtCheckIn: session.data.selectedFarm.gps,
  });

  await User.findByIdAndUpdate(
    session.data.user._id,
    {
      status: 'checked-in',
    }
  );

  return (
    `END Checked in to ${session.data.selectedFarm.label}. ` +
    `Expected return: ${expectedReturnBy.toLocaleTimeString()}. ` +
    'Stay safe!'
  );
}

/*
 * PUBLIC PANIC ALERT
 *
 * This is used from the initial USSD menu.
 *
 * No PIN is required.
 * No phone number needs to be typed by the farmer.
 *
 * Africa's Talking supplies the phone number in phoneNumber.
 */
async function handlePublicPanicConfirm(
  session,
  input,
  phoneNumber
) {
  if (input !== '1') {
    return 'END Panic alert cancelled.';
  }

  const normalizedPhone = normalizePhone(
    phoneNumber
  );

  const user = await User.findOne({
    phone: normalizedPhone,
    role: 'farmer',
  });

  if (!user) {
    return (
      'END No FSDAMS farmer account was found for this number. ' +
      'Please register first.'
    );
  }

  const activeCheckIn = await CheckIn.findOne({
    farmer: user._id,
    status: 'active',
  });

  /*
   * First priority:
   * Use the farmer's active check-in location.
   *
   * Second priority:
   * Use a saved farm location.
   */
  let gps = activeCheckIn?.gpsAtCheckIn;

  if (!gps) {
    const farm = await FarmLocation.findOne({
      farmer: user._id,
      'gps.lat': { $exists: true },
      'gps.lng': { $exists: true },
    });

    gps = farm?.gps;
  }

  if (!gps) {
    return (
      'END Unable to send alert because no location is available. ' +
      'Please set a farm location in the FSDAMS app first.'
    );
  }

  /*
   * If the farmer was already checked in,
   * change the active check-in to emergency.
   */
  if (activeCheckIn) {
    activeCheckIn.status = 'emergency';
    await activeCheckIn.save();
  }

  await User.findByIdAndUpdate(
    user._id,
    {
      status: 'emergency',
    }
  );

  const alert = await Alert.create({
    farmer: user._id,
    checkIn: activeCheckIn?._id || null,
    type: 'panic',
    gps,
    ward: user.ward,
    recipients: [],
  });

  /*
   * Use the existing SMS dispatch system.
   */
  const recipients = await dispatchAlertSms(
    alert,
    user
  );

  alert.recipients = recipients;

  await alert.save();

  return (
    'END Emergency alert sent to your contacts, ' +
    'coordinator and security post.'
  );
}

/*
 * AUTHENTICATED PANIC ALERT
 *
 * This is used after:
 * Login → PIN → Main Menu → 3. Panic Alert
 */
async function handlePanicConfirm(
  session,
  input
) {
  if (input !== '1') {
    return 'END Cancelled.';
  }

  const userId = session.data.user._id;

  const user = await User.findById(userId);

  if (!user) {
    return 'END Account not found. Please dial again.';
  }

  const activeCheckIn = await CheckIn.findOne({
    farmer: userId,
    status: 'active',
  });

  let gps = activeCheckIn?.gpsAtCheckIn;

  if (!gps) {
    const anyFarm = await FarmLocation.findOne({
      farmer: userId,
      'gps.lat': { $exists: true },
    });

    gps = anyFarm?.gps;
  }

  if (!gps) {
    return (
      'END Unable to send alert: no location on file. ' +
      'Please set a farm location on the app first.'
    );
  }

  if (activeCheckIn) {
    activeCheckIn.status = 'emergency';

    await activeCheckIn.save();
  }

  await User.findByIdAndUpdate(
    userId,
    {
      status: 'emergency',
    }
  );

  const alert = await Alert.create({
    farmer: userId,
    checkIn: activeCheckIn?._id || null,
    type: 'panic',
    gps,
    ward: user.ward,
    recipients: [],
  });

  const recipients = await dispatchAlertSms(
    alert,
    user
  );

  alert.recipients = recipients;

  await alert.save();

  return (
    'END Emergency alert sent to your contacts, ' +
    'coordinator and security post.'
  );
}

async function handleFarmsMenu(
  session,
  input
) {
  const userId = session.data.user._id;

  if (input === '1') {
    const farms = await FarmLocation.find({
      farmer: userId,
    });

    if (farms.length === 0) {
      return 'END You have no farms yet.';
    }

    const list = farms
      .map(
        (f, i) =>
          `${i + 1}. ${f.farmName}${
            f.gps?.lat ? '' : ' (no location set)'
          }`
      )
      .join('\n');

    return `END Your Farms:\n${list}`;
  }

  if (input === '2') {
    session.step = 'FARM_ADD_NAME';

    return 'CON Enter farm name:';
  }

  session.step = 'MAIN_MENU';

  return `CON ${mainMenuText()}`;
}

async function handleFarmAddName(
  session,
  input
) {
  session.data.newFarm = {
    farmName: input,
  };

  session.step = 'FARM_ADD_CROP';

  return (
    'CON Crop type:\n' +
    '1. Rice\n' +
    '2. Maize\n' +
    '3. Millet\n' +
    '4. Sorghum\n' +
    '5. Groundnut\n' +
    '6. Cassava\n' +
    '7. Vegetables\n' +
    '8. Other'
  );
}

async function handleFarmAddCrop(
  session,
  input
) {
  const crops = {
    '1': 'Rice',
    '2': 'Maize',
    '3': 'Millet',
    '4': 'Sorghum',
    '5': 'Groundnut',
    '6': 'Cassava',
    '7': 'Vegetables',
    '8': 'Other',
  };

  session.data.newFarm.cropType =
    crops[input] || 'Other';

  session.step = 'FARM_ADD_SIZE';

  return 'CON Farm size (e.g. 5 Acres):';
}

async function handleFarmAddSize(
  session,
  input
) {
  session.data.newFarm.farmSize = input;

  await FarmLocation.create({
    farmer: session.data.user._id,
    ...session.data.newFarm,
  });

  return (
    'END Farm saved without a map location. ' +
    'Please open the FSDAMS app to set its exact location ' +
    'before checking in there.'
  );
}

async function handleContactsMenu(
  session,
  input
) {
  const userId = session.data.user._id;

  if (input === '1') {
    const contacts = await EmergencyContact.find({
      farmer: userId,
    });

    if (contacts.length === 0) {
      return 'END No emergency contacts set yet.';
    }

    const list = contacts
      .map(
        (c, i) =>
          `${i + 1}. ${c.name} (${c.relationship}) - ${c.phone}`
      )
      .join('\n');

    return `END Your Emergency Contacts:\n${list}`;
  }

  if (input === '2') {
    session.data.contacts = [];
    session.step = 'CONTACTS_SET_NAME';

    return 'CON Contact 1 - Enter name:';
  }

  session.step = 'MAIN_MENU';

  return `CON ${mainMenuText()}`;
}

function handlePaginationNav(
  session,
  input,
  cache
) {
  if (input === '9') {
    session.page += 1;

    return renderPage(session, cache);
  }

  if (
    input === '0' &&
    session.page > 0
  ) {
    session.page -= 1;

    return renderPage(session, cache);
  }

  return null;
}

function renderPage(session, cache) {
  const { text } = paginate(
    cache,
    session.page
  );

  return `CON ${text}`;
}

function resolveSelection(
  session,
  input,
  cache
) {
  const index =
    parseInt(input, 10) - 1;

  if (
    isNaN(index) ||
    index < 0
  ) {
    return null;
  }

  const absoluteIndex =
    session.page * PAGE_SIZE + index;

  return cache[absoluteIndex] || null;
}