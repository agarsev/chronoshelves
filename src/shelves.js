import Drawer from './drawer';
import Shelf from './shelf';

export default class Shelves {

    constructor (ages, domTable, drawerLayer) {
        this.root = domTable;
        this.layer = drawerLayer;
        this.setData(ages);
    }

    /* ages: array of age */
    setData (ages) {
        this.drawers = []; // Array<Drawer>
        this.shelves = []; // Array<Shelf>

        this.maxdepth = 0;
        ages.forEach(x => this.addAge(x));
        this.shelves.forEach(x => x.expandRight(this.maxdepth));
        this.drawers.forEach(x => x.resetPosition(this.layer));
        document.addEventListener('touchmove', this.checkTouchShelf.bind(this), false);
    }

    reset () {
        this.drawers.forEach(x => x.resetPosition(this.layer));
    }

    score () {
        let score = this.drawers.reduce((sum, x) => sum+(x.correct>0?1:0), 0);
        return { score, total: this.drawers.length };
    }

    /* age: name(str), color(str), sub(ages) */
    addAge (age, depth=1) {

        if (depth>this.maxdepth) { this.maxdepth=depth; }

        let shelf = new Shelf(this.mouseOverShelf.bind(this),
                              this.mouseOutShelf.bind(this));
        this.shelves.push(shelf);

        let drawer = new Drawer({shelf,
                                startDrag: this.startDragDrawer.bind(this),
                                endDrag: this.endDragDrawer.bind(this),
                                ...age});
        this.layer.appendChild(drawer.div);
        this.drawers.push(drawer);

        // create table & row structure
        if (age.sub && age.sub.length>0) {
            let [ firstrow, childcount ] = this.addAge(age.sub[0], depth+1);
            firstrow.insertBefore(shelf.td, firstrow.firstChild);
            for (let i=1;i<age.sub.length;i++){
                let [ _, count ] = this.addAge(age.sub[i], depth+1);
                childcount += count;
            }
            shelf.rowSpan = childcount;
            return [ firstrow, childcount ];
        } else {
            let tr = document.createElement('tr');
            shelf.depth = depth;
            tr.appendChild(shelf.td);
            this.root.appendChild(tr);
            return [ tr, 1 ];
        }
    }

    mouseOverShelf (shelf) {
        if (this.currentDrawer) {
            this.currentShelf = shelf;
            shelf.adjustDrawer(this.currentDrawer);
        }
    }

    mouseOutShelf (shelf) {
        this.currentShelf = null;
        if (this.currentDrawer) {
            Shelf.deadjustDrawer(this.currentDrawer);
        }
    }

    startDragDrawer (drawer) {
        this.currentDrawer = drawer;
        if (this.startDragNotify) {
            this.startDragNotify();
        }
    }

    endDragDrawer (drawer) {
        this.currentDrawer = null;
        if (this.currentShelf) {
            this.currentShelf.drop(drawer);
            drawer.drop(this.currentShelf);
        } else {
            drawer.drop(null);
            let minleft = this.root.getBoundingClientRect().right + 10;
            if (drawer.div.offsetLeft < minleft) {
                drawer.div.style.left = minleft+'px';
            }
        }
    }

    checkTouchShelf (e) {
        let t = e.touches[0];
        for (let i = 0; i<this.shelves.length; i++) {
            let s = this.shelves[i];
            if (s.isInside(t.clientX, t.clientY)) {
                this.mouseOverShelf(s);
            } else if (s == this.currentShelf) {
                this.mouseOutShelf(s);
            }
        }
    }

};
