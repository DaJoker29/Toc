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
    
    /** @var {Object} Toc Exported Module */
    var Toc = {};

    /** @const {String} hTags CSS selector */
    var hTags = 'h1, h2, h3, h4, h5, h6';

    /**
     * Methods
     */
    
    /**
     * forEach() that works across Arrays, Objects and NodeLists
     * 
     * @method forEach
     * @author Chris Ferdinandi, http://github.com/cferdinandi/smooth-scroll
     * @license http://gomakethings.com/mit/ MIT License
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
    * @method generateID
    * @private
    * 
    * @return {String} Randomized alphanumeric string
    */
    var generateID = function () {
        return '_' + Math.random().toString(36).substr(2, 9);
    };
    
    /**
     * Checks all Heading Tags (h1-h6) for a unique ID.
     * If one doesn't exist, it creates one based.
     *
     * @method  checkID
     * @private
     * 
     * @param {NodeList} nodeList NodeList of the elements being checked for IDs
     */
    var checkID = function( nodeList ) {
        forEach(nodeList, function( element ) {
            element.id = element.id || generateID();
        });
    };

    /**
     * Builds a map of all headings with nesting
     *
     * @method map
     * @private
     * 
     * @param {Array} list Array of un-nested Heading Elements
     * @return {Array} An array representing all levels of headings with proper nesting
     */
    var map = function( list ) {
        var map = [];
        while(list.length && list.length > 0) {
            var item = mapItem (list);
            map.push( item );
        }

        return map;
    };

    /**
     * Build object for map function
     *
     * @method mapItem
     * @private
     * 
     * @param {Array} elements Heading nodes array
     * @return {Object} Properly configured object to populate mapping array
     */
    var mapItem = function( elements ) {
        var node = elements.shift();
        var item = {
            'id': node.id,
            'text': node.textContent,
            'children': []
        };

        while (elements[0] && level(node) < level(elements[0])) {
            item.children.push(mapItem( elements ));
        }

        return item;
    };

    /**
     * Returns the level of Heading tag
     *
     * @method  level
     * @private
     * 
     * @param {Node} node Object to return the level of
     * @return {Int} The level of heading (1-6)
     */
    var level = function( node ) {
        return Number.parseInt(node.tagName.slice(1));
    };

    /**
     * Convert NodeList to an Array
     *
     * @method node2Array
     * @private
     * 
     * @param {NodeList} nodeList NodeList to be converted
     * @return {Array} Converted nodelist array
     */
    var node2Array = function( nodeList ) {
        return Array.prototype.slice.call(nodeList);
    };

    /**
     * Build Table of Contents
     *
     * @method build
     * @private
     * 
     * @param  {Array} map Array with object representing all line items for table of contents
     */
    var build = function( map ) {
        var ul = document.createElement('ul');
        var nav = document.querySelector('nav');

        // Build List
        map.forEach(function( element ) {
            ul.appendChild(buildLi(element));
        });

        // Add to the DOM
        nav.appendChild(ul);
    };

    /**
     * Create LI element and UL with children
     *
     * @method buildLi
     * @private
     * 
     * @param  {Object} element Information used to build LI and UL elements
     * @return {Node} LI (and UL with children)
     */
    var buildLi = function( element ) {
        var fragment = document.createDocumentFragment();

        // Build A (link tag)
        var a = document.createElement('a');
        a.href = '#' + element.id;
        a.textContent = element.text;

        // Build LI (list tag)
        var li = document.createElement('li');
        li.appendChild(a);

        // Add LI to fragment
        fragment.appendChild(li);

        // Build Children, if present
        if( element.children.length > 0 ) {
            var ul = document.createElement('ul');
            element.children.forEach(function( el, index, array ) {
                ul.appendChild(buildLi(el));
            });
            fragment.appendChild(ul);
        }

        return fragment;
    };

    /**
     * Initialize and execute module
     *
     * @method run
     * @public
     */
    Toc.run = function() {
        // Add Ids
        var nodeList = document.querySelectorAll(hTags);
        checkID(nodeList);
        
        // Build Tasks
        build(map(node2Array(nodeList)));
    };

    /** @exports Toc */
    return Toc;
})();