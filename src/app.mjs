import './config.mjs';
import express from 'express'
import cors from 'cors';
import bp from 'body-parser';
import axios from 'axios';
import mongoose from 'mongoose';
import fetch from  'node-fetch';
import path from 'path'
import { fileURLToPath } from 'url';
import './db.mjs';

const app = express();

// set the view engine
app.set('view engine', 'hbs');

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// set the public directory as the location for static files
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));

// middleware to use req.body
app.use(express.urlencoded({extended: false}));

// use cors
app.use(cors());

// define models
const Contact = mongoose.model('Contact');
const Projects = mongoose.model('Projects');

// get the home page
app.get('/', (req, res) => {
    res.render('home', {});
});

// get the contact page
app.get('/contact', (req, res) => {
    // render contact
    res.render('contact', {});
});

// get the design page
app.get('/design', (req, res) => {
    // render design
    res.render('design', {});
});

// get repos using github api
// github api tutorial from here: https://dev.to/lornasw93/using-node-js-to-get-useful-github-data-54ne
app.get('/api/repos', bp.urlencoded({ extended: true }), async (req, res) => {
    axios({
        method: "get",
        url: `https://api.github.com/users/${process.env.GITHUB_USERNAME}/repos`,
        headers: {
            Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
            "Content-Type": "application/json",
            "Accept": "application/vnd.github.mercy-preview+json",
        }
    }).then(async (response) => {
        // if there is no data in the database -> add data
        const existingProjs = await Projects.countDocuments();
        if (existingProjs === 0) {
            // add data to database
            const projects = response.data.forEach(async (repo) => {
                // function to convert string to readable date
                function convertDate(type, date) {
                    // initialize array for months
                    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
                    // instantiate new date obj
                    const dateObj = new Date(date);
                    // get necessary parts of date
                    const year = dateObj.getFullYear();
                    const month = months[dateObj.getMonth()].toLowerCase();
                    const day = dateObj.getDate();
                    return `${type} ${month} ${day}, ${year}`;
                }

                let newTopics = repo.topics.join(' ');
                let createdDate = convertDate('created', repo.created_at);
                let updatedDate = convertDate('updated', repo.updated_at);
                let newDes = repo.description.toLowerCase();
                let newName = repo.name.toLowerCase();
                let p = new Projects({
                    id: repo.id,
                    name: newName,
                    description: newDes,
                    topics: newTopics,
                    url: repo.html_url,
                    created: createdDate,
                    updated: updatedDate,
                });
                // save new proj to database
                await p.save();
            });   
        }

        // return response data after inserting into the database
        return response.data;
    }).then((responseData) => {
        // send response data as JSON
        res.json(responseData);
    }).catch(e => {
        console.error("Error fetching or saving projects.");
        // send back error status
        res.status(500);
        res.send(e);
    });
});

app.get('/work', (req, res) => {
    res.render('work', {});
});

// get the about-me page with the last.fm api
// last.fm api tutorial from here: https://www.youtube.com/watch?v=okbDFf-eIqk
app.get('/about-me', async (req, res) => {
    // use the last fm api to get my recently played track
	try {
        // set the necessary variables to use fetch
		const apiKey = process.env.LASTFM_API_KEY;
		const username = "saharbueno";
		const response = await fetch(
			`http://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${username}&api_key=${apiKey}&format=json`,
			{
				method: "GET",
			}
		);

        // get the json
		const data = await response.json();
		const lastTrackData = data.recenttracks.track[0];

        // get the last track
		const lastTrack = {
			artist: lastTrackData.artist["#text"],
			trackName: lastTrackData.name,
			album: lastTrackData.album["#text"],
			url: lastTrackData.url,
			albumArt: lastTrackData.image[1]["#text"],
		};

        // render about-me
        res.render('about-me', {track: lastTrack});
	} catch (e) {
		// send back error status
        res.status(500);
        res.send('Error in connecting to Last.fm. API.');
	}
});

// get the search page
app.get('/work/search' , async (req, res) => {
    // get the search query
    let search = req.query.searchBar;
    // if there was input, search for the projects that contain part of the input
    if (search != '' && search) {
        try {
            // construct a regex
            const regex = new RegExp(`.*${search}.*`, 'i');
            let projects = await Projects.find({topics: { $regex: regex }});
            // search for proj
            if (projects.length === 0) {
                projects = await Projects.find({name: { $regex: regex }});
            
                if (projects.length === 0) {
                    projects = await Projects.find({description: { $regex: regex }});
            
                    if (projects.length === 0) {
                        projects = await Projects.find({created: { $regex: regex }});
            
                        if (projects.length === 0) {
                            projects = await Projects.find({updated: { $regex: regex }});
            
                            if (projects.length === 0) {
                                res.json({failureMessage: 'no project like that exists ૮ ◞ ﻌ ◟ ა but here are my other ones!'});
                            } else {
                                res.json(projects);
                            }
                        } else {
                            res.json(projects);
                        }
                    } else {
                        res.json(projects);
                    }
                } else {
                    res.json(projects);
                }
            } else {
                res.json(projects);
            }            
        } catch(e) {
            // send back error status
            res.status(500);
            res.send('Error in connecting to database.');
        }
    } else {
        // retrieve all projects from the database
        const projects = await Projects.find({});
        // send projects to the client
        res.json(projects);
    }
});

// post the contact page
app.post('/contact', async (req, res) => {
    // check if the user has filled out all options
    if (!(req.body.name && req.body.email && req.body.message)) {
        // define an error
        const errorMessage = 'Please fill out all fields!';
        // render contact
        res.render('contact', {error: errorMessage});
    } else {
        // create a new contact
        const newContact =  new Contact({name: `${req.body.name}`, email: req.body.email, message: `${req.body.message}`});
        try {
            // save the contact to the database
            await newContact.save();
            // create submitted message
            const message = `Thank you for contacting me, ${req.body.name}!`;
            // render contact page
            res.render('contact', {submitted: message})
        } catch(e) {
            // send back error status
            res.status(500);
            res.send('Error in connecting to database.');
        }  
    }
});

// listen for connections
app.listen(process.env.PORT || 3000);
