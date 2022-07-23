"use strict";

import Hooks from './hooks.js';
import Entity from './entity.js';
import Option from './option.js';

//29-06-2022
export default class Options extends Entity {
    constructor(select23, use_drag, placeholder) {
        super();
        
        this.connect_id = select23.connect_id;

        Hooks.subscribe('add_selected', e => {
            this.add_selected(e.option)
        }, this.connect_id);

        this.select23 = select23;
        this.select = this.select23.select;
        this.wrapper = this.select23.wrapper;
        this.is_multiple = true;

        if (!this.select.hasAttribute('multiple')) {
            use_drag = false;
            this.is_multiple = false;
        }
        
        this.use_drag = use_drag;

        if (this.select.hasAttribute('data-use-drag')) {
            if (parseInt(this.select.getAttribute('data-use-drag'), 10)) {
                this.use_drag = true;
            } else {
                this.use_drag = false;
            }
        }

        this.value = this.select23.value;        
        this.search = this.select23.search;
        this.placeholder = placeholder;

        this.dragged_element = null;//for moving selected options
        this.ghost = null;
        this.ghost_delay_timer = null;//to avoid immediate clicks

        this.options = [];
        this.draw();
        this.set_placeholder();
    }

    draw() {
        this.container = document.createElement('div');//all options exept selected ones
        this.container.className = 'selectm23-options';
        this.hide(this.container);
        this.wrapper.appendChild(this.container);

        this.selecton = document.createElement('span');//selected options here
        this.selecton.className = 'selectm23-selecton';
        if (this.is_multiple) {
            this.selecton.classList.add('selectm23-selecton-multi');
        }
        this.wrapper.appendChild(this.selecton);

        this.load();
    }

    load() {
        this.select.querySelectorAll('option').forEach((o) => {

            if (o.value === 'selectm23-exclude') {
                o.remove();
                return;
            }

            let option = new Option(o, this.container, this.search, this.connect_id);
            this.options.push(option);
        });

        this.set_selected();
    }

    set_selected() {
        let selected_options = [];
        let selected_vals = '';

        if (this.select.hasAttribute('data-values')) {
            selected_vals = this.select.getAttribute('data-values').split(',');
        }

        //***

        this.select.querySelectorAll('option').forEach((option) => {
            if (option.hasAttribute('selected')) {
                if (selected_vals.length) {
                    try {
                        selected_options[option.value] = this.container.querySelector(`[data-value="${option.value}"]`);
                    } catch (e) {
                        //key "length": https://stackoverflow.com/questions/61655194/uncaught-rangeerror-invalid-array-length-js-engine-bug-see-the-code-example
                        selected_options['~' + option.value] = this.container.querySelector(`[data-value="${option.value}"]`);
                    }
                } else {
                    this.add_selected(option, false);
                }
            }

        });

        //***

        for (let i = 0; i < selected_vals.length; i++) {
            if (selected_options['~' + selected_vals[i]]) {
                //fix for length field https://stackoverflow.com/questions/61655194/uncaught-rangeerror-invalid-array-length-js-engine-bug-see-the-code-example
                this.add_selected(selected_options['~' + selected_vals[i]], false);
            } else {
                this.add_selected(selected_options[selected_vals[i]], false);
            }

        }

        //***
        if (this.use_drag) {
            document.addEventListener(this.is_mobile ? 'touchend' : 'mouseup', (e, x) => {
                if (this.ghost) {
                    e.preventDefault();
                    this.delete_ghost();
                    this.dragged_element = null;
                }
            });

            document.addEventListener(this.is_mobile ? 'touchmove' : 'mousemove', (e) => {
                if (this.ghost) {

                    let target = e.target;

                    if (this.is_mobile) {
                        target = document.elementFromPoint(e.changedTouches[e.changedTouches.length - 1].pageX, e.changedTouches[e.changedTouches.length - 1].pageY);
                    }

                    if (target.closest('.selectm23') === this.wrapper) {
                        if (target.classList.contains('selectm23-selected')) {

                            if (this.ghost !== target) {

                                if (this.select23.find_prev_visible_sibling(this.ghost) === target) {
                                    target.before(this.ghost);
                                } else {
                                    target.after(this.ghost);
                                }

                            }
                        }
                    }

                }
            });
        }
    }

    add_selected(option, cast = true) {
        if (option) {
            let option_value = null;

            if (option.hasAttribute('data-value')) {
                option_value = option.getAttribute('data-value');
            } else {
                option_value = option.getAttribute('value');
            }

            let selected = document.createElement('span');
            selected.className = 'selectm23-selected';
            selected.setAttribute('data-value', option_value);

            this.value.push(option_value);

            Hooks.trigger('update_value', {
                connect_id: this.connect_id,
                value: this.value
            });

            if (this.select.querySelector(`option[value="${option_value}"]`)) {
                this.select.querySelector(`option[value="${option_value}"]`).setAttribute('selected', '');
            }

            selected.innerHTML = option.innerText;
            this.disable(option);
            this.hide(this.container);
            //remove all text nodes
            //[...this.options.selecton.childNodes].forEach(elm => elm.nodeType !== 1 && elm.parentNode.removeChild(elm))
            this.set_placeholder(true);
            this.selecton.appendChild(selected);

            let cross = document.createElement('span');
            cross.className = 'selectm23-selected-cross';
            cross.innerHTML = 'x';
            selected.appendChild(cross);

            if (cast) {
                this.select23.cast();
            }

            selected.addEventListener(this.is_mobile ? 'touchstart' : 'click', (e) => {
                clearTimeout(this.select23.ghost_delay_timer);
                this.show_options();
                this.search.focus();

                return true;
            });

            //+++
            if (this.use_drag) {
                selected.addEventListener(this.is_mobile ? 'touchstart' : 'mousedown', (e) => {
                    e.preventDefault();
                    e.stopPropagation();

                    this.select23.ghost_delay_timer = setTimeout(() => {
                        this.hide(this.container);
                        this.create_ghost(selected);
                    }, 223);

                });
            }
            //***

            cross.addEventListener(this.is_mobile ? 'touchstart' : 'click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.value = [...new Set(this.value)];//!!
                this.value.splice(this.value.indexOf(selected.getAttribute('data-value')), 1);

                Hooks.trigger('update_value', {
                    connect_id: this.connect_id,
                    value: this.value
                });

                this.show(this.container.querySelector(`[data-value="${selected.getAttribute('data-value')}"]`));
                this.select.querySelector(`option[value="${option_value}"]`).removeAttribute('selected');
                this.enable(this.container.querySelector(`div[data-value="${option_value}"]`));
                selected.remove();
                this.hide(this.container);
                this.hide(this.search.input);
                Hooks.trigger('cast', {
                    connect_id: this.connect_id
                });
                clearTimeout(this.select23.ghost_delay_timer);

                if (this.selecton.querySelectorAll('.selectm23-selected').length === 0) {
                    this.set_placeholder();
                }

                return true;
            });

            //*** design
            //selected.style.setProperty(`--woof-sd-padding_top`, '10px');

            /*
             this.set_design('selected_width', '100%');//todo
             
             if (Object.keys(this.design).length > 0) {
             for (let key in this.design) {
             selected.style.setProperty(`--woof-sd-${key}`, this.design[key]);
             }
             }
             * 
             */
    }
    }

    set_placeholder(empty = false) {
        if (empty) {
            this.wrapper.style.background = '';
        } else {
            this.wrapper.style.background = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' version='1.1' height='50px' width='120px'><text x='5' y='18' fill='black' font-size='14'>${this.placeholder}</text></svg>") no-repeat`;
    }

    }

    show_options() {
        if (typeof Options.start_z_index === 'undefined') {
            Options.start_z_index = 9999;
        }

        this.container.style.zIndex = Options.start_z_index++;
        this.show(this.container);
    }

    reset_visibility() {
        if (this.options.length > 0) {
            this.options.forEach(o => {
                this.show(o.option);
            });

        }
    }

    create_ghost(element) {
        this.dragged_element = element;
        this.ghost = this.dragged_element.cloneNode(true);
        this.ghost.classList.add('selectm23-ghost');
        this.dragged_element.after(this.ghost);
        this.hide(this.dragged_element);
    }

    delete_ghost() {
        clearTimeout(this.ghost_delay_timer);
        if (this.ghost) {
            this.ghost.before(this.dragged_element);
            this.show(this.dragged_element);
            this.ghost.remove();
            this.ghost = null;

            //***

            this.select23.reorder_values();
        }
    }

}

