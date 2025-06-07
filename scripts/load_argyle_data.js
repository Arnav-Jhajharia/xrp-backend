const fs = require('fs');
const path = require('path');
const connect = require('../db/mongo');

/**
 * Converts snake_case to camelCase
 */
function toCamelCase(str) {
  return str.replace(/_([a-z])/g, (_, char) => char.toUpperCase());
}

/**
 * Recursively converts all object keys from snake_case to camelCase
 */
function transformKeys(obj) {
  if (Array.isArray(obj)) {
    return obj.map(transformKeys);
  } else if (obj !== null && typeof obj === 'object') {
    return Object.entries(obj).reduce((acc, [key, value]) => {
      acc[toCamelCase(key)] = transformKeys(value);
      return acc;
    }, {});
  } else {
    return obj;
  }
}

(async () => {
  const db = await connect();

  const rawPath = path.join(__dirname, '../data/argyle_data.json');
  const rawData = fs.readFileSync(rawPath, 'utf-8');

  let parsed;
  try {
    parsed = JSON.parse(rawData);
  } catch (err) {
    console.error('❌ Failed to parse JSON:', err);
    process.exit(1);
  }

  const rawIdentities = parsed?.data?.identities;

  if (!Array.isArray(rawIdentities)) {
    console.error('❌ Expected data.identities to be an array.');
    process.exit(1);
  }

  const identities = rawIdentities.map((identity) => {
    if (!identity.id) {
      identity.id = new Date().getTime() + Math.random().toString(36).substring(2, 15);
    }
    const transformed = transformKeys(identity);
    return {
      ...transformed,
      address: {
        ...transformed.address,
        postalCode: transformed.address?.postalCode,
      },
      platformIds: {
        employeeId: transformed.platformIds?.employeeId,
        positionId: transformed.platformIds?.positionId,
        platformUserId: transformed.platformIds?.platformUserId,
      },
    };
  });

  try {
    await db.collection('identities').deleteMany({});
    await db.collection('identities').insertMany(identities);
    console.log(`✅ Loaded ${identities.length} identities into MongoDB`);
  } catch (err) {
    console.error('❌ Failed to load data:', err);
  }

  process.exit();
})();
