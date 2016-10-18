let all_bilingual_nodes = [];

export function setLang (index) {
    all_bilingual_nodes.forEach(s => s.setLang(index));
}

export default class BiHTML {

    constructor (langs) {
        this.langs = langs;
        this.span = document.createElement('span');
        this.span.innerHTML = langs[0];
        all_bilingual_nodes.push(this);
        return this.span;
    }

    setLang (i) {
        this.span.innerHTML = this.langs[i];
    }

}
