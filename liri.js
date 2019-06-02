const dotenv = require("dotenv").config();
const inquirer = require("inquirer");
const keys = require("./keys.js");
const request = require('request');
const fs = require("fs");
const moment = require("moment");
const Spotify = require("node-spotify-api");

concertThis = function (text) {
    request('https://rest.bandsintown.com/artists/' + text + '/events?app_id=codingbootcamp', function (err, response, body) {

        let json = JSON.parse(body);

        if (!json.length) {
            console.log("Sorry could not find anything for " + text +
                "\nShowing results for default concert");
            searchThis('concert-this');
        } else {

            // console.log(json);
            console.log("\nVenue: " + json[0].venue.name +
                "\nLocation: " + json[0].venue.city + " " + json[0].venue.region + " " + json[0].venue.country +
                "\nEvent Date: " + moment(json[0].datetime).format("dddd, MMMM Do YYYY, h:mm:ss a"));
        }
    });
};

spotifyThis = function (text) {

    var spotify = new Spotify(keys.spotify);

    spotify
        .search({ type: 'track', query: text, limit: 1 })
        .then(function (response) {

            if (!response.tracks.total) {
                console.log("Sorry could not find anything for " + text +
                    "\nShowing results for default song");
                searchThis('spotify-this-song');
            } else {

                console.log("\nArtists: " + response.tracks.items[0].artists[0].name +
                    "\nAlbum: " + response.tracks.items[0].album.name +
                    "\nSong: " + response.tracks.items[0].name +
                    "\nURL: " + response.tracks.items[0].preview_url
                );
            }
        })
        .catch(function (err) {
            console.log(err);
        });
};

movieThis = function (text) {

    request('http://www.omdbapi.com/?apikey=trilogy&t=' + text + '&tomatoes=true', function (err, response, body) {

        var json = JSON.parse(body);
        // console.log(json);
        if (json.Response == 'False') {
            console.log("Sorry could not find anything for " + text +
                "\nShowing results for default movie");
            searchThis('movie-this');
        } else {
            // console.log(json);
            console.log("\nTitle: " + json.Title +
                "\nReleased: " + json.Year +
                "\nRating: " + json.imdbRating +
                "\nRotten Tomatoes Rating: " + json.tomatoRating +
                "\nCountry: " + json.Country +
                "\nLanguage: " + json.Language +
                "\nPlot: " + json.Plot +
                "\nActors: " + json.Actors);
        }
    });
};

searchThis = function (command, searchtext) {

    switch (command) {
        case 'concert-this':
            {
                if (!searchtext) {
                    concertThis('Lady Gaga');
                } else {
                    concertThis(searchtext);
                }
                break;
            }
        case 'spotify-this-song':
            {
                if (!searchtext) {
                    spotifyThis('The Sign');
                } else {
                    spotifyThis(searchtext);
                }
                break;
            }
        case 'movie-this':
            {
                if (!searchtext) {
                    movieThis('Mr. Nobody');
                } else {
                    movieThis(searchtext);
                }
                break;
            }
        default:
            console.log("Try with valid options!");

    };
};

inquirer.prompt([
    {
        type: "list",
        name: "command",
        choices: ["concert-this", "spotify-this-song", "movie-this", "do-what-it-says"],
        message: "Choose one of the options"
    },
    {
        name: "searchtext",
        message: "Type the Band/Song/Movie you are looking for..."
    }
]).then(function (answers) {

    if (answers.command === 'do-what-it-says') {
        //perform whats written in txt file.
        fs.readFile("random.txt", "utf8", function (err, data) {
            var answers = data.split(",");
            searchThis(answers[0], answers[1]);
        });
    }
    else {
        searchThis(answers.command, answers.searchtext);
    }
});