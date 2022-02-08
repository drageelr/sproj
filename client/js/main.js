$( document ).ready(function() {
    // Get categories from API
    request = $.ajax({
        url: "api/1.php",
        type: "post",
        data: {},
        dataType: "json"
    });

    // Callback handler that will be called on success
    request.done(function (response, textStatus, jqXHR){
        const data = JSON.parse(response)
        if (data['statusCode'] == 200){
        $.each(data['attributes'], function (i, item) {
            // alert(item.id);
            $('#add-field').append($('<option>', { 
                value: item.id,
                text : item.name,
            }));
        });
        } else {
            alert("API request failed with message: " + data['error']['details']);
        }
    });

    // Callback handler that will be called on failure
    request.fail(function (jqXHR, textStatus, errorThrown){
        // Log the error to the console
        console.log("The following error occurred: "+textStatus , errorThrown);
    });
});

$(function () {
    remove = function (elm) {
        $(elm).parent().parent().remove();
    };
    add = function () {
        let addTypeSelect = document.getElementById("add-field");
        let addType = addTypeSelect.options[addTypeSelect.selectedIndex].text;
        let addCode = addTypeSelect.options[addTypeSelect.selectedIndex].value;
        // alert(addType);
        let fieldList = document.getElementById("fields");
        // let childCount = fieldList.childElementCount;

            let html = `
            <div class="input-group mt-3">
                <input onchange="valueChanged(this);" type="text" class="form-control" placeholder="${addType}" data-type="${addType.toLowerCase()}" data-id="${addCode}"style="width: auto; margin-right: 1em">
                <input onchange="valueChanged(this);" type="number" class="form-control me-3" placeholder="Enter Rounds"/>
                <div class="input-group-append">
                <button class="btn btn-danger" type="button" onclick="remove(this);">
                    <i class="fas fa-trash" aria-hidden="true"></i>
                </button>
                </div>
            </div>
            `;
            fieldList.innerHTML += html;
    };
    valueChanged = function (elm){
        // Set value to ensure data gets saved on DOM change
        elm.setAttribute('value', elm.value);

    };
    submit = function () {
        let fieldList = document.getElementById("fields");
        let fieldCount = fieldList.childElementCount;
        
        // Check field count
        if (fieldCount == 0){
            alert("Field list cannot be empty");
        }  else {
            let postData = {"attributes":[]};
            // Get add fields and save to array for posting to API
            for (let i = 0; i < fieldCount; i++) {
                let dInput = fieldList.children[i].children[0];
                let dRound = fieldList.children[i].children[1];
                // alert(dInput.dataset.id + "," + dInput.value + "," + dRound.value);
                postData.attributes.push({"attributeId":dInput.dataset.id,"value":dInput.value,"maxPasses":dRound.value})
              }
            
            //   alert(JSON.stringify(postData));

            // Send data to API
            $.ajax({
                url: 'api/5.php',
                dataType: 'json',
                type: 'post',
                contentType: 'application/json',
                data: JSON.stringify(postData),
                processData: false,
                success: function( response, textStatus, jQxhr ){
                    // $('#response pre').html( JSON.stringify( data ) );
                    const data = JSON.parse(response)
                    if (data['statusCode'] == 200){
                        // Success
                        window.location = "status.html?id=" + data['id'];
                    } else {
                        alert("API request failed with message: " + data['error']['details']);
                    }
                },
                error: function( jqXhr, textStatus, errorThrown ){
                    console.log( errorThrown );
                }
            });
        }
    };
});