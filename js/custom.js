var client = new ZeroClipboard($(".copy-button"));

client.on( "ready", function( readyEvent ) {

        client.on( "aftercopy", function( event ) {
        $(function () {
            $(event.target).tooltip({title: "Copied to clipboard!"});
            $(event.target).tooltip('show');
            }
        );
    });
    }
);

