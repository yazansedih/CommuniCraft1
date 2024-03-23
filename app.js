const express = require('express');
const { Server } = require('socket.io');
const http = require('http');
const fs = require('fs');

const url = require('url');
const slugify = require('slugify');
const port = 3000;

const app = express();
const server = http.createServer(app);
const sessionConfig = require('./middlewares/sessionConfig');

app.use(express.json());
app.use(sessionConfig);

const userRouter = require('./routes/userRoutes');
const skillsRouter = require('./routes/skillsRoutes'); 
const companiesRoutes = require('./routes/companiesRoutes'); 
const localpartnershipRouter = require('./routes/localpartnershipRoutes');
const craftprojectRouter = require('./routes/craftprojectRoutes'); 
const resourcesRouter = require('./routes/resourcesRoutes');
const finishedprojectRouter = require('./routes/finishedprojectRoutes');
const externalAPIs = require('./routes/externalAPIsRoutes');


app.use('/api/users', userRouter);
app.use('/api/skills', skillsRouter);
app.use('/api/companies', companiesRoutes);
app.use('/api/localpartnerships', localpartnershipRouter);
app.use('/api/craftprojects', craftprojectRouter);
app.use('/api/resources', resourcesRouter);
app.use('/api/finishedprojects', finishedprojectRouter);
app.use('/api/externalapi', externalAPIs);


server.listen(port, '0.0.0.0', () =>
  console.log(`Server ready at: http://localhost:${port}`),
);

module.exports = app;
