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
            $('#parse').click();
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

    $('#parse').click(function() {
        var b, code = $.makeArray($code.find('span').map(function() {
            return $(this).text();
        })).join('\n');

        b = lett.build(code);

        $('#tree').empty().append(print(b));
    });

    function print(a) {
        var $ul, t = a.type ? ' (' + a.type + ')': '',
        $li = $('<li>').text((a.val || '') + t);

        if (a.vars) {
            $li.append($('<span>').text(' vars:'));
            $ul = $('<ul>');
            $.each(a.vars, function(i, a) {
                $ul.append($('<li>').append(a.val));
            });
            $li.append($ul);
        }
        if (a.children) {
            $li.append($('<span>').text(' body:'));
            $ul = $('<ul>');
            $.each(a.children, function(i, a) {
                if (a.length === 2) {
                    $ul.append($('<li>').append($('<span>').text(a[0] + ' = ')).append(print(a[1])));
                } else {
                    $ul.append($('<li>').append(print(a)));
                }
            });
            $li.append($ul);
        }
        if (a.chain) {
            $ul = $('<ul>').append(print(a.chain));
            $li.append($ul);
        }

        return $li;
    }
});

