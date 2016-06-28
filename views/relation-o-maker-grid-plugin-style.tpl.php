<?php
/**
 * @file views-bootstrap-grid-plugin-style.tpl.php
 * Default simple view template to display Bootstrap Grids.
 *
 *
 * - $columns contains rows grouped by columns.
 * - $rows contains a nested array of rows. Each row contains an array of
 *   columns.
 * - $column_type contains a number (default Bootstrap grid system column type).
 *
 * @ingroup views_templates
 */

$col_classes = 'col ';
foreach ($column_types as $grid_key => $grid) {
    $col_classes .= ' col-' . $grid_key . '-' . $grid;
}

// extra classes can be added as an option
if (isset($extra_classes)) {
    $col_classes .= ' ' . $extra_classes;
}

?>

<div id="views-bootstrap-grid-<?php print $id ?>"
     class="<?php print $classes ?>">

    <div class="container-fluid">

        <div class="col-md-12">

            <div class="row">
                <div class="col-md-12">
                    <?php print $form; ?>
                </div>
                <div class="col-md-12">
                    <div class="console-wrapper"></div>
                </div>
            </div>

            <div class="row relation-o-maker-wrapper">
                <?php foreach ($items as $row): ?>
                    <?php foreach ($row['content'] as $column): ?>
                        <div class="<?php print $col_classes ?> relation-o-maker-item">
                            <?php print $column['content'] ?>
                        </div>
                    <?php endforeach ?>
                <?php endforeach ?>
            </div>

        </div>

    </div>

</div>
