/**
 * Equal Heights Plugin
 * Equalize the heights of elements. Great for columns or any elements
 * that need to be the same size (floats, etc).
 *
 * Version 1.0
 * Updated 12/109/2008
 *
 * Copyright (c) 2008 Rob Glazebrook (cssnewbie.com)
 *
 * Usage: $(object).equalHeights([minHeight], [maxHeight]);
 *
 * Example 1: $(".cols").equalHeights(); Sets all columns to the same height.
 * Example 2: $(".cols").equalHeights(400); Sets all cols to at least 400px tall.
 * Example 3: $(".cols").equalHeights(100,300); Cols are at least 100 but no more
 * than 300 pixels tall. Elements with too much content will gain a scrollbar.
 *
 * Example 4: $(".cols").equalHeightsRows(); Sets all columns on the same row to
 * the same height.
 *
 */

(function($) {
  $.fn.equalHeights = function(box, minHeight, maxHeight) {
    if (this.length) {

      /* reset heights */
      this.each(function() {
        $(this).css('height','auto');
      });

      /* calculate tallest */
      tallest = (minHeight) ? minHeight : 0;
      this.each(function() {
        if($(this).height() > tallest) {
          if (box == true) {
            var paddingTop = parseInt($(this).css('padding-top'));
            var paddingBottom = parseInt($(this).css('padding-bottom'));
            tallest = $(this).height() + paddingTop + paddingBottom;
          } else {
            tallest = $(this).height();
          }
        }
      });
      if((maxHeight) && tallest > maxHeight) tallest = maxHeight;

      /* adjust heights */
      return this.each(function() {
        $(this).height(tallest);
      });

    }
  };

  $.fn.equalHeightsRows = function(box) {
    if (this.length) {

      /* reset heights */
      this.each(function() {
        $(this).css('height','auto');
      });

      var currentTallest = 0;
      var currentRowStart = 0;
      var rowDivs = new Array();
      var topPosition = 0;

      this.each(function() {
        topPosition = $(this).position().top;
        if (currentRowStart != topPosition) {
          // we just came to a new row.  Set all the heights on the completed row
          for (currentDiv = 0 ; currentDiv < rowDivs.length ; currentDiv++) {
            rowDivs[currentDiv].height(currentTallest);
          }
          // set the variables for the new row
          rowDivs.length = 0; // empty the array
          currentRowStart = topPosition;
          if (box == true) {
            var paddingTop = parseInt($(this).css('padding-top'));
            var paddingBottom = parseInt($(this).css('padding-bottom'));
            currentTallest = $(this).height() + paddingTop + paddingBottom;
          } else {
            currentTallest = $(this).height();
          }
          rowDivs.push($(this));
        } else {
          // another div on the current row.  Add it to the list and check if it's taller
          rowDivs.push($(this));
          currentTallest = (currentTallest < $(this).height()) ? ($(this).height()) : (currentTallest);
          if (box == true) {
            var paddingTop = parseInt($(this).css('padding-top'));
            var paddingBottom = parseInt($(this).css('padding-bottom'));
            currentTallest = currentTallest + paddingTop + paddingBottom;
          }
        }

        // do the last row
        for (currentDiv = 0 ; currentDiv < rowDivs.length ; currentDiv++) {
          rowDivs[currentDiv].height(currentTallest);
        }
      });
    }
  };

  $.fn.removeEqualHeights = function() {
    if (this.length) {

      /* reset heights */
      return this.each(function() {
        $(this).css('height','auto');
      });
    }
  };

})(jQuery);
