// grab dom element that will store repository data
const domRepo = document.querySelector('#repos');

// array to store all repo objects in
let repoArr = [];

// function to check if a topic is a substring of another topic in the topics array (for cleaning up look)
function isSubTopic(topic, topicsArray) {
    return topicsArray.some(item => item !== topic && item.includes(topic));
}

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

// class for repos
class Repository {
    // constructor
    constructor(id, name, desc, topics, url, createdAt, updatedAt) {
        this.id = id;
        this.name = name;
        this.desc = desc;
        this.topics = topics;
        this.url = url;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.img;
    }
    // function to create html elements based off of repo & style them
    create(index) {
        // define special class for img
        let special;
        // define img
        if (index % 2 === 0) {
            this.img = '/assets/1.png';
            special = 'sylveon';
        } else {
            this.img = '/assets/2.png';
            special = 'umbreon';
        }
        // create first container
        const container = document.createElement('div');
        container.classList.add('flex', 'flex-col', 'content-center', 'justify-center', 'items-start', 'flex-1', 'bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))]','from-transparent', 'to-super-light-pink', 'rounded-lg', 'p-3', 'shadow-lg', 'gap-1', 'md:mb-[0px]', 'mb-[20px]');
        container.setAttribute('id', `${this.id}`);

        // begin creating all elements
        const headingContainer = document.createElement('div');
        headingContainer.classList.add('flex', 'flex-col', 'items-start', 'justify-start', 'w-[100%]', 'm-2');

        const title = document.createElement('h1');
        title.classList.add('bg-gradient-to-r', 'from-[#7871A4]', 'to-baby-pink', 'inline-block', 'text-transparent', 'bg-clip-text', 'text-xl', 'font-bold');
        title.innerText = this.name;

        const timeStamps = document.createElement('span');
        timeStamps.classList.add('text-[#7871A4]', 'text-sm', 'italic', 'font-thin');
        timeStamps.innerText = `${this.createdAt} ♡ ${this.updatedAt}`;

        headingContainer.appendChild(title);
        headingContainer.appendChild(timeStamps);

        const description = document.createElement('div');
        description.classList.add('bg-gradient-to-r', 'from-[#7871A4]', 'to-baby-pink', 'inline-block', 'text-transparent', 'bg-clip-text', 'text-base', 'w-[100%]', 'm-2');
        description.innerText = this.desc;

        const extrasContainer = document.createElement('div');
        extrasContainer.classList.add('flex', 'flex-row', 'flex-grow', 'flex-shrink', 'justify-between', 'items-end', 'w-[100%]', 'm-2');

        const topicsList = document.createElement('div');
        topicsList.classList.add('flex', 'flex-row', 'justify-start', 'flex-wrap', 'items-center', 'gap-2', 'w-[70%]');
        this.topics.forEach((el) => {
            const spanDiv = document.createElement('div');
            spanDiv.classList.add('px-[10px]', 'bg-gradient-to-br', 'from-baby-pink', 'to-light-light-pink', 'rounded-md', 'shadow-md', 'inline');
            const span = document.createElement('span');
            span.classList.add('bg-gradient-to-r', 'from-[#7871A4]', 'to-light-pink', 'inline-block', 'text-transparent', 'bg-clip-text', 'text-sm', 'italic', 'font-thin');
            span.innerText = el;
            spanDiv.appendChild(span);
            topicsList.appendChild(spanDiv);
        });

        const imgDiv = document.createElement('div');
        imgDiv.classList.add('w-max', 'mb-[-5px]');
        const linkText = document.createElement('span');
        linkText.classList.add('font-thin', 'text-sm', 'text-center');
        linkText.innerText = 'github url';
        const arrowIcon = document.createElement('i');
        arrowIcon.classList.add('bi', 'bi-arrow-down', 'block');
        linkText.appendChild(arrowIcon);
        const imgLink = document.createElement('a');
        imgLink.setAttribute('href', this.url);
        const img = document.createElement('img');
        img.classList.add(special, 'w-[50px]');
        img.setAttribute('src', this.img);
        imgLink.appendChild(img);
        imgDiv.appendChild(linkText);
        imgDiv.appendChild(imgLink);

        extrasContainer.appendChild(topicsList);
        extrasContainer.appendChild(imgDiv);

        // append every element that was just made
        container.appendChild(headingContainer);
        container.appendChild(description);
        container.appendChild(extrasContainer);

        // return container with all elements and styling
        return container;
    }
}

// get all existing repos
async function getRepos() {
    // initialize repo variable
    let repos;
    try {
        // fetch repos from github api
        let res = await fetch('/api/repos');
        repos = await res.json();
      } catch (err) {
        alert('໒꒰ྀིっ˕ -｡꒱ྀི১ Error in retrieving data from GitHub API. Please try again later.');
        return;
      }
    // if fetch is successful, we map each repo to an object
    repoArr = repos.map(repo => {
        return new Repository(
            repo.id,
            (repo.name ?? 'No name yet...').toLowerCase(),
            (repo.description ?? 'No description yet...').toLowerCase(),
            // filter out the topics array immediately
            Array.isArray(repo.topics)
            ? repo.topics.filter(topic => !isSubTopic(topic, repo.topics))
            : [],
            repo.html_url,
            // convert updated & created at data to readable dates
            convertDate('created', repo.created_at),
            convertDate('updated', repo.updated_at),
        );
    });
    // for each object, create the html and append it to dom
    repoArr.forEach((repo, index) => {
        const element = repo.create(index);
        domRepo.appendChild(element);
    });
    // return
    return;
}

// function to handle search form submission
async function getSearchedRepo(e) {
    e.preventDefault();
    // initialize variable for search results
    // get search bar value
    const search = document.querySelector('.search-bar').value;
    console.log(search);
    try {
        // fetch ids
        let res = await fetch(`/work/search?searchBar=${search}`);
        searchResults = await res.json();
    } catch(err) {
        alert('໒꒰ྀིっ˕ -｡꒱ྀི১ Error in search. Please try again later.');
        return;
    }
    // if fetch is successful, we get all projects in the dom and hide the ones we dont want
    // first check if json has errorMessage
    if ((Array.isArray(searchResults) === false) && searchResults.hasOwnProperty('failureMessage')) {
        // get errorM container
        const errorM = document.getElementById('errorM');
        // show error message
        const error = document.createElement('p');
        error.innerText = searchResults.failureMessage;
        error.classList.add('bg-gradient-to-r', 'from-[#7871A4]', 'to-light-pink', 'inline-block', 'text-transparent', 'bg-clip-text');
        errorM.classList.add('bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))]', 'from-transparent', 'to-white' ,'rounded-xl', 'p-2', 'shadow-lg', 'lg:w-[50%]', 'md:w-[60%]', 'w-[70%]' ,'text-center', 'm-5');
        errorM.appendChild(error);
        // remove class hidden from all domRepo children
        for (let i = 0; i < domRepo.children.length; i++) {
            domRepo.children[i].classList.remove('hidden');
        }
    } else {
        // get errorM container 
        const errorM = document.getElementById('errorM');
        // check if errorM has children first
        if (errorM.hasChildNodes()) {
            // remove classes
            errorM.className = '';
            // delete its first child
            errorM.removeChild(errorM.children[0]);
        }
        for (let i = 0; i < domRepo.children.length; i++) {
            let found = false;
            for (let r = 0; r < searchResults.length; r++) {
                if (searchResults[r].id == domRepo.children[i].id) {
                    found = true;
                    break;
                }
            }
            if (found === false) {
                domRepo.children[i].classList.add('hidden');
            } else {
                domRepo.children[i].classList.remove('hidden');
            }
        }
    }
    // clear search bar
    document.querySelector('.search-bar').value = '';
    return;
}

// function to handle all actions in main div
async function handleRepos() {
    // get all repos
    await getRepos();
    // function to toggle ring for search bar
    const searchBar = document.querySelector('.search-bar');
    const searchButton = document.querySelector('.search-button');
    searchBar.addEventListener('click', (event) => {
        event.stopPropagation();
        searchButton.classList.add('ring-2');
        searchButton.classList.add('ring-[#7871A4]');
    });
    document.addEventListener('click', (event) => {
        if (!(event.target.classList.contains('search-bar'))) {
            searchButton.classList.remove('ring-2');
            searchButton.classList.remove('ring-[#7871A4]');
        }
    });
    
    // function to handle search button click
    searchButton.addEventListener('click', getSearchedRepo);

    // apply change pokemon function to all pokemon when hovered on/when mouse leaves
    let sylveons = document.querySelectorAll('.sylveon');
    let umbreons = document.querySelectorAll('.umbreon');

    // function to handle mouseover for sylveons
    function handleSylveonMouseover(e) {
        e.stopPropagation();
        e.currentTarget.src = '/assets/2.png';
        e.currentTarget.parentNode.parentNode.firstChild.classList.add('text-light-pink');
    }

    // function to handle mouseout for sylveons
    function handleSylveonMouseout(e) {
        e.stopPropagation();
        e.currentTarget.src = '/assets/1.png';
        e.currentTarget.parentNode.parentNode.firstChild.classList.remove('text-light-pink');
    }

    // function to handle mouseover for umbreons
    function handleUmbreonMouseover(e) {
        e.stopPropagation();
        e.currentTarget.src = '/assets/1.png';
        e.currentTarget.parentNode.parentNode.firstChild.classList.add('text-light-pink');
    }

    // function to handle mouseout for umbreons
    function handleUmbreonMouseout(e) {
        e.stopPropagation();
        e.currentTarget.src = '/assets/2.png';
        e.currentTarget.parentNode.parentNode.firstChild.classList.remove('text-light-pink');
    }

    // add event listeners for sylveons
    for (let s = 0; s < sylveons.length; s++) {
        sylveons[s].addEventListener('mouseover', handleSylveonMouseover);
        sylveons[s].addEventListener('mouseout', handleSylveonMouseout);
    }

    // add event listeners for umbreons
    for (let u = 0; u < umbreons.length; u++) {
        umbreons[u].addEventListener('mouseover', handleUmbreonMouseover);
        umbreons[u].addEventListener('mouseout', handleUmbreonMouseout);
    }
}

// when content has loaded, page will function properly
document.addEventListener('DOMContentLoaded', handleRepos);