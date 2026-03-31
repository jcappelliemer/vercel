<?php
/**
 * Template Part: Gallery
 */
?>
<section class="sf-section sf-section--dark">
    <div class="sf-container">
        <h2 class="sf-section-title" data-aos="fade-up">I Nostri <span class="sf-text-gold">Lavori</span></h2>
        <p class="sf-muted-text sf-text-center sf-mb-lg">Alcuni dei nostri interventi di installazione pellicole MADICO su edifici residenziali, commerciali e industriali.</p>
        <div class="sf-gallery">
            <?php
            // Use WP Gallery shortcode or custom gallery
            $gallery_images = get_posts(array(
                'post_type' => 'attachment',
                'posts_per_page' => 8,
                'post_mime_type' => 'image',
                'post_parent' => get_the_ID(),
                'orderby' => 'menu_order',
                'order' => 'ASC',
            ));
            if ($gallery_images):
                foreach ($gallery_images as $img):
            ?>
                <div class="sf-gallery__item" data-aos="fade-up">
                    <?php echo wp_get_attachment_image($img->ID, 'card-thumb', false, array('class' => 'sf-gallery__img', 'loading' => 'lazy')); ?>
                </div>
            <?php
                endforeach;
            else:
                // Placeholder grid when no images
                for ($i = 0; $i < 6; $i++):
            ?>
                <div class="sf-gallery__item sf-gallery__item--placeholder" data-aos="fade-up">
                    <div class="sf-gallery__placeholder">Foto <?php echo $i + 1; ?></div>
                </div>
            <?php endfor; endif; ?>
        </div>
    </div>
</section>
