"use strict";

import Hooks from './hooks.js';
import Entity from './entity.js';

//29-06-2022
export default class Option extends Entity {
    constructor(select_option, wrapper, search, connect_id) {
        super();
        this.select_option = select_option;
        this.wrapper = wrapper;
        this.search = search;
        this.connect_id = connect_id;
        this.draw();
    }

    draw() {
        this.option = document.createElement('div');
        this.option.setAttribute('data-value', this.select_option.value);
        this.option.innerHTML = this.select_option.innerText;
        this.option.className = this.select_option.className;
        this.option.classList.add('selectm23-option');

        if (this.select_option.hasAttribute('selected')) {
            this.disable(this.option);
        }

        this.wrapper.appendChild(this.option);

        this.option.addEventListener(this.is_mobile ? 'touchstart' : 'click', (e) => {
            if (this.is_disabled(this.option)) {
                return false;
            }

            Hooks.trigger('add_selected', {
                connect_id: this.connect_id,
                option: this.option
            });

            this.search.focus();
            return true;
        });
    }
}

