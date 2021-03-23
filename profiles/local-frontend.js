const routes = {};
routes['/beta/ansible/catalog/approval'] = { host: `https://localhost:8002` },
routes['/beta/apps/approval'] = { host: `https://localhost:8002` },
routes['/ansible/catalog/approval'] = { host: `https://localhost:8002` },
routes['/apps/approval'] = { host: `https://localhost:8002` },
routes[`/beta/config`] = { host: `https://localhost:8889` },

module.exports = { routes };
exports.routes = routes;
