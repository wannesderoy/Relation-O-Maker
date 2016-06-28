<?php
/**
 * @file
 * Definition of views_bootstrap_plugin_style.
 */

/**
 * Class to define a style plugin handler.
 */
class RelationOMakerGridPluginStyle extends views_plugin_style {
  /**
   * Definition.
   */
  public function option_definition() {
    $options = parent::option_definition();
    $options['alignment'] = array('default' => 'horizontal');
    $options['columns_lg'] = array('default' => 2);
    $options['columns_md'] = array('default' => 2);
    $options['columns_sm'] = array('default' => 0);
    $options['columns_xs'] = array('default' => 0);
    $options['key'] = array('default' => '82');
    $options['extra_classes'] = '';
    return $options;
  }

  /**
   * Form.
   */
  function options_form(&$form, &$form_state) {
    parent::options_form($form, $form_state);

    $form['alignment'] = array(
      '#type' => 'radios',
      '#title' => t('Alignment'),
      '#options' => array(
        'horizontal' => t('Horizontal'),
        'vertical' => t('Vertical'),
      ),
      '#description' => t('Horizontal alignment will place items starting in the upper left and moving right.
      Vertical alignment will place items starting in the upper left and moving down.'),
      '#default_value' => $this->options['alignment'],
    );

    $form['extra_classes'] = array(
      '#type' => 'textfield',
      '#title' => t('Extra classes on the wrapper'),
      '#required' => FALSE,
      '#default_value' => $this->options['extra_classes'],
    );

    // xs (phones), sm (tablets), md (desktops), and lg (larger desktops).

    $options = array(
      '' => '--',
      1 => 1,
      2 => 2,
      3 => 3,
      4 => 4,
      6 => 6,
      12 => 12,
    );

    $form['columns_lg'] = array(
      '#type' => 'select',
      '#title' => t('Number of columns for larger desktops (col-lg)'),
      '#options' => $options,
      '#required' => TRUE,
      '#default_value' => $this->options['columns_lg'],
    );

    $form['columns_md'] = array(
      '#type' => 'select',
      '#title' => t('Number of columns for desktops (col-md)'),
      '#options' => $options,
      '#required' => FALSE,
      '#default_value' => $this->options['columns_md'],
    );

    $form['columns_sm'] = array(
      '#type' => 'select',
      '#title' => t('Number of columns for tablets (col-sm)'),
      '#options' => $options,
      '#required' => FALSE,
      '#default_value' => $this->options['columns_sm'],
    );

    $form['columns_xs'] = array(
      '#type' => 'select',
      '#title' => t('Number of columns for phones (col-xs)'),
      '#options' => $options,
      '#required' => FALSE,
      '#default_value' => $this->options['columns_xs'],
    );


    $keys = array();
    foreach (range('a', 'z') as $letter) {
      $keys[] = $letter;
    }

    $codes = array();
    foreach (range(65, 90) as $num) {
      $codes[] = $num;
    }

    $options = array();
    foreach ($keys as $key => $value) {
      $options[$codes[$key]] = $value . ' (' . $codes[$key] . ')';
    }

    $default_value = array('default' => $this->options['key']);

    $form['key'] = array(
      '#type' => 'select',
      '#title' => t('Provide the key to use on the admin page as selector (now set to: ' . $this->options['key'] . ').'),
      '#options' => $options,
      '#default_value' => $default_value,
    );

  }

}