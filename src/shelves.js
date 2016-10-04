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
        drawer.mount(this.layer);
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
            shelf.deadjustDrawer(this.currentDrawer);
        }
    }

    startDragDrawer (drawer) {
        this.currentDrawer = drawer;
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
        let totalCorrect = this.drawers.reduce((sum, x) => sum+(x.correct>0?1:0), 0);
        console.log(totalCorrect);
    }

};