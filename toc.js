/**
 * @author Dewitt A Buckingham III
 * @copyright Zero Daedalus 2015
 * @fileOverview Builds a Table of Contents based on h1-h6 heading tags
 * @license http://www.gnu.org/licenses/gpl-2.0.html GPLv2
 * @module  Toc
 */
var Toc = (function() {

    /**
     * Variables
     */
    
    /** @var {Object} Toc Public APIs */
    var Toc = {};

    /** @const {String} headings CSS selector to find all heading tags */
    var headings = 'h1, h2, h3, h4, h5, h6';

    /**
     * Methods
     */
    
    /**
     * Borrowed forEach() that works across Arrays, Objects and NodeLists
     * 
     * @method forEach
     * @author Chris Ferdinandi, http://github.com/cferdinandi/smooth-scroll
     * @license http://gomakethings.com/mit/ MIT License
     * @private
     *
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
    * @method generateID
    * @return {String} Randomized alphanumeric string
    * @private
    */
    var generateID = function () {
        return '_' + Math.random().toString(36).substr(2, 9);
    };
    
    /**
     * Checks all Heading Tags (h1-h6) for a unique ID.
     * If one doesn't exist, it creates one based.
     *
     * @method  buildIds
     * @private
     * @param {NodeList} nodeList NodeList of the elements being checked for IDs
     */
    var buildIds = function( nodeList ) {
        forEach(nodeList, function( element ) {
            element.id = element.id || generateID();
        });
    };

    /**
     * Builds a map of all headings with nesting
     *
     * @method mapHeadings
     * @private
     * @param {NodeList} nodeList NodeList of Heading Elements
     * @return {Array} An array representing all levels of headings with proper nesting
     */
    var mapHeadings = function( nodeList ) {
        var list = nodeToArray(nodeList);
        var map = [];
        var i = list.length - 1;
        while(i > 0 && list.length) {
            var item = buildItem (list);
            map.push( item );
            i = list.length - 1;
        }

        // list.forEach(function( value, index, array ) {
        //     map.push( buildItem( array ) );
        // });

        return map;
    };

    /**
     * Build Map Item
     *
     * @method buildItem
     * @param {Array} array Heading nodes array
     * @return {Obj} Properly configured object to populate mapping array
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
     *
     * @method  level
     * @param {Node|Object} node Object to return the level of
     * @return {Int} The level of heading (1-6)
     */
    var level = function( node ) {
        return Number.parseInt(node.tagName.slice(1));
    };

    /**
     * Convert NodeList to an Array
     *
     * @method nodeToArray
     * @param {NodeList} nodeList NodeList to be converted
     * @return {Array} Converted nodelist array
     */
    var nodeToArray = function( nodeList ) {
        return Array.prototype.slice.call(nodeList);
    };

    // Build Navigation Element
    var build = function( map ) {
    };

    // var ulItem = function (obj) {
    //     var ul = document.createElement('ul');
    //     ul.appendChild(listItem(obj));

    //     return ul;
    // };

    // var listItem = function( obj ) {
    //     var a = document.createElement('a');
    //     var li = document.createElement('li');

    //     a.href = '#' + obj.id;
    //     a.textContent = obj.text;

    //     li.appendChild(a);

    //     return li;
    // };

    /**
     * Initialize and execute module
     *
     * @public
     * @method run
     */
    Toc.run = function() {
        var nodeList = document.querySelectorAll(headings);

        // Run
        buildIds(nodeList);
        var map = mapHeadings(nodeList);
        console.log('Map: ', map);

        build(map);
    };

    /** @exports Toc */
    return Toc;
})();