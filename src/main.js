/** DATA **/

let ages = [
    { name: "Cenozoic", color: "F2F91D", sub: [
        //{ name: "Quaternary", color: "F9F97F" },
        { name: "Quaternary", color: "F9F97F", sub: [
            { name: "Holocene", color: "FEF2E0" },
            { name: "Pleistocene", color: "FFF2AE" }]
        },
        //{ name: "Neogene", color: "FFE619" },
        { name: "Neogene", color: "FFE619", sub: [
            { name: "Pliocene", color: "FFFF99" },
            { name: "Miocene", color: "FFFF00" }]
        },
        { name: "Paleogene", color: "FD9A52" }]
    },
    { name: "Mesozoic", color: "67C5CA", sub: [
        { name: "Cretaceous", color: "7FC64E" },
        { name: "Jurassic", color: "34B2C9" },
        { name: "Triassic", color: "812B92", white: true }]
    },
    { name: "Paleozoic", color: "99C08D", sub: [
        { name: "Permian", color: "F04028" },
        { name: "Carboniferous", color: "67A599" },
        { name: "Devonian", color: "CB8C37" },
        { name: "Silurian", color: "B3E1B6" },
        { name: "Ordovician", color: "009270", white: true },
        { name: "Cambrian", color: "7FA056" }]
    },
    { name: "Precambrian", color: "F74370" }
];

/** UTILITY **/

function addClass (el, cname) {
    if (el.className.indexOf(cname)<0) {
        el.className += ' '+cname;
    }
}

function removeClass (el, cname) {
    el.className = el.className.replace(' '+cname, '');
}

/** GET SHELVES AND MAKE BOOKCASE **/

let shelves = [];
let CS = document.getElementById('Chronoshelves');

let maxdepth = 0;
function parseAge (age, depth=1) {
    let td = document.createElement('td');
    if (depth>maxdepth) { maxdepth=depth; }
    shelves.push({ name: age.name, color: age.color, white: age.white, answer: td });
    if (age.sub && age.sub.length>0) {
        let [ firstrow, ccount ] = parseAge(age.sub[0], depth+1);
        firstrow.insertBefore(td, firstrow.firstChild);
        for (let i=1;i<age.sub.length;i++){
            let [ _, count ] = parseAge(age.sub[i], depth+1);
            ccount += count;
        }
        td.rowSpan = ccount;
        return [ firstrow, ccount ];
    } else {
        let tr = document.createElement('tr');
        td.depth = depth;
        tr.appendChild(td);
        CS.appendChild(tr);
        return [ tr, 1 ];
    }
}
for (let i=0;i<ages.length;i++){
    parseAge(ages[i]);
}
for (let i=0;i<shelves.length;i++){
    let td = shelves[i].answer;
    if (td.depth&&td.depth<maxdepth) {
        td.colSpan = 1+maxdepth-td.depth;
    }
}

/** ADD INTERACTIVITY **/

let SG = document.getElementById('Shelfgroup');
let minleft = CS.getBoundingClientRect().right + 10;
let cells = CS.querySelectorAll('td');
let dragged = -1;
let drop = -1;
let totalCorrect = 0;

for (let i=0; i<shelves.length; i++) {
    let shelf = shelves[i],
        startx, starty, enddrag;
    let s = document.createElement('div');
    SG.appendChild(s);
    shelf.dom = s;
    s.innerHTML = `<span style="color:${shelf.white?'white':'auto'}">${shelf.name}</span>`;
    s.style.background = '#'+shelf.color;
    s.style.left = (50+Math.random()*40)+"vw";
    s.style.top = (10+Math.random()*80)+"vh";
    let drag = (e) => {
        s.style.left = (e.clientX-s.clientWidth/2)+"px";
        s.style.top = (e.clientY-s.clientHeight/2)+"px";
    };
    let startdrag = (e) => {
        dragged = i;
        addClass(s, 'ondrag');
        document.addEventListener('mouseup', enddrag, true);
        document.addEventListener('mousemove', drag, false);
    };
    enddrag = () => {
        if (drop>=0) {
            let c = cells[drop];
            let rect = c.getBoundingClientRect();
            if (c.rowSpan>1) {
                s.style.left = ((rect.right+rect.left)/2-s.clientWidth/2) + 'px';
                s.style.top = ((rect.top+rect.bottom)/2-s.clientHeight/2) + 'px';
            } else {
                s.style.left = rect.left + 'px';
                s.style.top = rect.top + 'px';
            }
            if (c == shelf.answer) {
                shelf.correct = true;
                removeClass(s, 'wrong');
            } else {
                shelf.correct = false;
                addClass(s, 'wrong');
            }
        } else {
            removeClass(s, 'wrong');
            if (s.offsetLeft < minleft) {
                s.style.left = (s.offsetLeft+minleft-s.offsetLeft)+'px';
            }
        }
        dragged = -1;
        removeClass(s, 'ondrag');
        document.removeEventListener('mousemove', drag, false);
        document.removeEventListener('mouseup', enddrag, true);
        totalCorrect = shelves.reduce((sum, x) => sum+(x.correct?1:0), 0);
        console.log(totalCorrect);
    };
    s.addEventListener('mousedown', startdrag, true);
}

for (let i=0; i<cells.length; i++) {
    let c = cells[i],
        vert = c.rowSpan>1,
        myheight = c.clientHeight,
        mywidth = c.clientWidth;
    c.dropped = -1;
    c.onmouseover = (e) => {
        if (dragged < 0 || c.dropped >= 0) { return; }
        let d = shelves[dragged].dom;
        drop = i;
        if (vert) {
            d.style.transform = 'rotate(-90deg)';
            d.style.width = myheight+'px';
        } else {
            d.style.width = mywidth+'px';
        }
    };
    c.onmouseout = (e) => {
        drop = -1;
        if (dragged < 0 || c.dropped >= 0) { return; }
        let d = shelves[dragged].dom;
        if (vert) {
            d.style.transform = '';
        }
        d.style.width = '';
    };
}

/** OTHER **/

let showErrors = document.getElementById('showErrors');
function checkShowErrors () {
    if (showErrors.checked) {
        addClass(document.body, 'showErrors');
    } else {
        removeClass(document.body, 'showErrors');
    }
}
checkShowErrors();
showErrors.onchange = checkShowErrors;
