import { ContactsCollection } from "../db/models/contact.js";

export async function getAllContacts() {
    const contacts = await ContactsCollection.find();
    return contacts;
}

export async function getContact(contactId) {
    const contact = await ContactsCollection.findById(contactId);
    return contact;
}
