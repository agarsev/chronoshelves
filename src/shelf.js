export default class Shelf {

    constructor (mouseOver, mouseOut) {
        this.depth = null;
        this.vertical = false;
        this.occupied = false;
        this.td = document.createElement('td');
        this.td.onmouseover = () => mouseOver(this);
        this.td.onmouseout = () => mouseOut(this);
    }

    // expand to the right incomplete ages
    expandRight (num_cols) {
        if (this.depth !== null && this.depth < num_cols) {
            this.td.colSpan = 1+num_cols-this.depth;
        }
    }

    set rowSpan (n) {
        this.td.rowSpan = n;
        this.vertical = n>1;
    }

    adjustDrawer (drawer) {
        if (this.vertical) {
            drawer.div.style.transform = 'rotate(-90deg)';
            drawer.div.style.width = this.td.clientHeight+'px';
        } else {
            drawer.div.style.width = this.td.clientWidth+'px';
        }
    }

    deadjustDrawer (drawer) {
        drawer.div.style.transform = '';
        drawer.div.style.width = '';
    }

    drop (drawer) {
        let rect = this.td.getBoundingClientRect();
        if (this.vertical) {
            drawer.div.style.left = ((rect.right+rect.left)/2-(rect.bottom-rect.top)/2) + 'px';
            drawer.div.style.top = ((rect.top+rect.bottom)/2-drawer.div.clientHeight/2) + 'px';
        } else {
            drawer.div.style.left = rect.left + 'px';
            drawer.div.style.top = rect.top + 'px';
        }
    }

}
