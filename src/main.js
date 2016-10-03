let shelves = [
    { name: "Neogene", answer: "6245" },
    { name: "Paleogene", answer: "2359" }
];

let SG = document.querySelector("#Shelfgroup");

for (let i=0; i<shelves.length; i++) {
    let shelf = shelves[i],
        startx, starty, enddrag;
    let s = document.createElement('div');
    SG.appendChild(s);
    let w = s.clientWidth,
        h = s.clientHeight;
    s.innerHTML = `<span>${shelf.name}</span>`;
    s.style.left = (50+Math.random()*40)+"vw";
    s.style.top = (10+Math.random()*80)+"vh";
    let drag = (e) => {
        s.style.left = (e.clientX-w/2)+"px";
        s.style.top = (e.clientY-h/2)+"px";
    };
    let startdrag = (e) => {
        document.addEventListener('mouseup', enddrag, true);
        document.addEventListener('mousemove', drag, true);
    };
    enddrag = () => {
        document.removeEventListener('mousemove', drag, true);
        document.removeEventListener('mouseup', enddrag, true);
    };
    s.addEventListener('mousedown', startdrag, true);
}
