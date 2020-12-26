const db = require('../models/user');

User = db.user;
exports.returnUserMovieList = (req, res) => {
  User.findById(req.params.id, function (err, user) {
    if (err) {
      console.log('An error occured');
    }
    let movieList = user.movie.map((movie) => {
      return JSON.parse(movie);
    });

    res.json(movieList);
  });
};

exports.testRouteController = (req, res) => {
  User.find({}, function (err, result) {
    if (err) {
      console.log('An error occurred');
    }
    res.json(result);
  });
};

function checkMoviePresence(userMoviesList, reqMovies) {
  var flag = 0;
  for (var i = 0; i < userMoviesList.length; i++) {
    if (userMoviesList[i].id === reqMovies.id) {
      flag = 1;
    } else {
      flag = 0;
    }
  }
  if (flag === 1) {
    return true;
  } else {
    return false;
  }
}
exports.addToUserList = function (req, res) {
  // console.log(req.body)
  var movieDetails = req.body.movie;
  var result = '';
  User.findById(req.params.id, function (err, user) {
    if (err) {
      return next(err);
    }
    if (user) {
      let userMovies = user.movie.map((x) => {
        return JSON.parse(x);
      });
      if (!checkMoviePresence(userMovies, movieDetails)) {
        User.findByIdAndUpdate(
          req.params.id,
          {
            $push: {
              movie: JSON.stringify(movieDetails),
            },
          },
          function (err, response) {
            if (err) {
              return next(err);
            }
            res.json({
              success: 'true',
              movie: response,
            });
          }
        );
      } else {
        res.json({
          error: 'Movie Already Exists',
        });
      }
    }
  });
};
