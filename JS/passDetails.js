$( document ).ready(function() {
    // Get request ID from URL
    const path = window.location;
    let url = new URL(path);
    let requestId = url.searchParams.get("requestId");
    let passId = url.searchParams.get("passId");

    // Check for id parameter
    if (requestId == null || passId == null){
        window.location = "index.html";
    } else {
        // Validate parameter
        if (isNaN(requestId) || isNaN(passId)){
            window.location = "index.html"
        }
    }
    
    // Get request details from API
    request = $.ajax({
        url: "api/4.php",
        type: "post",
        data: {"requestId": requestId, "passId": passId},
        dataType: "json"
    });

    // Callback handler that will be called on success
    request.done(function (response, textStatus, jqXHR){
        const data = JSON.parse(response)
        if (data['statusCode'] == 200){
            // console.log(data);
            let dataTable = document.getElementById("resultsList");

            
            document.getElementById("requestID").innerText = requestId;

            

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