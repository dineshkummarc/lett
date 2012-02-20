if (typeof require !== 'undefined') corelib = require('./corelib.js');
if (typeof require !== 'undefined') parser = require('./parser.js');

var lett = (function() {
    // Evaluate the code
    function letteval(node, obj) {
        var o = {};
        if (node) {
            if (node.type === 'obj') {
                node.children.forEach(function(c) {
                    if (c.length === 2) {
                        o[c[0]] = letteval(c[1], obj);
                    } else {
                        letteval(c, obj);
                    }
                });
                return o;
            }
            if (node.type === 'str') return node.val;
            if (node.type === 'call') return call(node, obj);
            return parseInt(node.val, 10);
        }
    }

    function getReference(name, obj) {
        var r;
        name.split(/\./).forEach(function(name) {
            r = r && r[name];
            if (!r) r = this[name];
        });
        return r;
    }

    function call(node, obj) {
        var fn = getReference(node.val, obj),
        args = node.children.map(function(n) {
            return getReference(n.val, obj);
        });
        console.log(fn, args);
    }

    function build(code) {
        var tree = parser.parse(code);
        return tree;
    }

    return {
        build: build
    };
})();

if (typeof module !== 'undefined') module.exports = lett.build;

