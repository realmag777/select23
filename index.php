<html>
    <head>
        <meta charset="UTF-8">
        <title>SelectM23</title>
        <link href="lib/selectm23.css?ver=<?= uniqid('s-') ?>" type="text/css" rel="stylesheet">
        <script src="lib/selectm23.js?ver=<?= uniqid('s-') ?>"></script>
        <style>
            *{
                font-family: Arial;
            }
        </style>
    </head>
    <body>
        <select id="select23" multiple="">
            <option value="id">ID</option>
            <option value="thumbnail">Thumbnail</option>
            <option value="post_title">Title</option>
            <option value="post_excerpt">Excerpt</option>
            <option value="post_content">Content</option>
            <option selected value="single">Single</option>
            <option value="post_status">Status</option>
            <option value="post_author">Author</option>
            <option value="post_date">Post date</option>
            <option value="post_modified">Post modified</option>
            <option value="comment_count">Comment count</option>
            <option selected value="price">Price</option>
            <option value="regular_price">Regular Price</option>
            <option value="sale_price">Sale Price</option>
            <option value="on_sale">On Sale</option>
            <option value="sku">SKU</option>
            <option value="downloadable">Downloadable</option>
            <option value="gallery">Gallery</option>
            <option selected value="weight">Weight</option>
            <option value="length">Length</option>
            <option value="height">Height</option>
            <option value="width">Width</option>
            <option value="manage_stock">Manage stock</option>
            <option value="stock_status">Stock status</option>
            <option value="stock_quantity">Stock quantity</option>
            <option value="sold_individually">Sold individually</option>
            <option value="total_sales">Total sales</option>
            <option value="review_count">Reviews count</option>
            <option value="menu_order">Menu order</option>
            <option value="tax_status">Tax status</option>
            <option value="average_rating">Rating</option>
            <option value="grouped">Grouped</option>
            <option value="upsell">Upsells</option>
            <option value="cross_sell">Cross sells</option>
            <option value="variations">Variations</option>
            <option value="product_type">Type</option>
            <option value="featured">Featured</option>
            <option value="product_cat">Product categories</option>
            <option value="product_tag">Product tags</option>
            <option value="pa_color">Product Color</option>
            <option value="pa_size">Product Size</option>
            <option value="locations">Locations</option>
            <option value="add_to_cart">Cart</option>
            <option value="attachments">Attachments</option>
            <option value="favourites">Favourites</option>
            <option value="ask_me">Ask Me</option>
            <option value="hmeta_1">Meta 1 by hands</option>
            <option value="my_global_column">My meta column</option>
            <option value="test">My TEST column</option>
        </select>


        <script>

            window.addEventListener('load', function () {

                let select = document.getElementById('select23');

                if (typeof SelectM23 === 'function') {
                    let select_o = new SelectM23(select, true);//wrapping of <select>

                    select.addEventListener('selectm23-reorder', function (e) {

                        console.log(`Reorder is done: ${e.detail.values}`);

                    });

                    select.addEventListener('change', function (e) {

                        console.log(`Selection is done: ${e.detail.values}`);

                    });

                    select_o.onSelect = function () {
                        console.log(this);
                    }
                }

            });

        </script>


    </body>
</html>
