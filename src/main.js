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

document.getElementById('score').onclick = () => {
    document.body.className = 'showErrors';
    let {score,total} = myShelves.score();
    alert(`You got ${score} out of ${total}`);
};
