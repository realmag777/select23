"use strict";

import Entity from './entity.js';

//29-06-2022
export default class Search extends Entity {
    constructor(wrapper, connect_id) {
        super();
        this.wrapper = wrapper;
        this.connect_id = connect_id;
        this.draw();
    }

    draw() {
        this.input = document.createElement('input');
        this.input.className = 'selectm23-input';
        this.hide(this.input);
        this.input.setAttribute('type', 'text');
        this.input.setAttribute('autocomplete', 'off');
        this.wrapper.appendChild(this.input);
    }

    focus() {
        this.input.focus();
    }
    
    reset(){
        this.input.value = '';
    }
}

