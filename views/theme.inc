<?php

/**
 * Implementation of template preprocess for the view.
 */
function template_preprocess_relation_o_maker_grid_plugin_style(&$vars) {
    $view = $vars['view'];

    $nids = array();
    foreach($view->result as $item) {
        $nids[] = $item->nid;
    }
    $vars['nids'] = $nids;

    $options = $view->style_plugin->options;
    $form = array();

    // Add module's JavaScript and CSS
    $views_page = views_get_page_view();
    // Check if the views page is not the view edit page through the views obj.
    if (is_object($views_page)) {
        // Only add the js if it's the views page, not the views edit page.
        drupal_add_js(drupal_get_path('module', 'relation_o_maker') . '/js/relation_o_maker.js', array(
            'every_page' => FALSE,
            'scope' => 'footer',
            'weight' => 5,
            'cache' => TRUE
        ));
        drupal_add_js(drupal_get_path('module', 'relation_o_maker') . '/js/jquery.equalheights.js', array(
            'every_page' => FALSE,
            'scope' => 'footer',
            'weight' => 5,
            'cache' => TRUE
        ));
    }
    drupal_add_css(drupal_get_path('module', 'relation_o_maker') . '/css/relation_o_maker.css');

    // Add settings for javascript.
    global $language;
    // Construct the full path for correct ajax post.
    $url = $GLOBALS['base_url'] . '/' . $language->prefix . '/';
    drupal_add_js(array(
        'relation_o_maker' => array(
            'key' => $options['key'],
            'modulePath' => drupal_get_path('module', 'relation_o_maker'),
            'base_url' => $url,
        ),
    ), 'setting');

    $horizontal = ($options['alignment'] === 'horizontal');

    $colums = array();
    $columns['lg'] = 12 / $options['columns_lg'];

    if ($options['columns_md']) {
        $columns['md'] = 12 / $options['columns_md'];
    }

    if ($options['columns_sm']) {
        $columns['sm'] = 12 / $options['columns_sm'];
    }

    if ($options['columns_xs']) {
        $columns['xs'] = 12 / $options['columns_xs'];
    }

    // Split items by rows and columns.
    $vars['items'] = _relation_o_maker_split_rows($vars, $options['columns_lg'], $horizontal);
    $vars['column_types'] = $columns;

    if ($options['extra_classes']) {
        $vars['extra_classes'] = $options['extra_classes'];
    }

    // Construct form elements to add to tpl $vars.
    $form['general'] = array(
        '#type' => 'fieldset',
        '#title' => t('Relation-O-Maker'),
    );

    $form['general']['term-name'] = array(
        '#type' => 'textfield',
        '#title' => t('Create new term name'),
        '#attributes' => array(
            'id' => array('relation-o-maker-new-term-name')
        )
    );

    $voc = taxonomy_vocabulary_machine_name_load('relation_o_maker');
    $terms = taxonomy_get_tree($voc->vid);

    foreach ($terms as $term) {
        $terms_options[$term->tid] = $term->name;
    }
    // Check for empty $terms_options, indicates there are no terms in this voc.
    if (isset($terms_options)) {
        // Add empty option to select options array.
        $terms_options = array('' => '--') + $terms_options;

        $form['general']['terms'] = array(
            '#type' => 'select',
            '#title' => t('Add to existing term.'),
            '#options' => $terms_options,
            '#attributes' => array(
                'id' => array('relation-o-maker-existing-term-name')
            )
        );

    }

    $form['general']['relation-o-maker-submit'] = array(
        '#type' => 'button',
        '#value' => 'Submit',
        '#title' => t('Term name'),
        '#attributes' => array(
            'id' => array('relation-o-maker-submit')
        )
    );

    $form['general']['relation-o-maker-reset'] = array(
        '#type' => 'button',
        '#value' => 'Reset',
        '#title' => t('Term name'),
        '#attributes' => array(
            'id' => array('relation-o-maker-reset')
        )
    );

    $form['general']['relation-o-maker-select-all'] = array(
        '#type' => 'button',
        '#value' => 'Select all',
        '#title' => t('Select all'),
        '#attributes' => array(
            'id' => array('relation-o-maker-select-all')
        )
    );

    $vars['form'] = drupal_render($form);

}
