"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStoreReadonly = exports.clearStore = exports.deleteTemplate = exports.setTemplate = exports.getTemplate = exports.hasTemplate = exports.saveEmail = void 0;
const smtp_1 = require("./smtp");
const store = {
    emails: [],
    templates: new Map(),
};
const saveEmail = (email) => {
    store.emails.push(email);
    (0, smtp_1.sendEmailToSmtp)(email);
};
exports.saveEmail = saveEmail;
const hasTemplate = (key) => store.templates.has(key);
exports.hasTemplate = hasTemplate;
const getTemplate = (key) => store.templates.get(key);
exports.getTemplate = getTemplate;
const setTemplate = (key, value) => store.templates.set(key, value);
exports.setTemplate = setTemplate;
const deleteTemplate = (templateName) => store.templates.delete(templateName);
exports.deleteTemplate = deleteTemplate;
const clearStore = () => {
    store.emails = [];
    store.templates.clear();
};
exports.clearStore = clearStore;
// This type doesn't give us perfect readonly safety
// But this is probably safe enough for now, given the method name
// and the relatively small project size.
const getStoreReadonly = () => store;
exports.getStoreReadonly = getStoreReadonly;
