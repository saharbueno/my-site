// hardcoded design data
const designs = [
  {
    id: "1",
    name: "games4peace mobile app",
    desc: "a mobile app UI/UX design for a charity gaming platform.",
    url: "/design/games4peace",
    createdAt: "from sept 2024",
    doneAt: "to dec 2024",
    image: "/assets/designs/g4p/logo.png"
  },
  {
    id: "2",
    name: "seraphim web app",
    desc: "a web app design for a student-made social media platform.",
    url: "/design/seraphim",
    createdAt: "from sept 2024",
    doneAt: "to dec 2024",
    image: "/assets/designs/seraphim/logo.png"
  },
    {
    id: "3",
    name: "moodify web app",
    desc: "a web app design for a Spotify API mood tracker.",
    url: "/design/moodify",
    createdAt: "from dec 2024",
    doneAt: "to dec 2024",
    image: "/assets/designs/moodify/4.png"
  },
    {
    id: "4",
    name: "study buns web app",
    desc: "a web app design for a study tracker game.",
    url: "/design/study-buns",
    createdAt: "from sept 2024",
    doneAt: "to sept 2024",
    image: "/assets/designs/studybuns/logo.png"
  },
  {
    id: "5",
    name: "marketing for msi americas",
    desc: "logos, presentations, and mockups for msi americas.",
    url: "/design/msi-americas",
    createdAt: "from may 2024",
    doneAt: "to aug 2024",
    image: "/assets/designs/msi/logo.png"
  },
  {
    id: "6",
    name: "mobalytics remote extern presentation",
    desc: "created a presentation to present key analytics to mobalytics.",
    url: "/design/mobalytics",
    createdAt: "from april 2024",
    doneAt: "to may 2024",
    image: "/assets/designs/mobalytics/logo.png"
  },
];

// simplified card generator
function createDesignCard(design, index) {
  const container = document.createElement('a');
  container.classList.add('flex', 'flex-col', 'content-center', 'justify-center', 'items-start', 'flex-1', 'bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))]','from-transparent', 'to-super-light-pink', 'rounded-lg', 'p-3', 'shadow-lg', 'gap-1', 'md:mb-[0px]', 'mb-[20px]', "hover:shadow-xl", "hover:scale-[1.02]", "transition");
  container.href = design.url; // make it clickable

  const headingContainer = document.createElement('div');
    headingContainer.classList.add('flex', 'flex-col', 'items-start', 'justify-start', 'w-[100%]', 'm-2');

  const title = document.createElement("h1");
  title.classList.add("bg-gradient-to-r", "from-[#7871A4]", "to-baby-pink", "text-xl", "font-bold", "bg-clip-text", "text-transparent");
  title.innerText = design.name;

  const timeStamps = document.createElement("span");
  timeStamps.classList.add("text-[#7871A4]", "text-sm", "italic", 'font-thin');
  timeStamps.innerText = `${design.createdAt} ♡ ${design.doneAt}`;

  headingContainer.appendChild(title);
    headingContainer.appendChild(timeStamps);

  const desc = document.createElement("p");
  desc.classList.add('bg-gradient-to-r', 'from-[#7871A4]', 'to-baby-pink', 'inline-block', 'text-transparent', 'bg-clip-text', 'text-base', 'w-[100%]', 'm-2');
  desc.innerText = design.desc;

    container.appendChild(headingContainer);
  container.appendChild(desc);

  if (design.image) {
    const imgWrapper = document.createElement("div");
    imgWrapper.classList.add("w-[75%]", "h-full", "flex", "justify-center", "m-auto", "mt-3");

    const img = document.createElement("img");
    img.src = design.image;
    img.alt = design.name;
    img.classList.add("w-full",
      "object-cover", "rounded-md",
      "shadow-md", "hover:shadow-lg",
      "transition");

    imgWrapper.appendChild(img);
    container.appendChild(imgWrapper);
  }

  return container;
}

// inject cards into DOM
const designsDiv = document.getElementById("designs");
designs.forEach((design, index) => {
  const card = createDesignCard(design, index);
  designsDiv.appendChild(card);
});
