define(['lodash', 'jquery'], function(_, $) {
    function minesView(controller) {
        this.controller = controller;
    }

    minesView.prototype.render = function(startValue, endValue) {
        if (startValue <= endValue) {
            $('#mines-box').html('');

            var select = $('<select>');
            _.times((endValue - startValue + 1), function(numMines) {
                select.append('<option value="' + (numMines + startValue) + '">' + (numMines + startValue) + '</option>');
            });

            $('#mines-box').append(select);
            this.controller.updateMinesMultiplier(); // set default value;
            this.enableMinesSelect();
        }
    }

    minesView.prototype.disableMinesSelect = function() {
        $('#mines-box select').attr("disabled", true);
        $('#mines-box select').unbind('change');
    }

    minesView.prototype.enableMinesSelect = function() {
        var that = this;

        $('#mines-box select').attr("disabled", false);
        $('#mines-box select').bind('change', function() {
            that.controller.updateMinesMultiplier();
        });
    }

    minesView.prototype.getSelectedMinesNumber = function() {
        return $('#mines-box select').val();
    }

    minesView.prototype.updateMultiplierValue = function(newValue) {
        $('#mines-multiplier-value').html(newValue);

    }

    return minesView;

});