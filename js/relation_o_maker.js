/**
 * @file
 * Relation-O-Maker js
 *
 * Press the given key for recording the clicks and building a set of node ids.
 * When 'key' is released that set of node ids is added to a collection of sets.
 * On submit, the collection is send to drupal where based on the sets of ids the necessary
 * terms are created and added to the nodes.
 *
 * TODO: don't register any key events when focus is on a textfield.
 * - temp fix: disabled the alert message for this validation problem.
 *
 */

(function($) {

    var rom = {},
        down = {}, // Temp. storage for key events.
        set = [], // A set of nids.
        termName = [], // A set of termNames.
        termStatus = [], // A set to indicate if the them is new or old.
        time = [], // A set of timestamps.
        collection = [], // A collection of sets.
        keyDown = false, // Default to up | not pushed down.
        ajaxBussy = false, // Default to not bussy.
        debug = true,
        active_class = 'selected';

    // Element selectors
    var new_term = '#relation-o-maker-new-term-name',
        existing_term = '#relation-o-maker-existing-term-name',
        rom_item = '.relation-o-maker-item',
        rom_item_image = '.relation-o-maker-image',
        rom_submit = '#relation-o-maker-submit',
        rom_reset = '#relation-o-maker-reset',
        rom_select_all = '#relation-o-maker-select-all';

    Drupal.relation_o_maker = {

        timeStamp : function() {
            return Date.now() / 1000 | 0;
        },

        buildSet : function(item) {
            // Add the current clicked nid to the current set.
            set.push(item.data('nid'));
            // Log.
            rom.log(item.data('nid'));
        },

        buildCollection : function(set) {
            // Add the newly created set to the collection of sets.
            collection.push(set);
            // Add the current timestamp to the set timestamps.
            time.push(Drupal.relation_o_maker.timeStamp());

            // Add the currently filled in or existing term name to the set of termName.
            if ($('#relation-o-maker-new-term-name').val() != '') {
                termName.push($('#relation-o-maker-new-term-name').val());
                termStatus.push('new');
            }
            else if ($('#relation-o-maker-existing-term-name').length != 0) {
                if ($('#relation-o-maker-existing-term-name').val() != '') {
                    termName.push($('#relation-o-maker-existing-term-name').val());
                    termStatus.push('old');
                }
                else {
                    termName.push('');
                    termStatus.push('new');
                }
            }
            else {
                termName.push('');
                termStatus.push('new');
            }

            // Log
            // rom.log('collection', collection);
            // rom.log(time);
            // rom.log('termName', termName);
            // rom.log('termStatus', termStatus);

        },

        resetAll : function() {
            // Reset the grid by deleting the selected classes ...
            $(rom_item, rom_item_image).removeClass(active_class);
            // Reset term-name field to empty
            $(new_term).val('');
            // And reseting al the vars to their defaults empty.
            var down = {};
            var nodes = [];
            var time = [];
            var sets = [];
            var termName = [];
            var term = '';
            var keyDown = false;
        },

        resetSet : function() {
            set = [];
            $(new_term, existing_term).val('');
            // $('#relation-o-maker-existing-term-name').val('');
            $(rom_item, rom_item_image).removeClass('selected');
            // $(rom_item_image).removeClass('selected');
        },

        ajaxIsBussy : function() {
            var ajaxBussy = true;
            $('.relation-o-maker-wrapper').fadeTo("fast", 0.33);
            //$('.relation-o-maker-wrapper a').on('click', function(e) {
            //    e.preventDefault();
            //});
            $('.form-submit').attr('disabled','disabled');
            Drupal.relation_o_maker.showSpinner('.relation-o-maker-wrapper');
        },

         ajaxIsDone : function() {
            $('.relation-o-maker-wrapper').fadeTo("fast", 1);
            $('#rom-throbber').remove();
            $('.form-submit').removeAttr('disabled');
            var ajaxBussy = false;
        },

        sendToDrupal : function(data, termName, time, term) {
            // Send the data to Drupal.
            $.ajax({
                method: "POST",
                url : Drupal.settings.relation_o_maker.base_url + 'ajax/relation-o-maker/upload',
                data: {
                    nids :      data,
                    timestamp : time,
                    termName :  termName,
                    term :      term
                },
                beforeSend : function() {
                    Drupal.relation_o_maker.ajaxIsBussy();
                }
            })
            .always(function() {
                rom.log('received');
            })
            .fail(function(data, textStatus, errorThrown) {
                Drupal.relation_o_maker.printAlert('Something went horrobly wrong, try again later.', 'error');
                Drupal.relation_o_maker.ajaxIsDone();
            })
            .done(function(data, textStatus) {
                data = $.parseJSON(data);
                if (data.status[0] == false) {
                    Drupal.relation_o_maker.ajaxIsDone();
                    // Display confirmation message.
                    Drupal.relation_o_maker.printAlert(data.message, 'error');
                    // rom.log(data.message);
                    // rom.log(data.status);
                }
                else if (data.status[0] == true) {
                    Drupal.relation_o_maker.ajaxIsDone();
                    // Display confirmation message.
                    Drupal.relation_o_maker.printAlert(data.message, 'status');
                    // rom.log(data.message);
                    // rom.log(data.status);
                }
            });

            // After post, reset the vars & views grid.
            Drupal.relation_o_maker.resetAll();
        },

        printAlert : function(msg, status) {
            var markup = '\
                <div id="console" class="clearfix">\
                    <div class="messages ' + status + '">\
                        <h2 class="element-invisible">\
                            Status message\
                        </h2>\
                        ' + msg + '\
                    </div>\
                </div>';
            $('.console-wrapper').prepend(markup);
        },

        showSpinner : function(location) {
            var markup = '\
                <div id="rom-throbber">\
                        <img src="/' + Drupal.settings.relation_o_maker.modulePath + '/img/throbber.gif"/>\
                </div>\
            ';
            $(location).before(markup);
            $('#rom-throbber').css({
                'position': 'fixed',
                'margin': '50',
                'z-index': '9999999',
                'width': '100%',
                'text-align': 'center',
                'right': '20px',
                'top': '185px'
            });
        }

    }

    /**
     * Drupal Behaviors
     *
     * NICE TO HAVES: Store all sets & collections in local browser storage instead of js vars.
     *      - Collections are saved and displayed in panel of some sort
     *      - Everything is saved accross different pages
     *      - Make all jquery selectors dynamic, or from variable
     *      -
     */
    Drupal.behaviors.relation_o_maker = {

        attach : function (context, settings) {

            // Settings from Drupal.
            var k = Drupal.settings.relation_o_maker.key;

            /*
             * Handle click on an item.
             * Add nid to temporary set, for local storage
             * If the item was already added, remove it
             * If no key was pressed, show an error message
             */
            $(rom_item, context).on('click', function() {
                // inArray returns -1 if not fount, if found the array position of the found element.
                // var i = $.inArray($(this).data('nid'), set);
                var nid = $(this).find(rom_item_image).data('nid');
                var i = $.inArray(nid, set);

                if (ajaxBussy === false) {
                    if (i > -1) {
                        // Remove clicked item from node set, if it was already in the set.
                        set.splice(i, 1);
                        $($(this)).removeClass(active_class);
                        // rom.log('removed: ', nid);
                    }
                    else if (keyDown !== true) {
                        // If item was clicked but no key was down.
                        Drupal.relation_o_maker.printAlert('No key pressed, please do so', "error");
                    }
                    else {
                        // If validation passes, add the clicked item to the node set.
                        Drupal.relation_o_maker.buildSet($(this).find(rom_item_image));
                        // Add a class to highlight the selected items.
                        $(this).addClass(active_class);
                    }
                }

            });

            // Handle submit.
            $(rom_submit, context).on('click submit', function(e) {
                e.preventDefault();
                // Check sets lenght to see if no empty sets are send to drupal.
                if (collection.length !== 0) {
                    // Send all the data to drupal.
                    Drupal.relation_o_maker.sendToDrupal(collection, termName, time, termStatus);
                }
                else {
                    Drupal.relation_o_maker.printAlert('Cannot send empty set', "error");
                }
            });

            // Handle reset.
            $(rom_reset, context).on('click submit', function(e) {
                e.preventDefault();
                Drupal.relation_o_maker.resetAll();
            });

            // Handle select all, mostly for testing purpusses.
            $(rom_select_all, context).on('click submit', function(e) {

                $(rom_item).addClass(active_class);

                $(rom_item_image).each(function() {
                    Drupal.relation_o_maker.buildSet($(this));
                });

                Drupal.relation_o_maker.buildCollection(set);
                Drupal.relation_o_maker.resetSet();

            });

            // Handle key down event
            $(document, context).on("keydown", function(e) {
                var keycode = (e.keyCode ? e.keyCode : e.which);
                if (keycode == k) {
                    if (down[k] == null) {
                        down[k] = true;
                        keyDown = true;
                    }
                }
            });

            // Handle keyup event
            $(document, context).on("keyup", function(e) {
                var keycode = (e.keyCode ? e.keyCode : e.which);
                if (keycode == k) {
                    down[keycode] = null;
                    keyDown = false;
                    // Check if node set is larger than one item
                    if (set.length <= 1) {
                        // Don't reset anything, so a user can continue with the one item they clicked
                        // Drupal.relation_o_maker.printAlert('Node set must contain more than one item.', 'error');
                    }
                    else {
                        Drupal.relation_o_maker.buildCollection(set); // Add the set of nids to the current collection
                        set = []; // Reset the temporary nid set
                        $(new_term, existing_term).val(''); // Reset the termName field to empty.
                        $(rom_item, rom_item_image).removeClass('selected'); // reset classes
                    }
                }
            });

        }
    };

    Drupal.relation_o_maker_eqh = {
        delay : (function() {
            var timer = 0;
            return function(callback, ms){
                clearTimeout (timer);
                timer = setTimeout(callback, ms);
            };
        })()
    }

    Drupal.behaviors.relation_o_maker_eqh = {
        attach : function(context, settings) {
            var $w = $(window);
            var onResize = function() {
                Drupal.relation_o_maker_eqh.delay(function() {
                    $(rom_item).equalHeights();
                }, 10);
            }
            // on page load
            $w.load(onResize);
            // on page resize
            $w.resize(onResize);
        }
    };

    // Logs a message to the console (only when debug var is true)
    rom.log = function(message, type) {
        if (typeof console !== 'undefined') {
            if (!type) {
                type = (message instanceof Error) ? 'error' : 'debug';
            }

            if (type === 'error') {
                if (typeof console.error !== 'undefined') {
                    console.error(message);
                } else if (typeof console.log !== 'undefined') {
                    console.log(message);
                }
            } else if (debug) {
                if (typeof console.log !== 'undefined') {
                    console.log(message);
                }
            }
        }
    };

})(jQuery);