function formatDate(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0'+minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return date.getDate() + "/" + date.getMonth()+1 + "/" + date.getFullYear() + " " + strTime;
}

$( document ).ready(function() {
    
    // Get all requests from API
    request = $.ajax({
        url: "api/2.php",
        type: "post",
        data: {},
        dataType: "json"
    });

    // Callback handler that will be called on success
    request.done(function (response, textStatus, jqXHR){
        const data = JSON.parse(response)

        if (data['statusCode'] == 200){
            let dataTable = document.getElementById("resultsList");

            $.each(data['requests'], function (i, item) {
                let completed = "";
                if (item['completed'] == true){
                    completed = '<i class="far fa-check-circle link-success" aria-hidden="true"></i>'
                } else {
                    completed = '<i class="far fa-times-circle link-danger" aria-hidden="true"></i>'
                }
                let createdAt = new Date(item['createdAt']);
                if (createdAt == "Invalid Date"){
                    createdAt = "N/A";
                } else {
                    createdAt = formatDate(createdAt)
                }
                let html = `
                <tr>
                    <td class="text-center">${item['id']}</td>
                    <td class="text-center">${item['maxPasses']}</td>
                    <td class="text-center">${completed}</td>
                    <td class="text-center">${createdAt}</td>
                    <td class="text-center"><a class="btn btn-primary btn-sm" href="status.html?id=${item['id']}" role="button">View Details</a></td>
                </tr>`
                dataTable.innerHTML += html;
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