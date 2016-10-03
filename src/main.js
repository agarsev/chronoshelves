let shelves = [
    { name: "Neogene", answer: "6245" },
    { name: "Paleogene", answer: "2359" }
];

let SG = document.querySelector("#Shelfgroup");
let cells = document.querySelectorAll('#Chronoshelves td');
let dragged = -1;
let drop = -1;

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
        s.className = 'ondrag';
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
        }
        dragged = -1;
        s.className = '';
        document.removeEventListener('mousemove', drag, false);
        document.removeEventListener('mouseup', enddrag, true);
    };
    s.addEventListener('mousedown', startdrag, true);
}

for (let i=0; i<cells.length; i++) {
    let c = cells[i],
        vert = c.rowSpan>1,
        myheight = c.clientHeight,
        defw;
    c.onmouseover = (e) => {
        if (dragged < 0) { return; }
        let d = shelves[dragged].dom;
        drop = i;
        if (vert) {
            d.style.transform = 'rotate(-90deg)';
            defw = d.style.width;
            d.style.width = myheight+'px';
        }
    };
    c.onmouseout = (e) => {
        if (dragged < 0) { return; }
        let d = shelves[dragged].dom;
        drop = -1;
        if (vert) {
            d.style.transform = '';
            d.style.width = '';
        }
    };
}
