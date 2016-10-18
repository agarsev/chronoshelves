import Shelves from './shelves';
import ages from './ages';
import BiHTML, { setLang } from './bihtml';

// BUILD SHELVING

function b64DecodeUnicode(str) {
    return decodeURIComponent(Array.prototype.map.call(atob(str), function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
}

let agedata = JSON.parse(b64DecodeUnicode(ages));
let myShelves = new Shelves(agedata.ages,
                            document.getElementById('Chronoshelves'),
                            document.getElementById('Drawerlayer'));
myShelves.startDragNotify = () => document.body.className = '';

// DIALOGS

let overlay = document.getElementById('overlay');

function showDialog (id, text) {
    let d = document.getElementById(id);
    if (text) {
        d.innerHTML = text;
    }
    overlay.style.display = 'block';
    d.className = '';
    d.firstChild.onclick = e => e.stopPropagation();
    d.onclick = () => {
        overlay.style.display = 'none';
        d.className = 'out';
    };
}

// TEXT AND BUTTONS

let about = document.getElementById('about').firstChild,
    aboutButton = document.getElementById('aboutButton');
about.insertBefore(new BiHTML(agedata.about), about.firstChild);
aboutButton.onclick = () => showDialog('about');
aboutButton.appendChild(new BiHTML(agedata.buttons.about));

function reset () {
    document.body.className = '';
    myShelves.reset();
}
let resetButton = document.getElementById('reset');
resetButton.onclick = reset;
resetButton.appendChild(new BiHTML(agedata.buttons.reset));

let lang = 0,
    langButton = document.getElementById('switchLang');
langButton.onclick = () => {
    if (lang == 0) {
        lang = 1;
        langButton.style.backgroundImage='url(res/flag_en.png)';
    } else {
        lang = 0;
        langButton.style.backgroundImage='url(res/flag_es.png)';
    }
    reset();
    setLang(lang);
};
langButton.style.backgroundImage='url(res/flag_es.png)';

let scoreButton = document.getElementById('score');
scoreButton.onclick = () => {
    document.body.className = 'showErrors';
    let {score,total} = myShelves.score();
    let text = agedata.score[lang];
    text = text.replace('{{score}}', score);
    text = text.replace('{{total}}', total);
    text = text.replace(/{{\?([^}]*)}}/, score==total?'$1':'');
    showDialog('results', `<p>${text}</p>`);
};
scoreButton.appendChild(new BiHTML(agedata.buttons.score));
