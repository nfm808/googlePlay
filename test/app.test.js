const expect = require('chai').expect;
const request = require('supertest');
const app = require('../app');

describe('GET /apps', () => {
  it('should return an array of books', () => {
    return request(app)
      .get('/apps')
      .expect(200)
      .expect('Content-Type', /json/);
  });

  it('should send an error message if sort not rating or app', () => {
    return request(app)
      .get('/apps')
      .query({sort: 'bob'})
      .expect(400, 'Sort must be either by rating or app')
  });

  it('should sort by rating', () => {
    return request(app)
      .get('/apps')
      .query({sort: 'rating'})
      .expect('Content-Type', /json/)
      .then(res => {
        expect(res.body).to.be.an('array');
        let i = 0;
        let sorted = true;
        while(sorted && i < res.body.length -1) {
          sorted = sorted && res.body[i].Rating < res.body[i + 1].Rating;
          i++;
        }
        expect(sorted).to.be.false;
      });
  });

  it('should sort by app', () => {
    return request(app)
      .get('/apps')
      .query({sort: 'App'})
      .expect('Content-Type', /json/)
      .then(res => {
        expect(res.body).to.be.an('array');
        let i = 0;
        let sorted = true;
        while(sorted && i < res.body.length -1) {
          sorted = sorted && res.body[i].App < res.body[i + 1].App;
          i++;
        }
        expect(sorted).to.be.false;
      });
  });

  it('should send an error message if genres are not defined', () => {
    return request(app)
      .get('/apps')
      .query({genres: 'bob'})
      .expect(400, 'Genre must be one of Action, Puzzle, Strategy, Casual, Arcade, or Card.')
  });

  it('should filter results based on genre', () => {
    return request(app)
      .get('/apps')
      .query({genres: "Card"})
      .then(res => {
        expect(res.body).to.be.an('array');
        expect(res.body).to.have.lengthOf.at.least(1);
        let isGenre = true;
        for(let i = 0; i < res.body.length; i++) {
          res.body[i].Genres === "Card" ? isGenre = true : isGenre = false;
        }
        expect(isGenre).to.be.true;
      });
  });

});

