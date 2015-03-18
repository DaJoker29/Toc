var Toc = (function() {

    /**
     * Variables
     */
    var Toc = {},
        headings = 'h1, h2, h3, h4, h5, h6';

    /**
     * Methods
     */
    
    /**
     * Borrowed forEach() that works across Arrays, Objects and NodeLists
     * @author Chris Ferdinandi, http://github.com/cferdinandi/smooth-scroll
     * @license http://gomakethings.com/mit/ MIT License
     *
     * 
     * @private
     * @param {Array|Object|NodeList} collection Collection of items to iterate over
     * @param {Function} callback Callback function for each iteration
     * @param {Array|Object|NodeList} scope Object/NodeList/Array that forEach is iterating over (aka `this`)
     */
     var forEach = function (collection, callback, scope) {
        if (Object.prototype.toString.call(collection) === '[object Object]') {
            for ( var prop in collection ) {
                if(Object.prototype.hasOwnProperty.call(collection, prop)) {
                    callback.call(scope, collection[prop], prop, collection);
                }
            }
        } else {
            for (var i = 0, len = collection.length; i< len; i++) {
                callback.call(scope, collection[i], i, collection);
            }
        }
     };

    /**
    * Generates a simple random string to represent an unique ID
    *
    * @private
    */
    var createId = function () {
        return '_' + Math.random().toString(36).substr(2, 9);
    };
    
    /**
     * Checks all Heading Tags (h1-h6) for a unique ID.
     * If one doesn't exist, it creates one based.
     *
     *
     * @private
     * @param {NodeList} nodeList NodeList of the elements being checked for IDs
     */
    var identify = function( nodeList ) {
        forEach(nodeList, function( element ) {
            element.id = element.id || createId();
        });
    };

    /**
     * Builds a map of all headings with nesting
     * @param {NodeList} nodeList NodeList of Heading Elements
     * @return {Array}
     */
    var mapHeadings = function( nodeList ) {
        var list = nodeToArray(nodeList);
        var map = list.map(function( value, index, array ) {
            console.log(array);
            return buildItem( array );
        });

        return map;
    };

    /**
     * Build Map Item
     * @param {Node} node Node to build the item out of
     * @param {Number} level The next item in the array to determine if it should be a child
     * @return {Obj}
     */
    var buildItem = function( array ) {
        var node = array.shift();
        var obj = {
            'id': node.id,
            'text': node.textContent,
            'children': []
        };

        while (array[0] && level(node) < level(array[0])) {
            obj.children.push(buildItem( array ));
        }

        return obj;
    };

    /**
     * Returns the level of Heading tag
     * @param {Node|Object} node Object to return the level of
     * @return {Int}
     */
    var level = function( node ) {
        return Number.parseInt(node.tagName.slice(1));
    };

    /**
     * Convert NodeList to an Array
     * @param {NodeList} nodeList NodeList to be converted
     * @return {Array}
     */
    var nodeToArray = function( nodeList ) {
        return Array.prototype.slice.call(nodeList);
    };

    // Build Navigation Element
    var build = function( map ) {
        // var level, child;
        // var nav = document.querySelector('nav');

        // forEach(map, function(element) {
        //     if (level === undefined) {
        //         level = element.level;
        //         var ul = document.createElement('ul');
        //         ul.appendChild(listItem(element));
        //         nav.appendChild(ul);
        //     } else if (level < element.level) {
        //         level = element.level;
        //         child = ulItem(element);
        //     } else if (level === element.level) {
        //         if(child !== undefined) {
        //             child.appendChild(listItem(element));
        //         } else {
        //             nav.lastChild.appendChild(listItem(element));
        //         }
        //     } else if (level > element.level) {
        //         child = undefined;
        //         level = element.level;
        //     }
        // });
    };

    var ulItem = function (obj) {
        var ul = document.createElement('ul');
        ul.appendChild(listItem(obj));

        return ul;
    };

    var listItem = function( obj ) {
        var a = document.createElement('a');
        var li = document.createElement('li');

        a.href = '#' + obj.id;
        a.textContent = obj.text;

        li.appendChild(a);

        return li;
    };

    Toc.run = function() {
        var nodeList = document.querySelectorAll(headings);

        // Run
        identify(nodeList);
        var map = mapHeadings(nodeList);
        console.log(map);

        build(map);
    };

    // Return Public API
    return Toc;
})();