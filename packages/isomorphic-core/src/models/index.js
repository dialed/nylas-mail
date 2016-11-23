const fs = require('fs');
const path = require('path');

function loadModels(Sequelize, sequelize, modelsPath, {schema} = {}) {
  const db = {};
  const modelsDirectory = path.join(__dirname, modelsPath)
  for (const filename of fs.readdirSync(modelsDirectory)) {
    if (filename.endsWith('.js')) {
      let model = sequelize.import(path.join(modelsDirectory, filename));
      if (schema) {
        model = model.schema(schema);
      }
      db[model.name[0].toUpperCase() + model.name.substr(1)] = model;
    }
  }

  Object.keys(db).forEach((modelName) => {
    if ("associate" in db[modelName]) {
      db[modelName].associate(db);
    }
  });

  return db;
}


module.exports = loadModels
