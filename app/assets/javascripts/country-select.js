$(window).on('load', function() {
  const $select = $('select.gysp-autocomplete');
  $select.selectToAutocomplete();
  // Update id's for accessibility
  const id = $select.attr('id');
  const $input = $('.ui-autocomplete-input');
  $select.attr('id', id + 'select');
  $input.attr('id', id);
});
