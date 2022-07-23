"use strict";

//29-06-2022
export default class Entity {
    constructor() {
        this.is_mobile = 'ontouchstart' in document.documentElement;
    }

    hide(element) {
        element.setAttribute('hidden', true);
        element.classList.add('selectm23-hidden');
    }

    show(element) {
        element.removeAttribute('hidden');
        element.classList.remove('selectm23-hidden');
    }

    disable(element) {
        element.classList.add('selectm23-disabled');
    }

    enable(element) {
        element.classList.remove('selectm23-disabled');
    }

    is_disabled(element) {
        return element.classList.contains('selectm23-disabled');
    }

    create_id(prefix = '') {
        return prefix + Math.random().toString(36).substring(7);
    }
}

