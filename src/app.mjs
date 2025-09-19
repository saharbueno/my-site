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

// hardcoded design data
const designs = [
  {
    id: "games4peace",
    name: "games4peace mobile app",
    desc: "I directed the end-to-end UI/UX design of the new Games4Peace mobile app, a nonprofit platform focused on global impact. I began by creating wireframes and interactive prototypes in Figma to map out the app’s core features and user navigation. Working closely with the nonprofit’s CEO, I iterated through several design concepts before finalizing a high-fidelity prototype that incorporated the full visual identity, including colors, logos, typography, and content.",
    url: "/design/games4peace",
    createdAt: "from sept 2024",
    doneAt: "to dec 2024",
    iframes: ['<iframe style="border: 1px solid rgba(0, 0, 0, 0.1);" width="800" height="450" src="https://embed.figma.com/proto/Tu9RefnxCOg27xcGnIxunx/Games4Gaza-App-Wireframe?node-id=1-2&scaling=scale-down&content-scaling=fixed&page-id=0%3A1&starting-point-node-id=1%3A2&embed-host=share" allowfullscreen></iframe>', '<iframe style="border: 1px solid rgba(0, 0, 0, 0.1);" width="800" height="450" src="https://embed.figma.com/proto/Tu9RefnxCOg27xcGnIxunx/Games4Gaza-App-Wireframe?node-id=86-108&scaling=scale-down&content-scaling=fixed&page-id=86%3A107&starting-point-node-id=86%3A108&show-proto-sidebar=1&embed-host=share" allowfullscreen></iframe>']
  },
  {
    id: "seraphim",
    name: "seraphim web app",
    desc: "I led the design of Seraphim, a web application created to provide a safe, supportive space for users to authentically express their creativity and interests—ranging from music and art to fashion, film, and personal experiences. Collaborating with four teammates, I co-developed a comprehensive wireframe and interactive prototype in Figma, mapping out the platform’s core features and user flows. Building on this foundation, I designed the visual identity of the app, including a custom hand-drawn logo created in Procreate, a cohesive color scheme, and refined UI elements to reinforce the platform’s mission of inclusivity and positivity.",
    url: "/design/seraphim",
    createdAt: "from sept 2024",
    doneAt: "to dec 2024",
    images: ["/assets/designs/seraphim/logo.png", "/assets/designs/seraphim/1.png", "/assets/designs/seraphim/2.png", "/assets/designs/seraphim/3.png", "/assets/designs/seraphim/4.png", "/assets/designs/seraphim/5.png", "/assets/designs/seraphim/6.png", "/assets/designs/seraphim/7.png", "/assets/designs/seraphim/8.png", "/assets/designs/seraphim/9.png", "/assets/designs/seraphim/10.png", "/assets/designs/seraphim/11.png"],
    iframes: ['<iframe style="border: 1px solid rgba(0, 0, 0, 0.1);" width="800" height="450" src="https://embed.figma.com/proto/aGaCepqjZK6367ngUaQhHO/Seraphim?node-id=4-9&starting-point-node-id=4%3A9&embed-host=share" allowfullscreen></iframe>']
  },
    {
    id: "moodify",
    name: "moodify web app",
    desc: "For Moodify, a web app that pairs mood tracking with music discovery through the Spotify API, my teammates created a simple wireframe to outline the core features. Building on that foundation, I designed and implemented the full user interface, drawing inspiration from Spotify’s sleek and modern aesthetic. I developed the design entirely with HTML and CSS, ensuring consistency across pages and creating a clean, intuitive experience for journaling, playlist creation, and mood visualization.",
    url: "/design/moodify",
    createdAt: "from dec 2024",
    doneAt: "to dec 2024",
    images: ["/assets/designs/moodify/1.png", "/assets/designs/moodify/2.png", "/assets/designs/moodify/3.png", "/assets/designs/moodify/4.png", "/assets/designs/moodify/5.png"]
  },
    {
    id: "study-buns",
    name: "study buns web app",
    desc: "For Study Buns, a productivity app that gamifies task management, I led the design process from early ideation to implementation. Working with my teammates, I helped create a simple wireframe and prototype, then expanded on these foundations with mood boards inspired by apps like Forest to guide the visual direction. I designed the full interface, focusing on playful, engaging elements that reinforced the app’s motivational rewards system. I implemented the design using HTML and CSS.",
    url: "/design/study-buns",
    createdAt: "from sept 2024",
    doneAt: "to sept 2024",
    images: ["/assets/designs/studybuns/logo.png", "/assets/designs/studybuns/1.png", "/assets/designs/studybuns/2.png", "/assets/designs/studybuns/3.png", "/assets/designs/studybuns/4.png"],
    iframes: ['<iframe style="border: 1px solid rgba(0, 0, 0, 0.1);" width="800" height="450" src="https://embed.figma.com/proto/cGfssq0dgAoQ815AAxkKvm/Project-1-Study-APP?node-id=2-139&starting-point-node-id=2%3A139&embed-host=share" allowfullscreen></iframe>']
  },
  {
    id: "msi-americas",
    name: "marketing for msi americas",
    desc: "I developed and refined a range of high-impact presentations and visual mockups tailored to both internal and external stakeholders. This included designing a comprehensive Service Portfolio presentation that effectively showcased offerings in a clear, engaging format, as well as creating 81 unique logo concepts to explore brand identity from multiple angles.",
    url: "/design/msi-americas",
    createdAt: "from may 2024",
    doneAt: "to aug 2024",
    iframes: [`<div style="position: relative; width: 100%; height: 0; padding-top: 56.2500%;
        padding-bottom: 0; box-shadow: 0 2px 8px 0 rgba(63,69,81,0.16); margin-top: 1.6em; margin-bottom: 0.9em; overflow: hidden;
        border-radius: 8px; will-change: transform;">
        <iframe loading="lazy" style="position: absolute; width: 100%; height: 100%; top: 0; left: 0; border: none; padding: 0;margin: 0;"
            src="https://www.canva.com/design/DAGHTk2ZMOU/q8jSnsJhyE_HeiTTPl8yyQ/view?embed" allowfullscreen="allowfullscreen" allow="fullscreen">
        </iframe>
        </div>
        <a href="https:&#x2F;&#x2F;www.canva.com&#x2F;design&#x2F;DAGHTk2ZMOU&#x2F;q8jSnsJhyE_HeiTTPl8yyQ&#x2F;view?utm_content=DAGHTk2ZMOU&amp;utm_campaign=designshare&amp;utm_medium=embeds&amp;utm_source=link" target="_blank" rel="noopener">MSI-Services-Portfolio</a>`]
  },
  {
    id: "mobalytics",
    name: "mobalytics remote extern presentation",
    desc: "I designed a professional, visually engaging 6-page presentation to communicate strategic recommendations for Mobalytics’ product expansion. Drawing from research on game mechanisms, KPIs, and player psychology, I translated complex insights into clear, digestible visuals and layouts that highlighted opportunities for growth.",
    url: "/design/mobalytics",
    createdAt: "from april 2024",
    doneAt: "to may 2024",
    iframes: [`<div style="position: relative; width: 100%; height: 0; padding-top: 56.2500%;
        padding-bottom: 0; box-shadow: 0 2px 8px 0 rgba(63,69,81,0.16); margin-top: 1.6em; margin-bottom: 0.9em; overflow: hidden;
        border-radius: 8px; will-change: transform;">
        <iframe loading="lazy" style="position: absolute; width: 100%; height: 100%; top: 0; left: 0; border: none; padding: 0;margin: 0;"
            src="https://www.canva.com/design/DAGFyFh7Oxk/BKIBIGMd5X_W1NLMg1lhdQ/view?embed" allowfullscreen="allowfullscreen" allow="fullscreen">
        </iframe>
        </div>
        <a href="https:&#x2F;&#x2F;www.canva.com&#x2F;design&#x2F;DAGFyFh7Oxk&#x2F;BKIBIGMd5X_W1NLMg1lhdQ&#x2F;view?utm_content=DAGFyFh7Oxk&amp;utm_campaign=designshare&amp;utm_medium=embeds&amp;utm_source=link" target="_blank" rel="noopener">Wild Valor: Capitalizing on MOBA Mania</a>`]
  },
];

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

// get the design detail pages
app.get("/design/:id", (req, res) => {
  const design = designs.find(d => d.id === req.params.id);
  if (!design) return res.status(404).send("Design not found");
  
  res.render("design-details", {
    name: design.name,
    desc: design.desc,
    images: design.images || [],
    iframes: design.iframes || []
  });
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
