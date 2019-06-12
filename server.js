const express = require('express');
const connectDB = require('./config/db');

//connect database
connectDB();

const app = express();

app.get('/', (req, res) => res.send('API Running'));

//Define routes
app.use('/api/users', require('./config/routes/api/users'));
app.use('/api/auth', require('./config/routes/api/auth'));
app.use('/api/profile', require('./config/routes/api/profile'));
app.use('/api/posts', require('./config/routes/api/posts'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
