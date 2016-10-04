function addClass (el, cname) {
    if (el.className.indexOf(cname)<0) {
        el.className += ' '+cname;
    }
}

function removeClass (el, cname) {
    el.className = el.className.replace(' '+cname, '');
}

export default class Drawer {

    constructor ({shelf, startDrag, endDrag, name, color, iswhite=false}) {
        this.rightshelf = shelf;
        this.correct = 0; // -1, 0, 1
        this.startDrag = startDrag;
        this.endDrag = endDrag;

        this.div = document.createElement('div');
        this.div.innerHTML = `<span style="color:${iswhite?'white':'auto'}">${name}</span>`;
        this.div.style.background = '#'+color;
        this.handlers = { startDrag: this.startDragHandler.bind(this),
                          drag: this.dragHandler.bind(this),
                          endDrag: this.endDragHandler.bind(this) };
    }

    mount (dom) {
        this.div.style.left = (50+Math.random()*40)+"vw";
        this.div.style.top = (10+Math.random()*80)+"vh";
        this.div.addEventListener('mousedown', this.handlers.startDrag, true);
        dom.appendChild(this.div);
    }

    dragHandler (e) {
        this.div.style.left = (e.clientX-this.div.clientWidth/2)+"px";
        this.div.style.top = (e.clientY-this.div.clientHeight/2)+"px";
    }

    startDragHandler (e) {
        addClass(this.div, 'ondrag');
        document.addEventListener('mouseup', this.handlers.endDrag, true);
        document.addEventListener('mousemove', this.handlers.drag, false);
        this.startDrag(this);
    }

    endDragHandler (e) {
        removeClass(this.div, 'ondrag');
        document.removeEventListener('mousemove', this.handlers.drag, false);
        document.removeEventListener('mouseup', this.handlers.endDrag, true);
        this.endDrag(this);
    }

    drop (shelf) {
        if (shelf && shelf == this.rightshelf) {
            this.correct = 1;
            removeClass(this.div, 'wrong');
        } else if (shelf) {
            this.correct = -1;
            addClass(this.div, 'wrong');
        } else {
            this.correct = 0;
            removeClass(this.div, 'wrong');
        }
    }

}

