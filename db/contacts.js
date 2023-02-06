const fs = require('fs/promises');
const path = require('path');
const { v4 } = require('uuid');

const contactsPath = path.join(__dirname, '/contacts.json');

async function listContacts() {
  const data = await fs.readFile(contactsPath);
  const contactList = JSON.parse(data);
  return contactList;
}

async function getContactById(contactId) {
  const contactsList = await listContacts();
  const contact = contactsList.find(contact => contact.id === contactId);
  if (!contact) {
    return null;
  }
  return contact;
}

async function removeContact(contactId) {
  const contactsList = await listContacts();
  const idx = contactsList.findIndex(item => item.id === contactId);
  if (idx === -1) {
    return null;
  }
  const deletedContact = contactsList[idx];
  contactsList.splice(idx, 1);
  await fs.writeFile(contactsPath, JSON.stringify(contactsList));
  return deletedContact;
}

async function addContact(name, email, phone) {
  const contactList = await listContacts();

  const duplicatedContact = contactList.some(contact => contact.email === email);
  if (duplicatedContact) {
    throw new Error(
      `Contact with email ${email} already exist. Please update if credentials was changed`
    );
  }
  const newContact = { id: v4(), name, email, phone };
  contactList.push(newContact);
  await fs.writeFile(contactsPath, JSON.stringify(contactList));

  return newContact;
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
};
