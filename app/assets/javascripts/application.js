function ShowHideContent() {
  var self = this;


  self.escapeElementName = function(str) {
    var result = str.replace('[', '\\[').replace(']', '\\]')
    return(result);
  };
  self.showHideToggledContent = function () {

    $('.toggle-content').each(function () {

      var $button = $(this);

      var $dataTarget = $button.attr('data-target');

      // Add ARIA attributes

      // If the data-target attribute is defined
      if (typeof $dataTarget !== 'undefined' && $dataTarget !== false) {

        // Set aria-controls
        $button.attr('aria-controls', $dataTarget);

        // Set aria-expanded and aria-hidden
        $button.attr('aria-expanded', 'false');
        $('#' + $dataTarget).attr('aria-hidden', 'true');

        // For checkboxes revealing hidden content
        $button.on('click', function () {
          var state = $(this).attr('aria-expanded') === 'false' ? true : false;

          // Toggle hidden content
          $('#' + $dataTarget).toggle();

          // Update aria-expanded and aria-hidden attributes
          $(this).attr('aria-expanded', state);
          $('#' + $dataTarget).attr('aria-hidden', !state);
        });
      }
    });
  }
}

$(document).ready(function() {

  // Turn off jQuery animation
  jQuery.fx.off = true;

  // Where .block-label uses the data-target attribute
  // to toggle hidden content
  var toggleContent = new ShowHideContent();
  toggleContent.showHideToggledContent();
});

$(window).on('load', function (e) {
  $('#form__claim-information').on('submit', function(event) {
    var $form = $(this);

    setTimeout(function() {
      // Reset values
      $form.find('input[type=number]').val('');
      $form.find('input[type=radio]').prop('checked', false);
      // Remove any errors
      $form.parent().find('.govuk-error-summary').remove();
      $form.find('.govuk-error-message').remove();
      $form.find('.govuk-form-group').removeClass('govuk-form-group--error');

      $form.find('label').removeClass('selected');
      $form.find('input[type=submit]').prop('disabled', false);
    }, 500);
  });

  $('#nino').autotab('filter', { format: 'alphanumeric', uppercase: true });

  $('#postcode, #postCode').autotab('filter', { uppercase: true });

  $('#dob-day').autotab({format: 'numeric', target: '#dob-month'});
  $('#dob-month').autotab({format: 'numeric', target: '#dob-year'});

  $('#fromDate-day').autotab({format: 'numeric', target: '#fromDate-month'});
  $('#fromDate-month').autotab({format: 'numeric', target: '#fromDate-year'});

  $('#toDate-day').autotab({format: 'numeric', target: '#toDate-month'});
  $('#toDate-month').autotab({format: 'numeric', target: '#toDate-year'});
});

accessibleAutocomplete.enhanceSelectElement({
  selectElement: document.querySelector('.gysp-autocomplete'),
  autoselect: false,
  defaultValue: '',
  displayMenu: 'overlay',
  minLength: 2
});
