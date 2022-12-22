require('dotenv').config();
const { errorHandler, AppError } = require('./src/utils/errorHandler');
}
require('./src/routes')(app);

app.get('/', function (req, res) {
  res.json({ message: 'Server is running' });
});

app.listen(PORT, function () {
  console.log(`Node Server is Running on http://localhost:${PORT}`);
});
