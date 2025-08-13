const oracledb = require('oracledb');
oracledb.initOracleClient({ libDir: process.env.INSTANT_CLIENT_PATH });

async function connectToOracle() {
  try {
    const connection = await oracledb.getConnection({
      user: process.env.ORACLE_USER,
      password: process.env.ORACLE_PASSWORD,
      connectString: process.env.ORACLE_CONNECTIONSTRING,
    });

    console.log('Connected to Oracle Database');
    return connection;
  } catch (err) {
    console.error('Error connecting to Oracle:', err);
  }
}

module.exports = connectToOracle;