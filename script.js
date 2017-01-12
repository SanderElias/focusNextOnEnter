(function () {
    "use strict";

    // helper generator
    function* TraverseAndFindFocusableElements(elm) {
        if (elm.tabIndex > -1) {
            yield elm;
        }
        for (let child of [...elm.children]) {
            yield* TraverseAndFindFocusableElements(child)
        }
    }

    //es5 helper
    function Es5TraverseAndFindFocusableElements(elm) {
        var result = []
        inspect(elm);
        return result;

        function inspect(elm) {
            if (elm.tabIndex > -1) {
                result.push(elm);
            }
            for (let child of [...elm.children]) {
                inspect(child)
            }
        }
    }



    function focusNext() {
        return {
            restrict: "A", //make it an attribute selector
            controller: focusNextController
        }

        /* ngInject() */
        function focusNextController($element) {
            const el = $element[0]; //grab the raw dom element!
            this.$onInit = () => {
                el.addEventListener('keydown', handleEnter)
            }

            this.$onDestroy = () => {
                el.removeEventListener('keydown', handleEnter)
            };


            function handleEnter(ev) {
                if (ev.keyCode === 13) {
                    ev.preventDefault();
                    // utilize the above generator and ES6 spread to build an array of focusable elements
                    // now using an ES5 helper.
                    let elmList = Es5TraverseAndFindFocusableElements(document.body);
                    let current = elmList.findIndex(n => n == el);
                    let next = Math.min(elmList.length - 1, current + 1);
                    if (ev.shiftKey) { //reverse on shift, make it on par with tab.
                        next = Math.max(0, current - 1)
                    }
                    elmList[next].focus();
                }
            }
        }
    }

    angular
        .module('nextEnter', [])
        .directive('focusNext', focusNext)

}());