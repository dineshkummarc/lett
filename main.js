/*
if (!console) console = {};
var $result, hack = console.log;
console.log = function() {
    hack.apply(console, arguments);
    $result.text($result.text() + arguments[0]);
};
*/

$(function() {
    var $examples = $('#examples'),
    $code = $('ol');

    $result = $('#result');

    $examples.find('a').click(function() {
        var $a = $(this);
        $examples.children('li').removeClass('active');
        $a.parent().addClass('active');
        $.get($a.attr('href'), function(data) {
            $code.text('');
            $.each(data.split(/\n/), function(i, d) {
                $code.append($('<li>').text(d));
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
        var b, code = $.makeArray($code.find('li').map(function() {
            return $(this).text();
        })).join('\n');

        $result.text('');

        b = lett(code);

        $result.text($result.text() + b);
    });
});

