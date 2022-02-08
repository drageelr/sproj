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

    // Add View all button
    document.getElementById("viewAll").innerHTML += `<a class="btn btn-primary btn-sm" href="alldata.html?id=${id}" role="button"> View All Results</a>`;
    
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
            // console.log(data);
            let dataTable = document.getElementById("passDetails");
            let maxPasses = data['maxPasses'];
            let completed = data['completed'];
            
            document.getElementById("requestID").innerText = id;
            document.getElementById("maxPasses").innerText = maxPasses;
            document.getElementById("completedStatus").innerText = completed;

            

            $.each(data['passes'], function (i, item) {
                // alert(item.id);
                let createdAt = new Date(item.createdAt);
                let completedAt = new Date(item.completedAt);
                if (createdAt == "Invalid Date"){
                    createdAt = "N/A";
                } else {
                    createdAt = formatDate(createdAt)
                }
                if (completedAt == "Invalid Date"){
                    completedAt = "N/A";
                } else {
                    completedAt = formatDate(completedAt)
                }
                let html = `
                <tr>
                    <td class="text-center">${item.id}</td>
                    <td class="text-center">${createdAt}</td>
                    <td class="text-center">${completedAt}</td>
                    <td class="text-center"><a class="btn btn-primary btn-sm" href="passdetails.html?requestId=${id}&passId=${item.id}" role="button">View Details</a></td>
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