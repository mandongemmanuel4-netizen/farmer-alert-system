const EmergencyContact = require('../models/EmergencyContact');

exports.getMyContacts = async (req, res) => {
  const contacts = await EmergencyContact.find({ farmer: req.user.id });
  res.json(contacts);
};

exports.setContacts = async (req, res) => {
  try {
    const { contacts } = req.body;

    if (!Array.isArray(contacts) || contacts.length !== 3) {
      return res.status(400).json({ message: 'You must provide exactly 3 emergency contacts' });
    }
    for (const c of contacts) {
      if (!c.name || !c.phone || !c.relationship) {
        return res.status(400).json({ message: 'Each contact needs a name, phone, and relationship' });
      }
    }

    await EmergencyContact.deleteMany({ farmer: req.user.id });
    const created = await EmergencyContact.insertMany(
      contacts.map((c) => ({ ...c, farmer: req.user.id }))
    );

    res.json(created);
  } catch (err) {
    res.status(400).json({ message: 'Failed to save emergency contacts', error: err.message });
  }
};
