const app = require('./app');
const sequelize = require('./util/database');
const loadUsersFromCSV = require('./util/parseUser');

const port = 8080;
app.listen(port, async () => {
  await sequelize.sync();
  await loadUsersFromCSV();
  console.log(`Listening on port ${port}`);
});