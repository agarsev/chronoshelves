function addClass (el, cname) {
    if (el.className.indexOf(cname)<0) {
        el.className += ' '+cname;
    }
}

function removeClass (el, cname) {
    el.className = el.className.replace(' '+cname, '');
}

export default class Drawer {

    constructor ({shelf, startDrag, endDrag, name, color, white=false}) {
        this.rightshelf = shelf;
        this.correct = 0; // -1, 0, 1
        this.startDrag = startDrag;
        this.endDrag = endDrag;

        this.div = document.createElement('div');
        this.div.innerHTML = `<span style="color:${white?'white':'auto'}">${name}</span>`;
        this.div.style.background = '#'+color;
        this.handlers = { startDrag: this.startDragHandler.bind(this),
                          drag: this.dragHandler.bind(this),
                          endDrag: this.endDragHandler.bind(this) };
        this.div.addEventListener('mousedown', this.handlers.startDrag, true);
    }

    resetPosition (dom) {
        let r = dom.getBoundingClientRect();
        removeClass(this.div, 'dropped');
        removeClass(this.div, 'wrong');
        this.div.style.left = (r.left+(r.right-r.left)*(0.05+Math.random()*0.7))+"px";
        this.div.style.top = (r.top+(r.bottom-r.top)*(0.05+Math.random()*0.8))+"px";
    }

    dragHandler (e) {
        e.preventDefault();
        e.stopPropagation();
        this.div.style.left = (window.scrollX+e.clientX-this.div.clientWidth/2)+"px";
        this.div.style.top = (window.scrollY+e.clientY-this.div.clientHeight/2)+"px";
    }

    startDragHandler (e) {
        e.preventDefault();
        e.stopPropagation();
        addClass(this.div, 'ondrag');
        removeClass(this.div, 'dropped');
        removeClass(this.div, 'wrong');
        document.addEventListener('mouseup', this.handlers.endDrag, true);
        document.addEventListener('mousemove', this.handlers.drag, false);
        this.startDrag(this);
    }

    endDragHandler (e) {
        e.preventDefault();
        e.stopPropagation();
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
        if (shelf) {
            addClass(this.div, 'dropped');
        }
    }

}

