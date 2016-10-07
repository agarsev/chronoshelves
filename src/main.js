import Shelves from './shelves';

let ages = document.getElementById('agesdata').textContent;

function b64DecodeUnicode(str) {
    return decodeURIComponent(Array.prototype.map.call(atob(str), function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
}

let myShelves = new Shelves(JSON.parse(b64DecodeUnicode(ages)),
                            document.getElementById('Chronoshelves'),
                            document.getElementById('Drawerlayer'));
myShelves.startDragNotify = () => document.body.className = '';

document.getElementById('reset').onclick = () => {
    document.body.className = '';
    myShelves.reset();
};

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

document.getElementById('score').onclick = () => {
    document.body.className = 'showErrors';
    let {score,total} = myShelves.score();
    showDialog('results', `<p>You got ${score} out of ${total}.${score==total?' Well done!':''}</p>`);
};

document.getElementById('aboutButton').onclick = () => showDialog('about');
