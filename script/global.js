var currentLangIndex = 0;
var darkTheme = true;
var currentPage = document.body.getAttribute('id');
const mailTo = 'mailto:biznes.olszewski@gmail.com?subject=Website/Portfolio under maintenance';
var preferedLang = navigator.language.split("-")[0];
var isLoading = true;


ChangeLang(false);

const PROJECT_CATEGORIES = [
  'websites'
]

addEventListener("load", () => {
  if(sessionStorage.getItem('intro') === 'played') {
    index.SkipIntro();
  }
  setTimeout(() => {
    document.getElementById('loader-master').classList.remove('visible');
    setTimeout(() => {
      document.getElementById('loader-master').style.display = 'none';
      if(sessionStorage.getItem('intro') === 'played') {
        IntroSequence(true);
      }
    }, 100);
    isLoading = false;
    if(sessionStorage.getItem('intro') !== 'played') IntroAnimation();
  },1000);
});


function FormatKeyword(text, attributes) {
  let n = (text.match(new RegExp(/\*/g)) || []).length;
  if(n % 2 != 0) { console.log(`Odd number of keyword operators in "${text}" Make sure all of them are closed`); return text.replace(/\*/g, ''); }
  for(let i = 0; i < n; i++) {
    text = text.replace('*', `<a ${attributes[i]}>`).replace('*', '</a>');
  }
  return text; 
}

function ScrollToInfo() {
  window.scrollTo({
    top: document.body.scrollHeight,
    behavior: 'smooth'
  });
}

function SwitchTheme() {
    document.body.classList.toggle('light');
}

function FullscreenEnv(element) {
  element.parentElement.querySelector('iframe');
}

async function GetPreferedLangIndex() {
  try {
    const response = await fetch('/lang.json');
    const data = await response.json();

    for(var key in data.lookup_table) {
      if(data.lookup_table[key] == preferedLang) {
        return parseInt(key);
      }
    }
    console.log('Preffered language not found in the translations file, defaulting to English');
    return 101;
  }
  catch (error) {
    throw new Error("There was an error", { cause: error });
  }
}

async function FetchLang(lang, page) {
  try {
    const response = await fetch('/lang.json');
    const data = await response.json();

    if (!data.lookup_table.hasOwnProperty(String(lang))) {throw new Error(`Language map for ${lang} doesn't exist. Is the lookup table up to date?`);}

    const lookup = data.lookup_table[String(lang)];
    const locale = data[lookup];

    if (!locale.hasOwnProperty(page)) {throw new Error(`Language map for ${page} doesn't exist, Is the lookup table up to date?`);}
    return locale[page];
    
  } catch (error) {
    throw new Error("There was an error", { cause: error });
  }
}


/* function ProjectDetails(id) {
  console.log(id);
} */

function NextLang(wasManual) {
    var n = 1; 
    if(!wasManual) {n = 0}
    const parent = document.getElementById('lang-wrapper');
    parent.style.transform = `translateX(${(currentLangIndex + n) * 35}px)`;
    if(!wasManual) {
      Array.from(parent.children).forEach((element, index) => {
        if (index !== currentLangIndex) {
          element.classList.remove('visible');
        }
      });
    } else {parent.children[currentLangIndex].classList.remove('visible');}
    if (currentLangIndex == (parent.children.length - 1)) {
        //parent.children[currentLangIndex].style.transition = 'all ease-out 0.1s' //More then 2 langs then uncomment
        if(wasManual) {currentLangIndex = 0;}
        //parent.children[currentLangIndex].style.transition = 'all ease-out 0.4s'; //More then 2 langs then uncomment
        //parent.style.transition = 'all ease-out 0.4s'; //More then 2 langs then uncomment
        if(wasManual) {parent.style.transform = `translateX(0)`;}
    }
    else if(wasManual) {currentLangIndex++;}
    parent.children[currentLangIndex].classList.add('visible');
    if(wasManual) {ChangeLang(true);}
}

async function ChangeLang(wasManual){
    if (!wasManual) {
      const preferedLangIndex = await GetPreferedLangIndex();
      if (preferedLangIndex == 101) {
        currentLangIndex = 1;
      } else {currentLangIndex = preferedLangIndex;}
      NextLang(false);
    }
    const locale = await FetchLang(currentLangIndex, currentPage);
    document.querySelector('html').lang = navigator.language;
    const textElements = document.querySelectorAll('.fade');

    Array.from(textElements).forEach(element => {
      element.classList.remove('anim');
    });

    Array.from(textElements).forEach(element => {
      element.classList.add('anim');
    });

    setTimeout(() => {
    switch(currentPage) {
      case 'maintenance':
        document.getElementById('header').textContent = locale.headline.header;
        document.getElementById('notice').textContent = locale.headline.paragraph;
        p = document.getElementById('error');
        p.innerHTML = FormatKeyword(locale.headline.notice.paragraph, [`href="${mailTo}"`]);
        /* const newA = document.createElement('a');
        newA.href = mailTo;
        newA.textContent = locale.headline.notice.keyword;

        p.append (
          document.createTextNode(locale.headline.notice.paragraph),
          newA
        ); */
        break;
      case 'index':
        console.log("Work in Progress");

        document.getElementById('headline-paragraph').textContent = locale.main.headline.paragraph;
        document.getElementById('about-me').textContent = locale.main.about.paragraph;
        document.getElementById('about-devider-h').textContent = locale.main.about.header;
        const noticeList = document.getElementsByClassName('info-notice');
        Array.from(noticeList).forEach(p => {

          p.innerHTML = '';

          const newA = document.createElement('a');
          newA.onclick = ScrollToInfo;
          newA.textContent = locale.display.categories.website.info.notice.keyword;

          p.append (
            document.createTextNode(locale.display.categories.website.info.notice.paragraph),
            newA
          );
        });

        break;
      default:
        throw new Error(`There is no case for the ${currentPage} page in the switch statement`);
        break;
      }
      }, 250);
      

    // WORDS = locale.index.main.headline.titles;

    // resetCycle();
    // index = 0;

    // Array.from(document.getElementsByClassName('basic-info')).forEach(element => {
    //   const cat = PROJECT_CATEGORIES[index];
    //   FetchInfo(cat, 0, currentLangIndex);
    //   index++;
    // });

    // document.getElementById('libraries').textContent = locale.index.display.categories.website.info.headers.libraries;
    // document.getElementById('features').textContent =
    // locale.index.display.categories.website.info.headers.features;

    // document.querySelectorAll('time-spent').forEach(element => {
    // element.querySelector('.time-title').textContent = locale.index.display.categories.website.info.headers.time.header;
    // element.querySelector('.clause').textContent = locale.index.display.categories.website.info.headers.time.clause;

    // });
    // Array.from(document.getElementsByClassName('clause')).forEach(element => {
    //   element.textContent = locale.index.display.categories.website.info.headers.time.clause;
    // });
    setTimeout(() => {
    Array.from(textElements).forEach(element => {
      element.classList.remove('anim');
    });
    }, 1000);
}  
