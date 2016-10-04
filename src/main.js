import Shelves from './shelves';

let myShelves = new Shelves(ages, document.getElementById('Chronoshelves'),
                            document.getElementById('Shelfgroup'));

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
