'use strict';
// import 'bootstrap/js/dist/collapse';
// import 'bootstrap/js/dist/modal';
import * as general from './partials/general';
import $ from 'jquery';

import '../scss/main.scss';

/**
 * Check that the document is ready
 */
const init = function () {
    general.example();
};

function ready(fn) {
    if (document.readyState !== 'loading') {
        fn();
    } else {
        document.addEventListener('DOMContentLoaded', fn);
    }
}

ready(init);
