"use strict";
import Select23 from './select23.js';

window.addEventListener('load', function () {

    let select = document.getElementById('select23');
    let select_o = new Select23(select, true);//wrapping of <select>

    select.addEventListener('selectm23-reorder', function (e) {
        console.log(`Reorder is done: ${e.detail.values}`);
    });

    select.addEventListener('change', function (e) {
        console.log(`Selection is done: ${e.detail.values}`);
    });

    select_o.onSelect = function () {
        console.log(this);
    }

});


