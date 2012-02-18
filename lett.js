if (typeof require !== 'undefined') corelib = require('./corelib.js');

var lett = (function() {
    var fn, code, tmp, wraps = {
        '{': '}',
        '(': ')'
    },
    types = {
        '{': 'obj',
        '(': 'fn',
        '"': 'str',
        "'": 'str'
    };

    function buildTree(t, level) {
        var type, p, index, end, l, part = '',
        current = [],
        chain = [],
        addPart = function(type) {
            var tmp;
            part = part.slice(0, part.length - 1).trim();
            if (part.length > 0) {
                part = {
                    part: part,
                    type: types[type]
                };
                if (part.type === 'fn' && part.part) part.type = 'call';
                current.push(part);
                tmp = part;
                part = '';
                return tmp;
            }
        };
        level = level || 0;

        while ((index = code.search(/\{|\}|'|"|\(|\)| /)) >= 0) {
            part += code.slice(0, index + 1);
            l = code.charAt(index);
            code = code.slice(index + 1);

            if (!end) p = addPart(l);

            if (l.match(/'|"/)) {
                if (end && end === l) {
                    addPart(l);
                    end = false;
                } else if (!end) {
                    end = l;
                }
            } else if (l.match(/\{|\(/)) {
                if (p && p.type === 'call') {
                    p.args = buildTree(wraps[l], level + 1);
                    if (p.part.match(/^\./) && chain[level]) {
                        chain[level].chain = p;
                        current.splice(current.indexOf(p));
                    }
                    chain[level] = p;
                } else {
                    current.push({
                        children: buildTree(wraps[l], level + 1),
                        type: types[l]
                    });
                }
            } else if (l === t) {
                return current;
            }
        }
        return current;
    }

    function call(b, obj) {
        var f, name = b.part,
        args = b.args.map(function(c) {
            var o = obj;
            c.part && c.part.split('.').forEach(function(n) {
                if (o[n]) o = o[n];
            });
            if (o !== obj) return o();
            //return lettval(c, obj);
        });
        f = this;
        name.split('.').forEach(function(name) {
            f = f && f[name];
        });
        if (!f) f = corelib[name];

        if (!f && name.match(/^\./)) {
            f = fn[name.slice(1)];
            return function() {
                return fn = f && f.apply(fn, args);
            }
        } else {
            return function() {
                return fn = f && f.apply(null, args);
            }
        }
    }

    function defn(b, obj) {
        var i, calls, vars = [];
        b.children.some(function(c, j) {
            var k = typeof c.type === 'undefined';
            if (k) vars.push(c.part);
            i = j;
            return k;
        });
        calls = b.children.slice(i).filter(function(f) {
            return f.type === 'call';
        });
        return function() {
            var a = arguments,
            o = {};
            vars.forEach(function(v, i) {
                o[v] = a[i];
            });
            calls.slice(0, calls.length - 1).forEach(function(c) {
                call(c, o)();
            });
            return call(calls[calls.length - 1], o)();
        };
    }

    function lettval(b, obj) {
        var name, o, p, t, i = 0,
        fns;
        if (b.type === 'call') {
            return call(b, obj)();
        } else if (b.type === 'fn') {
            return defn(b, obj);
        } else if (b.type === 'str') {
            return '' + b.part;
        } else if (b.type === 'obj') {
            p = o = {};
            b.children.forEach(function(c) {
                if (c.type === 'call') {
                    fns = lettval(c, o);
                } else {
                    fns = false;
                    if (i % 2 === 0) {
                        name = c.part;
                    } else {
                        name = name.split('.');
                        name.slice(0, name.length - 1).forEach(function(name) {
                            o = o[name] = {};
                        });
                        o[name.pop()] = lettval(c, o);
                    }
                    i++;
                }
            });
            if (fns) return fns;
            return p;
        }

        t = obj;
        b.part.split('.').forEach(function(name) {
            if (t[name]) t = t[name];
        });

        return b.part;
    }

    function removeComments() {
        code = code.replace(/\/\/.*\n/g, '');
    }

    function build(c) {
        var tree, obj = {}
        code = c;
        removeComments();
        tree = {
            type: 'obj',
            children: buildTree()
        };
        return lettval(tree, obj);
    }

    return {
        build: build,
        buildTree: function(c) {
            code = c;
            removeComments();
            return buildTree();
        }
    };
})();

if (typeof module !== 'undefined') module.exports = lett.build;

