/**
 * Solaris Films - Admin Media Picker
 * Apre la Libreria Media WP al click del pulsante "Seleziona Immagine"
 */
jQuery(document).ready(function($) {
    var mediaFrame;

    $(document).on('click', '.solaris-media-btn', function(e) {
        e.preventDefault();

        var button = $(this);
        var targetInput = button.prev('input[type="url"], input[type="text"]');
        var preview = button.next('.solaris-media-preview');

        mediaFrame = wp.media({
            title: 'Seleziona Immagine',
            button: { text: 'Usa questa immagine' },
            multiple: false,
            library: { type: 'image' }
        });

        mediaFrame.on('select', function() {
            var attachment = mediaFrame.state().get('selection').first().toJSON();
            var url = attachment.url;
            // Use a medium/large size if available
            if (attachment.sizes && attachment.sizes.large) {
                url = attachment.sizes.large.url;
            } else if (attachment.sizes && attachment.sizes.medium_large) {
                url = attachment.sizes.medium_large.url;
            }
            targetInput.val(url).trigger('change');

            // Show preview
            if (preview.length) {
                preview.html('<img src="' + url + '" style="max-width:300px;max-height:150px;margin-top:8px;border-radius:8px;border:1px solid #ddd;">');
            }
        });

        mediaFrame.open();
    });

    // Remove image
    $(document).on('click', '.solaris-media-remove', function(e) {
        e.preventDefault();
        var container = $(this).closest('td');
        container.find('input[type="url"], input[type="text"]').val('');
        container.find('.solaris-media-preview').html('');
    });

    // Show previews on load for fields that already have URLs
    $('.solaris-media-preview').each(function() {
        var input = $(this).prevAll('input[type="url"], input[type="text"]').first();
        var url = input.val();
        if (url && (url.match(/\.(jpg|jpeg|png|gif|webp|svg)/i) || url.includes('wp-content/uploads'))) {
            $(this).html('<img src="' + url + '" style="max-width:300px;max-height:150px;margin-top:8px;border-radius:8px;border:1px solid #ddd;">');
        }
    });
});
