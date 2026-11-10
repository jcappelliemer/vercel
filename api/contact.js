const { proxyPublicForm } = require('./_publicForms');

module.exports = async function handler(req, res) {
  await proxyPublicForm(req, res, 'contact');
};
