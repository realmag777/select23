/**
 * @summary     Select23
 * @description pure javascript drop-down
 * @version     1.0.0
 * @file        select23
 * @author      Rostislav Sofronov <realmag777>
 * @contact     https://pluginus.net/contact-us/
 * @github      https://github.com/realmag777/select23
 * @copyright   Copyright 2022 PluginUs.Net
 *
 * This source file is free software, available under the following license:
 * MIT license - https://en.wikipedia.org/wiki/MIT_License
 */

'use strict';
import Hooks from './hooks.js';
import Entity from './entity.js';
import Options from './options.js';
import Search from './search.js';

//29-06-2022
export default class SelectM23 extends Entity {
    constructor(select, use_drag = false, placeholder = '', design = null) {
        super();
        this.connect_id = this.create_id();

        Hooks.subscribe('update_value', e => {
            this.value = e.value;
        }, this.connect_id);

        //+++        

        this.value = [];
        this.design = design;
        this.select = select;
        this.hide(this.select);

        this.wrapper = document.createElement('div');
        this.wrapper.className = 'selectm23';
        this.select.after(this.wrapper);
        this.wrapper.appendChild(this.select);

        this.search = new Search(this.wrapper, this.connect_id);
        this.options = new Options(this, use_drag, placeholder);

        //***

        this.wrapper.addEventListener(this.is_mobile ? 'touchstart' : 'click', (e) => {
            this.options.show_options();
            this.show(this.search.input);
            this.search.focus();
            return true;
        });

        this.search.input.addEventListener(this.is_mobile ? 'touchstart' : 'click', (e) => {
            this.search.focus();
            this.options.show_options();
            return true;
        });

        document.addEventListener(this.is_mobile ? 'touchstart' : 'click', (e) => {
            let show = e.target === this.search.input;
            if (!show) {
                show = e.target === this.wrapper;
            }

            if (!show) {
                if (e.target.classList.contains('selectm23-selected')) {
                    show = true;
                    this.search.focus();
                }
            }

            if (!show) {
                this.hide(this.options.container);
                this.hide(this.search.input);
                this.unselect_selected();
            }

            this.search.reset();
            this.options.reset_visibility();
            //this.options.set_placeholder(false);

            return true;
        });

        this.search.input.addEventListener('keyup', (e) => {
            this.options.show_options();
            switch (e.keyCode) {
                case 37:
                case 39:
                    this.select_option(this.find_next_visible_sibling(this.options.container.querySelectorAll('.selectm23-option')[0]));
                    break;
                case 38://up
                case 40://down
                    if (this.options.container.querySelector('.selectm23-option-selected')) {
                        let current = this.options.container.querySelector('.selectm23-option-selected');
                        if (e.keyCode === 40) {
                            let next = this.find_next_visible_sibling(current);
                            if (next) {
                                this.unselect_selected();
                                this.select_option(next);
                                this.options.container.scrollTop = next.offsetTop;
                                break;
                            }
                        } else {
                            let prev = this.find_prev_visible_sibling(current);
                            if (prev) {
                                this.unselect_selected();
                                this.select_option(prev);
                                this.options.container.scrollTop = prev.offsetTop;
                                break;
                            }
                        }
                    } else {
                        this.select_option(this.find_next_visible_sibling(this.options.container.querySelectorAll('.selectm23-option')[0]));
                    }

                    break;
                case 13:
                    if (this.options.container.querySelector('.selectm23-option-selected')) {
                        let option = this.options.container.querySelector('.selectm23-option-selected');
                        this.options.add_selected(option);
                    }
                    break;
                case 27:

                    if (this.search.input.value.length > 0) {
                        this.search.reset();
                        this.options.container.querySelectorAll('.selectm23-option').forEach((option) => {
                            if (!this.value.includes(option.getAttribute('data-value'))) {
                                this.show(option);
                            }
                        });
                    } else {
                        this.hide(this.options.container);
                        this.hide(this.search.input);
                    }

                    this.unselect_selected();
                    break;
                default:

                    this.options.container.querySelectorAll('.selectm23-option').forEach((option) => {
                        if (this.search.input.value.length > 0) {
                            if (option.innerText.search(new RegExp(this.search.input.value, 'i')) !== -1) {
                                if (!this.value.includes(option.getAttribute('data-value'))) {
                                    this.show(option);
                                }
                            } else {
                                this.hide(option);
                            }
                        } else {
                            if (!this.value.includes(option.getAttribute('data-value'))) {
                                this.show(option);
                            }
                        }
                    });
                    break;
            }


            if (this.search.input.value.length > 0) {
                this.options.set_placeholder(true);
            } else {
                this.options.set_placeholder(false);
            }

            return true;
        });

    }

    /*********************************************/

    update(value) {
        this.value = [...new Set(value)];
        this.options.selecton.innerHTML = '';
        this.select.setAttribute('data-values', this.value.join());

        this.options.container.querySelectorAll('.selectm23-option').forEach((o) => {
            this.enable(o);
        });

        this.onSelect();
        this.options.set_selected();
    }

    find_prev_visible_sibling(option) {
        let prev = null;

        if (option.previousElementSibling) {
            if (!option.previousElementSibling.classList.contains('selectm23-hidden')) {
                prev = option.previousElementSibling;
            } else {
                prev = this.find_prev_visible_sibling(option.previousElementSibling);
            }
        }

        return prev;
    }

    find_next_visible_sibling(option) {
        let next = null;

        if (option.nextElementSibling) {
            if (!option.nextElementSibling.classList.contains('selectm23-hidden')) {
                next = option.nextElementSibling;
            } else {
                next = this.find_next_visible_sibling(option.nextElementSibling);
            }
        }

        return next;
    }

    unselect_selected() {
        if (this.options.container.querySelectorAll('.selectm23-option-selected').length > 0) {

            this.options.container.querySelectorAll('.selectm23-option-selected').forEach(item => {
                item.classList.remove('selectm23-option-selected');
            });

        }
    }

    select_option(option) {
        option.classList.add('selectm23-option-selected');
    }

    set_design(key, value) {
        if (!this.design) {
            this.design = {};
        }

        this.design[key] = value;
    }

    cast() {

        this.onSelect();

        if (this.value.length > 0) {
            this.options.set_placeholder(true);
        } else {
            this.options.set_placeholder(false);
        }

        if (this.options.use_drag) {
            this.reorder_values();
        } else {
            this.select.dispatchEvent(new Event('change'));//disabled because not right reorder saved if to add new option
        }
    }

    //+++

    reorder_values() {
        let values = [];
        this.options.selecton.querySelectorAll('.selectm23-selected').forEach((option) => {
            values.push(option.getAttribute('data-value'));
        });

        //***

        if (this.select.getAttribute('data-values') !== values.join(',')) {
            this.select.setAttribute('data-values', values.join(','));

            this.select.dispatchEvent(new CustomEvent('selectm23-reorder', {detail: {
                    values: this.select.getAttribute('data-values')
                }}));
        }
    }

    onSelect() {
        //for API
    }
}


