import Shelf from './shelf';
import BiHTML from './bihtml';

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
        this.div.appendChild(new BiHTML(name));
        if (white) {
            this.div.style = "color:white;";
        }
        this.div.style.background = '#'+color;
        this.handlers = { startDrag: this.startDragHandler.bind(this, false),
                          drag: this.dragHandler.bind(this, false),
                          endDrag: this.endDragHandler.bind(this, false),
                          startTouch: this.startDragHandler.bind(this, true),
                          touch: this.dragHandler.bind(this, true),
                          endTouch: this.endDragHandler.bind(this, true) };
        this.div.addEventListener('mousedown', this.handlers.startDrag, true);
        this.div.addEventListener('touchstart', this.handlers.startTouch, true);
    }

    resetPosition (dom) {
        let r = dom.getBoundingClientRect();
        let w = this.div.clientWidth;
        removeClass(this.div, 'dropped');
        removeClass(this.div, 'wrong');
        this.correct = 0;
        this.droppedshelf = undefined;
        Shelf.deadjustDrawer(this);
        this.div.style.left = (r.left+(r.right-r.left-w)*(0.05+Math.random()*0.95))+"px";
        this.div.style.top = (r.top+(r.bottom-r.top)*(0.05+Math.random()*0.85))+"px";
    }

    dragHandler (istouch, e) {
        if (istouch) {
            e = e.touches[0];
        }
        this.div.style.left = (window.scrollX+e.clientX-this.div.clientWidth/2)+"px";
        this.div.style.top = (window.scrollY+e.clientY-this.div.clientHeight/2)+"px";
    }

    startDragHandler (istouch, e) {
        e.preventDefault();
        e.stopPropagation();
        addClass(this.div, 'ondrag');
        removeClass(this.div, 'dropped');
        removeClass(this.div, 'wrong');
        if (istouch) {
            document.addEventListener('touchend', this.handlers.endTouch, true);
            document.addEventListener('touchcancel', this.handlers.endTouch, true);
            document.addEventListener('touchmove', this.handlers.touch, false);
        } else {
            document.addEventListener('mouseup', this.handlers.endDrag, true);
            document.addEventListener('mousemove', this.handlers.drag, false);
        }
        this.startDrag(this);
    }

    endDragHandler (istouch, e) {
        e.preventDefault();
        e.stopPropagation();
        removeClass(this.div, 'ondrag');
        if (istouch) {
            document.removeEventListener('touchmove', this.handlers.touch, false);
            document.removeEventListener('touchcancel', this.handlers.endTouch, true);
            document.removeEventListener('touchend', this.handlers.endTouch, true);
        } else {
            document.removeEventListener('mousemove', this.handlers.drag, false);
            document.removeEventListener('mouseup', this.handlers.endDrag, true);
        }
        this.endDrag(this);
    }

    drop (shelf) {
        this.droppedshelf = shelf;
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

