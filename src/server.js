const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());

let users = [];

app.post('/signup', (req, res) => {
  const { firstName, lastName, email, password, gender, birthDate } = req.body;

  const newUser = { firstName, lastName, email, password, gender, birthDate };
  users.push(newUser);

  console.log('Yeni kullanıcı kaydedildi:', newUser);

  res.json({ success: true, message: 'Kayıt başarılı!' });
});

app.listen(port, () => {
  console.log(`Sunucu http://localhost:${port} adresinde çalışıyor`);
});
