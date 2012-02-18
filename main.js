$(function() {
    $examples = $('#examples')
    $examples.find('a').click(function() {
        var $a = $(this);
        $examples.children('li').removeClass('active');
        $a.parent().addClass('active');
        $.get($a.attr('href'), function(data) {
            $('textarea').val(data);
            $('button').click();
        });
        return false;
    });
    $examples.find('a:eq(0)').click();

    $('button').click(function() {
        var code = $('textarea').val(),
        b = lett.buildTree(code);
        console.log(b)

        $('#tree').empty();
        b.forEach(function(a) {
            $('#tree').append(print(a));
        })
    });

    function print(a) {   
        var $li, $ul2, t = '',
        $ul = $('<ul>');

        if (a.part) {
            if (a.type) t = ' (' + a.type + ') ';
            $li = $('<li>').text(t + a.part);
            $ul.append($li);
        }
        if (a.args) {
            $li = $('<li>').text('(args)');
            $ul2 = $('<ul>');
            $.each(a.args, function(i, arg) {
                $ul2.append(print(arg));
            });
            $ul.append($li.append($ul2));
        }
        if (a.children) {
            $li = $('<li>').text('(' + a.type + ')');
            $ul2 = $('<ul>');
            $.each(a.children, function(i, child) {
                $ul2.append(print(child));
            });
            $ul.append($li.append($ul2));
        }
        if (a.chain) {
            $li = $('<li>').text('(chain)');
            $ul2 = $('<ul>').append(print(a.chain));
            $ul.append($li.append($ul2));
        }
        return $ul;

        /*
        if (a.part) {
            if (a.type) t = ' (' + a.type + ')';
            $li = $('<li>').append(a.part + t);
            if (a.args) {
                a.args.forEach(function(arg) {
                    $ul.append(print(arg));
                });
                $li.append($ul);
            }
            if (a.chain) {
                $li.append(print(a.chain));
            }
            return $li;
        } else {
            a.children.forEach(function(c) {
                $ul.append(print(c));
            });
            t = '<li>Wrapper (' + a.type + ')';
            return $('<ul>').append(t).append($ul);
        }
        */
    }
});

