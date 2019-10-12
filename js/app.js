'use strict';

let m;

document.addEventListener('DOMContentLoaded', function() {
    if (!navigator.bluetooth) {
        toggleClass(document.querySelector('#unsupported'), 'hidden');
        document.querySelector('#connect').disabled = true;
        return;
    }

    let uiConnected = function() {
        document.querySelector('#connect').disabled = false;
        document.querySelector('#connect').innerText = 'Disconnect';
    };

    let uiPending = function() {
        document.querySelector('#connect').disabled = true;
        document.querySelector('#connect').innerText = 'Connecting';
    };

    let uiDisconnected = function() {
        document.querySelector('#connect').disabled = false;
        document.querySelector('#connect').innerText = 'Connect';

        let e = document.querySelector('#notifications');
        while (e.firstChild) {
            e.removeChild(e.firstChild);
        }
    };

    let uiMessage = function(e) {
        let div = document.getElementById(e.type);
        if (!div) {
            div = document.createElement('div');
            div.id = e.type;
            document.querySelector('#notifications').appendChild(div);

            dragula([div]);
        }

        /* iterate data elements and create / update value */
        for (let k in e.data) {
            if (e.data.hasOwnProperty(k)) {
                let selector = '#' + e.type + ' span.' + k;
                let s = document.querySelector(selector);
                if (!s) {
                    let p = document.createElement('div');      /* one block per item */

                    let desc = document.createElement('span');
                    desc.className = 'element';
                    desc.textContent = pm5fields[k].label;

                    s = document.createElement('span');         /* create item */
                    s.className = 'value ' + k;

                    p.appendChild(desc);                        /* key name */
                    p.appendChild(s);                           /* data element */
                    div.appendChild(p);                         /* append block to container */

                    p.addEventListener('click', function(e) {
                        toggleClass(this, 'highlight');
                    });
                }
                s.textContent = pm5fields[k].printable(e.data[k]);
            }
        }
    };

    document.querySelector('#connect').addEventListener('click', function() {
        uiPending();

        if (m.connected()) {
            m.doDisconnect();
        } else {
            m.doConnect();
        }
    });

    /*
     * Toggle highlight on selected elements.
     */
    document.querySelectorAll('#notifications > div').forEach(function(el, i) {
        el.addEventListener('click', function(e) {
            toggleClass(this, 'highlight');
        });
    });

    /*
     * Show / hide description blocks.
     */
    document.querySelectorAll('.notes').forEach(function(el, i) {
        el.addEventListener('click', function(e) {
            toggleClass(this, 'hidden');
        });
    });

    m = new PM5(uiPending, uiConnected, uiDisconnected, uiMessage);
});
