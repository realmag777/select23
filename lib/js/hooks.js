"use strict";
//like wp hooks
//dev by realmag777
//25-04-2022
export default class Hooks {

    static subscriptions = [];

    static subscribe(name, callback, connect_id = '') {
        if (!this.subscriptions[name + connect_id]) {
            this.subscriptions[name + connect_id] = [];
        }

        //https://stackoverflow.com/questions/7616461/generate-a-hash-from-string-in-javascript
        let marker = (new Error()).stack.split('').map(v => v.charCodeAt(0)).reduce((a, v) => a + ((a << 7) + (a << 3)) ^ v).toString(16);
        this.subscriptions[name + connect_id].push({marker, callback});
    }

    static trigger(name, data) {
        let called = [];//to avoid calling the same callback more than 1 time
        let connect_id = '';
        if (data.connect_id) {
            connect_id = data.connect_id;
        }

        if (this.subscriptions[name + connect_id] && this.subscriptions[name + connect_id].length > 0) {
            for (let action of this.subscriptions[name + connect_id]) {
                if (!called.includes(action.marker)) {
                    called.push(action.marker);
                    action.callback(data);
                }
            }
        }

    }

    static clear() {
        this.subscriptions = [];
    }
}

