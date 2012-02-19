$(function() {
    var $examples = $('#examples'),
    $code = $('ol');

    $examples.find('a').click(function() {
        var $a = $(this);
        $examples.children('li').removeClass('active');
        $a.parent().addClass('active');
        $.get($a.attr('href'), function(data) {
            $code.text('');
            $.each(data.split(/\n/), function(i, d) {
                $code.append($('<li>').append($('<span>').addClass('pln').text(d)));
            });
            $('button').click();
        });
        location.hash = $a.text();
        return false;
    });

    if (location.hash.length > 0) {
        $examples.find('a').filter(function() {
            return $(this).text().indexOf(location.hash.slice(1)) >= 0;
        }).click();
    } else {
        $examples.find('a:eq(0)').click();
    }

    $('button').click(function() {
        var code = $code.text(),
        b = lett.buildTree(code);
        console.log(b);

        $('#tree').empty();
        b.forEach(function(a) {
            $('#tree').append(print(a));
        });
    });

    function print(a) {
        var $li, $ul2, t = '',
        $ul = $('<ul>'),
        addProp = function(name) {
            if (a[name]) {
                $li = $('<li>').text('(' + name + ')');
                $ul2 = $('<ul>');
                $.each(a[name], function(i, val) {
                    $ul2.append(print(val));
                });
                $ul.append($li.append($ul2));
            }
        };

        if (a.part) {
            if (a.type) t = ' (' + a.type + ') ';
            $li = $('<li>').text(t + a.part);
            $ul.append($li);
        }
        addProp('args');
        addProp('children');
        addProp('chain');
        return $ul;
    }
});

