# MetaRecon API Specification Document

## Important Points
- Every Response Object will contain `{statusCode: Number, message: String}` in addition to the mentioned object.
- No APIs require `token` to be sent in the "Authorization" header.
- In case of error, an additional `error` attribute in the object mentioned above. For example:
<pre>
    {statusCode: Number, message: String, <b>error: {name: String, details: String}</b>}
</pre>
- The `statusCode` for successful response is `200`.

## APIS
### 1. Recon

|#|Name|Description|Route|Request Object|Request Type|Response Object (Success)|
|-|-|-|-|-|-|-|
|1|Fetch Recon Attribute List|Get the list of attributes available|`/api/recon/attribute/list/fetch`|`{}`|`POST`|`{attributes: [{id: Number, name: String, type: String}]}`|
|2|Fetch Recon Request List|Get the list of recon requests in the system|`/api/recon/request/list/fetch`|`{}`|`POST`|`{requests: [{id: Number, maxPasses: Number, completed: Boolean, createdAt: Date, completedAt: Date}]}`|
|3|Fetch Recon Request|Get details regarding a single instance of recon request|`/api/recon/request/fetch`|`{requestId: Number}`|`POST`|`{maxPasses: Number, passes: [{id: Number, createdAt: Date, completedAt: Date/Null}], completed: Boolean}`|
|4|Fetch Recon Request Pass|Get the data associated with a single pass of a recon request|`/api/recon/request/pass/fetch`|`{requestId: Number, passId: Number}`|`POST`|`{tools: [{id: Number, name: String, result: [{name: String, type: String, value: String}]}]}`|
|5|Submit Recon Request|Initiate a new recon request|`/api/recon/request/submit`|`{attribute: {id: Number, value: String}, maxPasses: Number}`|`POST`|`{id: Number}`|