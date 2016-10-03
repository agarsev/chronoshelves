let shelves = [
    { name: "Zenozoic", answer: 0 },
    { name: "Neogene", answer: 1 },
    { name: "Paleogene", answer: 2 },
    { name: "Mesozoic", answer: 3 },
    { name: "Cretaceous", answer: 4 },
    { name: "Jurassic", answer: 5 },
    { name: "Triassic", answer: 6 },
    { name: "Paleozoic", answer: 7 },
    { name: "Permian", answer: 8 },
    { name: "Carboniferous", answer: 9 },
    { name: "Devonian", answer: 10 },
    { name: "Silurian", answer: 11 },
    { name: "Ordovician", answer: 12 },
    { name: "Cambrian", answer: 13 },
];

let SG = document.getElementById('Shelfgroup');
let CS = document.getElementById('Chronoshelves');
let minleft = CS.getBoundingClientRect().right + 10;
let cells = CS.querySelectorAll('td');
let dragged = -1;
let drop = -1;
let totalCorrect = 0;

function addClass (el, cname) {
    if (el.className.indexOf(cname)<0) {
        el.className += ' '+cname;
    }
}

function removeClass (el, cname) {
    el.className = el.className.replace(' '+cname, '');
}

for (let i=0; i<shelves.length; i++) {
    let shelf = shelves[i],
        startx, starty, enddrag;
    let s = document.createElement('div');
    SG.appendChild(s);
    shelf.dom = s;
    s.innerHTML = `<span>${shelf.name}</span>`;
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
            if (drop == shelf.answer) {
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
        myheight = c.clientHeight;
    c.dropped = -1;
    c.onmouseover = (e) => {
        if (dragged < 0 || c.dropped >= 0) { return; }
        let d = shelves[dragged].dom;
        drop = i;
        if (vert) {
            d.style.transform = 'rotate(-90deg)';
            d.style.width = myheight+'px';
        }
    };
    c.onmouseout = (e) => {
        drop = -1;
        if (dragged < 0 || c.dropped >= 0) { return; }
        let d = shelves[dragged].dom;
        if (vert) {
            d.style.transform = '';
            d.style.width = '';
        }
    };
}
