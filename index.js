const contactsOperations = require('./db/contacts');

const { Command } = require('commander');
const program = new Command();
program
  .option('-a, --action <type>', 'choose action')
  .option('-i, --id <type>', 'user id')
  .option('-n, --name <type>', 'user name')
  .option('-e, --email <type>', 'user email')
  .option('-p, --phone <type>', 'user phone');

program.parse(process.argv);

const argv = program.opts();

async function invokeAction({ action, id, name, email, phone }) {
  switch (action) {
    case 'list':
      const contactList = await contactsOperations.listContacts();
      console.table(contactList);
      break;

    case 'get':
      const contact = await contactsOperations.getContactById(id);
      if (!contact) {
        throw new Error(`Contact with id=${contactId} was not found!`);
      }
      console.log(contact);
      break;

    case 'add':
      const newContact = await contactsOperations.addContact(name, email, phone);
      console.log(newContact);
      break;

    case 'remove':
      const deletedContact = await contactsOperations.removeContact(id);
      if (!deletedContact) {
        throw new Error(`Contact with id=${id} was not found`);
      }
      console.log(deletedContact);
      break;

    default:
      console.warn('\x1B[31m Unknown action type!');
  }
}

(async () => {
  await invokeAction(argv);
})();
