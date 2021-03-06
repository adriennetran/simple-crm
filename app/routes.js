const express = require('express');
const db = require('../config/database');
const router = express.Router();
const Friend = require('./models/friend');
const querystring = require('querystring');


router.get('/currentuser', function(req, res) {
  res.send(req.user);
});

router.get('/allmypeople', function(req, res) {
  // Find friends where userId === req.user._id
  if (req.user) {
    Friend.find({ userId: req.user.id }, function(err, friends) {
      if (err) {
        console.log('Err finding friends: ', err);
        res.sendStatus(500)
      }
      res.send(friends);
    });
  }
});

router.get('/friendinfo', function(req, res) {
  Friend.find( { _id: req.query.id }, function(err, friend) {
    if (err) {
      console.log('Err finding friend: ', err);
      res.sendStatus(500);
    }
    res.send(friend[0]);
  })
});

router.get('/notes', function(req, res) {
  const friendId = req.query.friendId; // TODO: does it usually come from the query?
  Friend.findById(friendId, function(err, friend) {
    if (err) {
      console.log('err finding friend: ', err);
    }
    if (friend) {
      console.log('friend.notes', friend.notes);
      res.send(friend.notes);
    }
  });
});

router.post('/addnote', function(req, res) {
  console.log('adding a note');
  // Find friend and save friend
  Friend.findById(req.body.friendId, function(err, friend) {
    if (err) {
      console.log('err finding friend: ', err);
    }
    if (friend){
      let newNote = { date: req.body.date, text: req.body.text };
      var arr = friend.notes;
      arr.push(newNote);
      friend.notes = arr;
      friend.save((err) => {
        if (err) {
          console.log('err saving new friend: ', err);
        }
        res.status(200);
        res.send();
      });
    }
  });

});

module.exports = router;

