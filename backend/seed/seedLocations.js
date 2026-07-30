require('dotenv').config();
const mongoose = require('mongoose');
const State = require('../models/State');
const LGA = require('../models/LGA');
const Ward = require('../models/Ward');
const SecurityPost = require('../models/SecurityPost');
const SystemSettings = require('../models/SystemSettings');

const plateauLGAs = {
  'Jos North': ["Jenta Adamu", "Jenta Apata", "Jos Jarawa", "Naraguta A", "Naraguta B", "Sarkin Arab", "Tudun Wada/Kabong", "Vanderpuye"],
  'Jos South': ['Bukuru', "Gyel A", "Gyel B", "Kuru A", 'Turu', 'Vwang', "Zawan A", "Zawan B"],
  'Jos East': ['Jos East Ward 1'],
  'Bassa': ['Bassa Ward 1'],
  'Barkin Ladi': ['Barkin Ladi', 'Foron', 'Gashish', 'Heipang', 'Kuru Karama'],
  'Bokkos': ['Bokkos', 'Daffo', 'Manguna', 'Mushere', 'Toff'],
  'Mangu': ['Mangu Halle', 'Panyam', 'Kerang', 'Gindiri', 'Mangu'],
  'Riyom': ['Danto', 'Jol/Kwi', 'Ra-Hoss', 'Rim', 'Riyom', 'Sharubutu', 'Sopp'],
  'Kanam': ['Dengi', 'Gumsher', 'Gwamlar', 'Jarmai', 'Munbutbo'],
  'Kanke': ["Ampang-East", "Amper Chika A", "Amper Chika B", "Amper Seri", 'Dawaki', 'Kabwir Pada', 'Kabwir/Gyangyang', 'Langshi', 'Nemel'],
  'Langtang North': ['Funyalang', 'Jat', 'Keller', 'Kuffen', 'Kwande', 'Lipchok', 'Mban/Zamko', 'Pajat', 'Waroh'],
  'Langtang South': ['Dadin Kowa'],
  'Mikang': ["Mikang East", "Koenoem A", "Koenoem B", 'Lalin', "Piapung A", "Piapung B", 'Tunkus'],
  'Pankshin': ['Chip', 'Dok-Pai', 'Fier', 'Jiblik', 'Kadung', 'Kangshu', 'Lankang', 'Pankshin Central', 'Pankshin Chigwong', 'Pankshin South (Belning)', 'Tal', 'Wokkos'],
  "Qua'an Pan": ['Bwall', 'Doemak-Goechim', 'Doemak-Koplong', 'Dokan Kasuwa', 'Kurgwi', 'Kwa', 'Kwalla Moeda', "Kwalla Yitla'ar", 'Kwande', 'Kwang', 'Namu'],
  'Shendam': ['Yelwa'],
  'Wase': ['Bashar', 'Danbiram', 'Gudus', 'Kadarko', 'Kumbong', 'Kumbur', 'Kuyambana', 'Mavo', 'Saluwe', 'Wase Tofa', 'Yola Wakat'],
};

const gombeLGAs = {
  Akko: ['Akko', 'Garko', 'Kalshingi', 'Kumo Central', 'Pindiga'],
  Balanga: ['Dadiya', 'Gelengu/Balanga', 'Kulani/Degre/Sikkam', 'Talasse/Dong/Reme'],
  Billiri: ['Baganje South', 'Bare', 'Billiri North', 'Billiri South', 'Kalmai'],
  Dukku: ['Jamari', 'Waziri North'],
  Funakaye: ['Ashaka/Magaba', 'Bage', 'Bajoga West', 'Bajoga East', 'Bodor/Tilde', 'Jillahi', 'Kupto', 'Tongo'],
  Gombe: ['Ajiya', 'Bajoga', 'Bolari East', 'Bolari West', 'Dawaki', 'Herwagana', 'Jeka Dafari', 'Kumbiya-Kumbiya', 'Nasarawa', 'Pantami', 'Shamaki'],
  Kaltungo: ['Awak', 'Kaltungo West'],
  Kwami: ['Bojude', 'Doho', 'Dukul', 'Gadam', 'Jurara', 'Kwami', 'Malam Sidi', 'Malleri'],
  Nafada: ['Birin Bolewa', 'Birin Fulani West', 'Jigawa', 'Nafada Central', 'Nafada East', 'Nafada West'],
  Shongom: ['Burak', 'Filiya', 'Kulishin', 'Lalaipido', 'Lapan'],
  'Yamaltu/Deba': ['Deba', 'Difa/Lubo/Kinafa', 'Gwani/Shinga/Wade', 'Hinna', 'Jagali North', 'Jagali South', 'Kanawa/Wajari', 'Kuri/Lano/Lambam', 'Kwadon/Liji/Kurba', 'Zambul/Kwali'],
};

const bauchiLGAs = {
  Alkaleri: ['Alkaleri', 'Gar', 'Gwaram', 'Dan Kungibar', 'Yuli/Lim', 'Gwana/Mansur'],
  Bauchi: ["Majidadi 'A'", "Majidadi 'B'", 'Makama/Sarki Baki', 'Zungur/Liman Katagum', 'Birshi/Miri', 'Kangyare/Turwun', 'Galambi/Gwaskwaram', "Dan'iya Hardo", 'Dawaki'],
  Dambam: ['Garuza', 'Gurbana', 'Dambam', 'Yanda', 'Yame', 'Dagauda', 'Gargawa', 'Zaura', 'Jalam Central', 'Jalam East'],
  Darazo: ['Darazo', 'Tauya', 'Gabarin', 'Konkiyal', 'Lago', 'Sade', 'Lanzai', 'Gabciyari', 'Wahu', 'Papa'],
  Dass: ['Bagel/Bajar', 'Bununu Central', 'Bununu South', 'Dott', 'Wandi'],
  Gamawa: ['Gamawa', 'Gololo', 'Kubdiya', 'Alagarno/Jadori', 'Tarmasuwa', 'Raga', 'Zindi'],
  Ganjuwa: ['Kafin Madaki', 'Kariya', 'Nasarawa North', 'Yali'],
  Giade: ['Chinkani', 'Sabon Sara', 'Doguwa Central', 'Giade', 'U. Zum A', 'Zabi'],
  'Itas/Gadau': ['Itas/Gadau Ward 1'],
  "Jama'are": ["Jama'are Ward 1"],
  Katagum: ['Tsakuwa Kofar Gabas/Kofar Kuka', 'Nasarawa Bakin Kasuwa', 'Madangala', 'Madara', 'Gambaki/Bidir', 'Chinade', 'Yayu', 'Madachi/Gangai'],
  Kirfi: ['Kirfi Ward 1'],
  Misau: ['Zadawa', 'Beti', 'Jarkasa', 'Kukadi/Gundari', 'Ajilin/Gugulin', 'Tofu', 'Hardawa', 'Sarma/Akuyam', 'Sirko', 'Gwaram'],
  Ningi: ['Dingis', 'Jangu', 'Balma', 'Tiffi/Guda', 'Bashe'],
  Shira: ['Shira Ward 1'],
  'Tafawa Balewa': ["Kardam 'A'", "Kardam 'B'", 'Lere South', 'Tapshin', 'Wai', 'Ball', 'Bula', 'Dajin', 'Bununu'],
  Toro: ['Toro/Tulai', 'Tilden Fulani', 'Ribina', 'Mara/Palama', "Jama'a/Zaranda", 'Lame', 'Wonu', 'Zalau/Rishi', 'Rahama'],
  Warji: ['Baima South/East', 'Dagu East', 'Gabanga', 'Katanga', 'Rangan', 'Tiyin', 'Kilbori', 'Tudun Wada West'],
  Zaki: ['Bursali', 'Katagum', 'Tashena/Gadai', 'Makawa', 'Sakwa', 'Gumai', 'Murmur North', 'Murmur South', 'Alangawari/Kafin/Larabawa', 'Maiwa', 'Mainako'],
};

async function seedState(stateName, lgaMap) {
  let state = await State.findOne({ name: stateName });
  if (!state) state = await State.create({ name: stateName });

  let wardCount = 0;
  for (const [lgaName, wards] of Object.entries(lgaMap)) {
    let lga = await LGA.findOne({ name: lgaName, state: state._id });
    if (!lga) lga = await LGA.create({ name: lgaName, state: state._id });

    await Ward.deleteMany({ lga: lga._id, name: { $regex: /Ward 1$/ } });

    for (const wardName of wards) {
      const exists = await Ward.findOne({ name: wardName, lga: lga._id });
      if (!exists) { await Ward.create({ name: wardName, lga: lga._id }); wardCount++; }
    }
  }
  console.log(`✅ ${stateName}: ${Object.keys(lgaMap).length} LGAs, ${wardCount} wards seeded`);
}

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected. Seeding location data...');

  await seedState('Plateau', plateauLGAs);
  await seedState('Gombe', gombeLGAs);
  await seedState('Bauchi', bauchiLGAs);

  const demoWard = await Ward.findOne({ name: 'Jenta Adamu' });
  if (demoWard) {
    const exists = await SecurityPost.findOne({ ward: demoWard._id });
    if (!exists) {
      await SecurityPost.create({ name: 'Jos North Central Post', phone: '+2348031112233', ward: demoWard._id });
    }
  }

  const settingsExist = await SystemSettings.findOne();
  if (!settingsExist) await SystemSettings.create({});

  console.log('✅ Seed complete — Plateau, Gombe, Bauchi with real ward names');
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
