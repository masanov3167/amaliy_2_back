const express = require('express');
const app = express();
const PORT = process.env.PORT || 9000;
const routes = require('./routes/routes');
const cors = require('cors')


app.use(cors())
app.use(express.json());
app.use(routes);
app.use('/*', (_, res) => res.status(404).json({status:404, message:'bunaqa sahifa topilmadi'}))

app.listen(PORT, console.log(PORT))