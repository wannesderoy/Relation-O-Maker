<?php
/**
 * @file
 * Provide views data and handlers.
 */

/**
 * Implements hook_views_plugins().
 */
function relation_o_maker_views_plugins() {
  $module_path = drupal_get_path('module', 'relation_o_maker');

  return array(
    'style' => array(
      'relation_o_maker' => array(
        'title' => t('Relation-O-Maker'),
        'help' => t('relation_o_maker : Bootstrap Grid Style'),
        'path' => $module_path . '/views',
        'handler' => 'RelationOMakerGridPluginStyle',
        'parent' => 'default',
        'theme' => 'relation_o_maker_grid_plugin_style',
        'theme path' => $module_path . '/views',
        'theme file' => 'theme.inc',
        'uses row plugin' => TRUE,
        'uses grouping' => FALSE,
        'uses options' => TRUE,
        'type' => 'normal',
      ),
    ),
  );
}
