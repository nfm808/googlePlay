const express = require('express');
const morgan = require('morgan');

const app = express();

app.use(morgan('common'));

const apps = require('./playstore');

app.get('/apps', (req, res) => {
  const { sort, genres } = req.query;

  let results = apps;

  if (sort) {
    let sortToLower = sort.toLowerCase();
    if(!['rating', 'app'].includes(sortToLower)) {
      res.status(400).send('Sort must be either by rating or app');
    }
    results = apps.sort((a, b) => {
      if(a[sort] > b[sort]) {return -1;}
      if(a[sort] < b[sort]) {return 1;}
      return 0;
    });
  }
  if (genres) {
    let genresToLower = genres.toLowerCase();
    if(!['action', 'puzzle', 'strategy', 'casual', 'arcade', 'card'].includes(genresToLower)) {
      res.status(400).send('Genre must be one of Action, Puzzle, Strategy, Casual, Arcade, or Card.');
    }
    results = results.filter(app => app.Genres === genres);
  }
  res
    .json(results);
});

module.exports = app;