define(['lodash', 'jquery'], function(_, $) {
    function multipierView() {}

    multipierView.prototype.update = function(arrayOfValues, userCashAmount) {
        if (_.isArray(arrayOfValues)) {
            $('#multipiers-box').html('');

            var select = $('<select>');
            _.each(arrayOfValues, function(multipier) {
                if (multipier <= userCashAmount) {
                    select.append('<option value="' + multipier + '">' + multipier + '</option>');
                }
            });

            $('#multipiers-box').append(select);

        } else {
            console.error('MultipierView only can be updated by array.');
        }
    }

    multipierView.prototype.getBet = function() {
        return $('#multipiers-box select').val();
    }

    multipierView.prototype.disable = function() {
        $('#multipiers-box select').attr('disabled', true);
    }


    multipierView.prototype.enable = function() {
        $('#multipiers-box select').attr('disabled', false);
    }

    return multipierView;
});