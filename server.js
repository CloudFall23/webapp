const app = require('./app');
const sequelize = require('./util/database');
const loadUsersFromCSV = require('./util/parseUser');
const { logger } = require('./util/logger');

const port = 8080;
app.listen(port, async () => {
  await sequelize.sync();
  await loadUsersFromCSV();
  logger.info("logs");
  console.log(`Listening on port ${port}`);
});