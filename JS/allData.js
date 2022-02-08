$( document ).ready(function() {
    // Get request ID from URL
    const path = window.location;
    let url = new URL(path);
    let id = url.searchParams.get("id");

    // Check for id parameter
    if (id == null){
        window.location = "index.html";
    } else {
        // Validate parameter
        if (isNaN(id)){
            window.location = "index.html"
        }
    }

    // Get request details from API
    request = $.ajax({
        url: "api/3.php",
        type: "post",
        data: {"requestId": id},
        dataType: "json"
    });

    // Callback handler that will be called on success
    request.done(function (response, textStatus, jqXHR){
        const data = JSON.parse(response)
        if (data['statusCode'] == 200){
            document.getElementById("requestID").innerText = id;

            // Get IDs of all passes
            $.each(data['passes'], function (i, item) {
                // alert(item.id);
                // Make request to get individual passes
                request2 = $.ajax({
                    url: "api/4.php",
                    type: "post",
                    data: {"requestId": id,"passId":item.id},
                    dataType: "json",
                    success: function(response){
                        sendRequestSuccess(response);
                    }
                });
                
            });

        } else {
            alert("Failed to retreive data with the error: " + data['error']['details']);
            window.location = "index.html";
        }
        
    });

    // Callback handler that will be called on failure
    request.fail(function (jqXHR, textStatus, errorThrown){
        // Log the error to the console
        console.log("The following error occurred: "+textStatus , errorThrown);
    });


});

function sendRequestSuccess(response){
    const data = JSON.parse(response);
    let dataTable = document.getElementById("resultsList");

        // Process data of each pass

        $.each(data['tools'], function (i, item1) {

            $.each(item1['result'], function (i, item2) {
            // alert(item.id);
            let toolName = item1['name'];
            let resultName = item2['name'];
            let resultValue = item2['value']
            let html = `
            <tr>
                <td class="text-center">${toolName}</td>
                <td class="text-center">${resultName}</td>
                <td class="text-center">${resultValue}</td>
                </tr>`
            dataTable.innerHTML += html;
        });
    });
}