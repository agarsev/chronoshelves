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

let showErrors = document.getElementById('showErrors');
function checkShowErrors () {
    if (showErrors.checked) {
        document.body.className = 'showErrors';
    } else {
        document.body.className = '';
    }
}
checkShowErrors();
showErrors.onchange = checkShowErrors;
