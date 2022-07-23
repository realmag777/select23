<!DOCTYPE html>
<html>
    <head>
        <meta charset="UTF-8">
        <title>Select23</title>
        <link href="lib/select23.css?ver=<?= uniqid('s-') ?>" type="text/css" rel="stylesheet">
        <script src="lib/js/boot.js?ver=<?= uniqid('s-') ?>" type="module"></script>
        <style>
            *{
                font-family: Arial;
            }
        </style>
    </head>
    <body>

        <select id="select23" multiple="" hidden="">
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
        </select>


    </body>
</html>
