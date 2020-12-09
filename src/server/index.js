const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const util = require('util');

const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

const app = express();

app.use(express.static('dist'));
app.use(bodyParser.json({ limit: '50mb' }));

app.get('/api/getDataset', async (req, res) => {
  try {
    const buffer = await readFile(`${__dirname}/data/dataset.json`);
    const json = JSON.parse(buffer.toString('utf8'));
    res.status(200).json(json);
  } catch (error) {
    console.log(error);
    res.status(500).json({ code: 500, error: 'Failed to load JSON file' });
  }
});

app.post('/api/updateDataset', async (req, res) => {
  try {
    const data = JSON.stringify(req.body);
    await writeFile(`${__dirname}/data/dataset.json`, data, 'utf8');
    res.status(200).json(data);
  } catch (error) {
    console.log(error);
    res.status(500).json({ code: 500, error: 'Failed to write JSON file' });
  }
});

app.listen(process.env.PORT || 5000, () => console.log(`Listening on port ${process.env.PORT || 5000}!`));
