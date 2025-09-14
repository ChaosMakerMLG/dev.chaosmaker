const introSequenceCommands = [
  'testcommand',
  'really works'
];

const animatedElements = [
  document.querySelector('.terminal-bar'),
  document.querySelector('.terminal-window')
];

function IntroAnimation() {
  isPlaying = true;
  IntroContent();
  setTimeout(() => {
    IntroTerminal();
    isPlaying = false;
    sessionStorage.setItem('intro', 'played');
  }, 500);
}

function IntroTerminal() {
  haltCommand = false;
  document.querySelector('.terminal-bar').classList.add('intro');
  document.querySelector('.terminal-window').classList.add('intro');

  setTimeout(() => {
    document.querySelector('.terminal-window').classList.add('use');
    document.querySelector('.terminal-bar').classList.remove('intro');
    document.querySelector('.terminal-window').classList.remove('intro');
  }, 500);

  setTimeout(() => {
    IntroSequence(true);
  }, 600);
}

function IntroContent() {
  document.querySelector('#content').classList.add('intro');

  setTimeout(() => {
    document.querySelector('#content').classList.add('use');
    document.querySelector('#content').classList.remove('intro');
  }, 300);
}

function OutroAnimation() {
  haltCommand = true;
  document.querySelector('.terminal-bar').classList.add('outro');
  document.querySelector('.terminal-window').classList.add('outro');

  setTimeout(() => {
    document.querySelector('.terminal-window').classList.remove('use');
    document.querySelector('.terminal-bar').classList.remove('outro');
    document.querySelector('.terminal-window').classList.remove('outro');
  }, 500);
}

function SkipIntro() {
  document.querySelector('.terminal-window').classList.add('use');
  document.querySelector('#content').classList.add('use');
}


async function IntroSequence(clear /* boolean */ ) {
  if(clear) bash.clearTerminal();
    for(let i = 0; i < introSequenceCommands.length; i++) {
      setTimeout(await UseCommand(introSequenceCommands[i]), 100);
    }
}

async function FetchTableData(categoryVar, ID) {
  try {
    const response = await fetch("/projects/tablemap.json");
    if (!response.ok) {
      throw new Error(`Fetch error! Failed to fetch the tablemap - ${response.status}`);
    }
    const data = await response.json();

    const category = data.projects.find(project => project.category === categoryVar);
    if (!category) {console.log(`Category ${categoryVar} not found.`); return null;}

    const item = category.items.find(project => project.id == ID);
    if (!item) {console.log(`Project ID ${ID} not found in category ${categoryVar}.`); return null;}

    return {
      name: item.name,
      path: item.path
    };
  }
  catch (error){
    console.log('Failed to fetch the data. Is the tablemap empty? / of the JSON syntax? - ');
    return null;
  } 
}

async function FetchInfo(category, projectID, lang) {
  try {
    const inf = await FetchTableData(category, projectID);
    if (!inf) {
      throw new Error('There was an error when calling the FetchTableData method');
    }

    const response = await fetch(`${inf.path}/info.json`);
    if (!response.ok) {
      throw new Error(`Fetch error! Failed to fetch the project info - ${response.status}`);
    }
    const data = await response.json();

    const info = data.lang[lang];
    if (!data.lang.hasOwnProperty(lang)) {console.log(`Language with an ID of ${lang} was not found.`); return null;}

    jsonInfo = {
      index: data.init,
      name: info.name,
      desc: info.description,
      features: info.features,
      hours_spent: info.hours_spent,
      libraries: info.libraries,
      path: inf.path 
    };
  } catch (error) {
    console.log('Error - ', error);
  }

  document.getElementById('env').src = `${jsonInfo.path}/${jsonInfo.index}`;

  if (libraries.length === 0) {
    const listElement = document.createElement('i');
    listElement.textContent = "<none>";
  }
  else{
    if (document.getElementById('libraries-list').children.length != 0) { document.getElementById('libraries-list').innerHTML = ''; }
    jsonInfo.libraries.forEach(lib => {
      const listElement = document.createElement('li');
      listElement.classList.add('libraries-item');
      listElement.textContent = lib;
      document.getElementById('libraries-list').appendChild(listElement);
    });
  }

  document.getElementById('websites-features').textContent = jsonInfo.features;
  document.getElementById('websites-name').textContent = jsonInfo.name;
  document.getElementById('websites-desc').textContent = jsonInfo.desc;
  document.querySelectorAll('.time-value').forEach(element => {
    element.textContent = jsonInfo.hours_spent;
  });

}