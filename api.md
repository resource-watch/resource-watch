## Constants

<dl>
<dt><a href="#fetchArea">fetchArea</a></dt>
<dd><p>Get area</p>
</dd>
<dt><a href="#fetchUserAreas">fetchUserAreas</a></dt>
<dd><p>Get user areas</p>
</dd>
<dt><a href="#deleteArea">deleteArea</a> ⇒ <code>Promise</code></dt>
<dd><p>Deletes an area</p>
</dd>
<dt><a href="#createArea">createArea</a></dt>
<dd><p>Create new area</p>
</dd>
<dt><a href="#updateArea">updateArea</a></dt>
<dd><p>Update area</p>
</dd>
<dt><a href="#fetchPosts">fetchPosts</a> ⇒ <code>Array.&lt;Object&gt;</code></dt>
<dd><p>Fetchs posts from wordpress API.</p>
</dd>
<dt><a href="#fetchAllCollections">fetchAllCollections</a></dt>
<dd><p>Retrieve all collections of the user</p>
</dd>
<dt><a href="#fetchCollection">fetchCollection</a></dt>
<dd><p>Retrieve data of a specific collection</p>
</dd>
<dt><a href="#createCollection">createCollection</a></dt>
<dd><p>Creates a new collection attached to the current user</p>
</dd>
<dt><a href="#deleteCollection">deleteCollection</a></dt>
<dd><p>Deletes an existing collection attached to the current user</p>
</dd>
<dt><a href="#updateCollection">updateCollection</a></dt>
<dd><p>Update an existing collection attached to the current user</p>
</dd>
<dt><a href="#addResourceToCollection">addResourceToCollection</a></dt>
<dd></dd>
<dt><a href="#removeResourceFromCollection">removeResourceFromCollection</a></dt>
<dd></dd>
<dt><a href="#fetchDashboards">fetchDashboards</a> ⇒ <code>Array.&lt;Object&gt;</code></dt>
<dd><p>Fetchs dashboards according to params.</p>
</dd>
<dt><a href="#fetchDashboard">fetchDashboard</a> ⇒ <code>Object</code></dt>
<dd><p>fetchs data for a specific dashboard.</p>
</dd>
<dt><a href="#createDashboard">createDashboard</a> ⇒ <code>Object</code></dt>
<dd><p>Creates a dashboard with the provided data.
This fetch needs authentication.</p>
</dd>
<dt><a href="#updateDashboard">updateDashboard</a> ⇒ <code>Object</code></dt>
<dd><p>Updates a specified dashboard with the provided data.
This fetch needs authentication.</p>
</dd>
<dt><a href="#deleteDashboard">deleteDashboard</a> ⇒ <code>Object</code></dt>
<dd><p>Deletes a specified dashboard.
This fetch needs authentication.</p>
</dd>
<dt><a href="#cloneDashboard">cloneDashboard</a> ⇒ <code>Object</code></dt>
<dd><p>Clones a topic to convert it into a dashboard based on topic&#39;s data.
This fetch needs authentication.</p>
</dd>
<dt><a href="#fetchDatasets">fetchDatasets</a> ⇒ <code>Array</code></dt>
<dd><p>Fetchs datasets according to params.</p>
</dd>
<dt><a href="#fetchDataset">fetchDataset</a> ⇒ <code>Object</code></dt>
<dd><p>fetches data for a specific dataset.</p>
</dd>
<dt><a href="#fetchDatasetTags">fetchDatasetTags</a></dt>
<dd><p>Get dataset tags</p>
</dd>
<dt><a href="#deleteDataset">deleteDataset</a> ⇒ <code>Object</code></dt>
<dd><p>Deletes a specified dataset.
This fetch needs authentication.</p>
</dd>
<dt><a href="#updateDatasetTags">updateDatasetTags</a></dt>
<dd><p>Update dataset tags</p>
</dd>
<dt><a href="#createMetadata">createMetadata</a> ⇒ <code>Object</code></dt>
<dd><p>Creates a metadata object in the specified dataset
This methods requires authentication.</p>
</dd>
<dt><a href="#updateMetadata">updateMetadata</a> ⇒ <code>Object</code></dt>
<dd><p>Updates a metadata object in the specified dataset
This methods requires authentication.</p>
</dd>
<dt><a href="#fetchFavourites">fetchFavourites</a></dt>
<dd><p>Retrieve all favourites items of the user</p>
</dd>
<dt><a href="#createFavourite">createFavourite</a></dt>
<dd><p>Creates a new favourite item attached to the current user</p>
</dd>
<dt><a href="#deleteFavourite">deleteFavourite</a></dt>
<dd><p>Deletes an existing favourite item attached to the current user</p>
</dd>
<dt><a href="#fetchFields">fetchFields</a> ⇒ <code>Object</code></dt>
<dd><p>fetches fields for a specific dataset.</p>
</dd>
<dt><a href="#fetchGeostore">fetchGeostore</a> ⇒ <code>Array.&lt;Object&gt;</code></dt>
<dd><p>fetches Geostore</p>
</dd>
<dt><a href="#fetchCountries">fetchCountries</a></dt>
<dd><p>Fetch countries</p>
</dd>
<dt><a href="#fetchCountry">fetchCountry</a></dt>
<dd><p>Get country</p>
</dd>
<dt><a href="#fetchAllTags">fetchAllTags</a></dt>
<dd><p>Get all tags</p>
</dd>
<dt><a href="#fetchInferredTags">fetchInferredTags</a></dt>
<dd><p>Get inferred tags</p>
</dd>
<dt><a href="#countDatasetView">countDatasetView</a> ⇒ <code>Promise.&lt;void&gt;</code></dt>
<dd><p>Send a request to count a view to the dataset</p>
</dd>
<dt><a href="#fetchMostViewedDatasets">fetchMostViewedDatasets</a> ⇒ <code>Promise.&lt;Array.&lt;string&gt;&gt;</code></dt>
<dd><p>Get the list of most viewed datasets</p>
</dd>
<dt><a href="#fetchMostFavoritedDatasets">fetchMostFavoritedDatasets</a></dt>
<dd><p>Get the list of most favourited datasets</p>
</dd>
<dt><a href="#fetchSimilarDatasets">fetchSimilarDatasets</a></dt>
<dd><p>Fetch similar datasets</p>
</dd>
<dt><a href="#fetchLayers">fetchLayers</a> ⇒ <code>Array.&lt;Object&gt;</code></dt>
<dd><p>Fetchs layers according to params.</p>
</dd>
<dt><a href="#fetchLayer">fetchLayer</a> ⇒ <code>Array.&lt;Object&gt;</code></dt>
<dd><p>Fetches a layer according to widget id and params.</p>
</dd>
<dt><a href="#deleteLayer">deleteLayer</a> ⇒ <code>Object</code></dt>
<dd><p>Deletes a specified layer.
This fetch needs authentication.</p>
</dd>
<dt><a href="#fetchPartners">fetchPartners</a> ⇒ <code>Array.&lt;Object&gt;</code></dt>
<dd><p>Fetchs partners according to params.</p>
</dd>
<dt><a href="#fetchPartner">fetchPartner</a> ⇒ <code>Object</code></dt>
<dd><p>fetchs data for a specific partnet.</p>
</dd>
<dt><a href="#fetchStaticPage">fetchStaticPage</a> ⇒ <code>Array.&lt;Object&gt;</code></dt>
<dd><p>Fetchs content of a specific page.</p>
</dd>
<dt><a href="#fetchSubscriptions">fetchSubscriptions</a></dt>
<dd><p>Get Subscriptions</p>
</dd>
<dt><a href="#createSubscriptionToArea">createSubscriptionToArea</a></dt>
<dd><p>Creates a subscription for an area</p>
</dd>
<dt><a href="#updateSubscriptionToArea">updateSubscriptionToArea</a></dt>
<dd><p>Update Subscription</p>
</dd>
<dt><a href="#fetchSubscription">fetchSubscription</a></dt>
<dd><p>Get Subscription</p>
</dd>
<dt><a href="#deleteSubscription">deleteSubscription</a> ⇒ <code>Promise</code></dt>
<dd><p>Deletes a subscription</p>
</dd>
<dt><a href="#fetchTool">fetchTool</a> ⇒ <code>Array.&lt;Object&gt;</code></dt>
<dd><p>Fetchs a specific tool.</p>
</dd>
<dt><a href="#fetchTopics">fetchTopics</a> ⇒ <code>Array.&lt;Object&gt;</code></dt>
<dd><p>Fetches topics according to params.</p>
</dd>
<dt><a href="#fetchTopic">fetchTopic</a> ⇒ <code>Object</code></dt>
<dd><p>fetches data for a specific topic.</p>
</dd>
<dt><a href="#createTopic">createTopic</a> ⇒ <code>Object</code></dt>
<dd><p>Creates a topic with the provided data.
This fetch needs authentication.</p>
</dd>
<dt><a href="#updateTopic">updateTopic</a> ⇒ <code>Object</code></dt>
<dd><p>Updates a specified topic with the provided data.
This fetch needs authentication.</p>
</dd>
<dt><a href="#deleteTopic">deleteTopic</a> ⇒ <code>Object</code></dt>
<dd><p>Deletes a specified topic.
This fetch needs authentication.</p>
</dd>
<dt><a href="#loginUser">loginUser</a></dt>
<dd><p>Logs in a user based on the email + password combination</p>
</dd>
<dt><a href="#forgotPassword">forgotPassword</a></dt>
<dd><p>This function sends a request to reset the user&#39;s password.
It generates a token to be used in resetPassword</p>
</dd>
<dt><a href="#registerUser">registerUser</a></dt>
<dd><p>Register a new user based on the email + password combination</p>
</dd>
<dt><a href="#resetPassword">resetPassword</a></dt>
<dd><p>Resets the user&#39;s password.
Needs the token hosted in the email sent in forgotPassword
NOTE:this is NOT implemented in the API to be done from the app.
right now the only way it&#39;s through the email link pointing to Control Tower.</p>
</dd>
<dt><a href="#fetchWidgets">fetchWidgets</a> ⇒ <code>Array.&lt;Object&gt;</code></dt>
<dd><p>Fetchs widgets according to params.</p>
</dd>
<dt><a href="#fetchWidget">fetchWidget</a> ⇒ <code>Object</code></dt>
<dd><p>fetches data for a specific widget.</p>
</dd>
<dt><a href="#deleteWidget">deleteWidget</a> ⇒ <code>Object</code></dt>
<dd><p>Deletes a specified widget.
This fetch needs authentication.</p>
</dd>
</dl>

## Functions

<dl>
<dt><a href="#freezeWidget">freezeWidget()</a></dt>
<dd><p>This method freezes a widget and returns the URL of the corresponding JSON
file that was created on the cloud</p>
</dd>
<dt><a href="#getBandNames">getBandNames()</a> ⇒ <code>Promise.&lt;Array.&lt;string&gt;&gt;</code></dt>
<dd><p>Return the names of the bands</p>
</dd>
<dt><a href="#getBandStatsInfo">getBandStatsInfo(bandName)</a> ⇒ <code>Promise.&lt;object&gt;</code></dt>
<dd><p>Return the statistical information of a band</p>
</dd>
<dt><a href="#getChartInfo">getChartInfo(widgetEditor)</a> ⇒ <code>ChartInfo</code></dt>
<dd><p>Return the ChartInfo object for a raster chart</p>
</dd>
</dl>

<a name="fetchArea"></a>

## fetchArea
Get area

**Kind**: global constant  
<a name="fetchUserAreas"></a>

## fetchUserAreas
Get user areas

**Kind**: global constant  
<a name="deleteArea"></a>

## deleteArea ⇒ <code>Promise</code>
Deletes an area

**Kind**: global constant  

| Param | Type | Description |
| --- | --- | --- |
| ID | <code>areaId</code> | of the area that will be deleted |
| User | <code>token</code> | token |

<a name="createArea"></a>

## createArea
Create new area

**Kind**: global constant  
<a name="updateArea"></a>

## updateArea
Update area

**Kind**: global constant  
<a name="fetchPosts"></a>

## fetchPosts ⇒ <code>Array.&lt;Object&gt;</code>
Fetchs posts from wordpress API.

**Kind**: global constant  
**Returns**: <code>Array.&lt;Object&gt;</code> - array of parsed posts.  

| Param | Type | Description |
| --- | --- | --- |
| params | <code>Array.&lt;Object&gt;</code> | params sent to the API. |

<a name="fetchAllCollections"></a>

## fetchAllCollections
Retrieve all collections of the user

**Kind**: global constant  

| Param | Type | Description |
| --- | --- | --- |
| token | <code>\*</code> | User's token |
| params | <code>\*</code> | Request optional parameters |

<a name="fetchCollection"></a>

## fetchCollection
Retrieve data of a specific collection

**Kind**: global constant  

| Param | Type | Description |
| --- | --- | --- |
| token | <code>\*</code> | User's token |
| collectionId | <code>\*</code> | Id of the collection we are asking for. |
| params | <code>\*</code> | Request parameters |

<a name="createCollection"></a>

## createCollection
Creates a new collection attached to the current user

**Kind**: global constant  

| Param | Type | Description |
| --- | --- | --- |
| token | <code>\*</code> | User's token |
| data | <code>\*</code> | collection data |

<a name="deleteCollection"></a>

## deleteCollection
Deletes an existing collection attached to the current user

**Kind**: global constant  

| Param | Type | Description |
| --- | --- | --- |
| token | <code>\*</code> | User's token |
| collectionId | <code>\*</code> | Id of the collection to be removed |

<a name="updateCollection"></a>

## updateCollection
Update an existing collection attached to the current user

**Kind**: global constant  

| Param | Type | Description |
| --- | --- | --- |
| token | <code>\*</code> | User's token |
| collectionId | <code>\*</code> | Id of the collection to be edited |
| data | <code>\*</code> | Data to be updated |

<a name="addResourceToCollection"></a>

## addResourceToCollection
**Kind**: global constant  

| Param | Type | Description |
| --- | --- | --- |
| token | <code>\*</code> | User's token |
| collectionId | <code>\*</code> | Id of the collection to be edited |
| resource | <code>\*</code> | Resource to be addded to the collection |

<a name="removeResourceFromCollection"></a>

## removeResourceFromCollection
**Kind**: global constant  

| Param | Type | Description |
| --- | --- | --- |
| token | <code>\*</code> | User's token |
| collectionId | <code>\*</code> | Id of the collection to be edited |
| resource | <code>\*</code> | Resource to be removed from the collection |

<a name="fetchDashboards"></a>

## fetchDashboards ⇒ <code>Array.&lt;Object&gt;</code>
Fetchs dashboards according to params.

**Kind**: global constant  
**Returns**: <code>Array.&lt;Object&gt;</code> - array of serialized dashboards.  

| Param | Type | Description |
| --- | --- | --- |
| params | <code>Array.&lt;Object&gt;</code> | params sent to the API. |

<a name="fetchDashboard"></a>

## fetchDashboard ⇒ <code>Object</code>
fetchs data for a specific dashboard.

**Kind**: global constant  
**Returns**: <code>Object</code> - serialized specified dashboard.  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>String</code> | dashboard id. |

<a name="createDashboard"></a>

## createDashboard ⇒ <code>Object</code>
Creates a dashboard with the provided data.
This fetch needs authentication.

**Kind**: global constant  
**Returns**: <code>Object</code> - serialized created dashboard.  

| Param | Type | Description |
| --- | --- | --- |
| body | <code>Object</code> | data provided to create the new dashboard. |
| token | <code>String</code> | user's token. |

<a name="updateDashboard"></a>

## updateDashboard ⇒ <code>Object</code>
Updates a specified dashboard with the provided data.
This fetch needs authentication.

**Kind**: global constant  
**Returns**: <code>Object</code> - serialized dashboard with updated data  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>String</code> | dashboard ID to be updated. |
| body | <code>Object</code> | data provided to update the dashboard. |
| token | <code>String</code> | user's token |

<a name="deleteDashboard"></a>

## deleteDashboard ⇒ <code>Object</code>
Deletes a specified dashboard.
This fetch needs authentication.

**Kind**: global constant  
**Returns**: <code>Object</code> - fetch response.  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>\*</code> | dashboard ID to be deleted. |
| token | <code>string</code> | user's token. |

<a name="cloneDashboard"></a>

## cloneDashboard ⇒ <code>Object</code>
Clones a topic to convert it into a dashboard based on topic's data.
This fetch needs authentication.

**Kind**: global constant  
**Returns**: <code>Object</code> - serialized dashboard cloned based on the ID topic.  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>String</code> | topic ID to be cloned. |
| token | <code>string</code> | user's token. |

<a name="fetchDatasets"></a>

## fetchDatasets ⇒ <code>Array</code>
Fetchs datasets according to params.

**Kind**: global constant  
**Returns**: <code>Array</code> - Array of serialized datasets.
be included in the response or not.
Check out the API docs for this endpoint [here](https://resource-watch.github.io/doc-api/index-rw.html#getting-all-datasets)  

| Param | Type | Description |
| --- | --- | --- |
| params | <code>Object</code> | Request paremeters. |
| headers | <code>Object</code> | Request headers. |
| _meta | <code>boolean</code> | Boolean flag indicating whether the meta object should |

<a name="fetchDataset"></a>

## fetchDataset ⇒ <code>Object</code>
fetches data for a specific dataset.

**Kind**: global constant  
**Returns**: <code>Object</code> - serialized specified dataset.  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>String</code> | dataset id. |
| params | <code>Array.&lt;Object&gt;</code> | params sent to the API. |

<a name="fetchDatasetTags"></a>

## fetchDatasetTags
Get dataset tags

**Kind**: global constant  
<a name="deleteDataset"></a>

## deleteDataset ⇒ <code>Object</code>
Deletes a specified dataset.
This fetch needs authentication.

**Kind**: global constant  
**Returns**: <code>Object</code> - fetch response.  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>\*</code> | dataset ID to be deleted. |
| token | <code>string</code> | user's token. |

<a name="updateDatasetTags"></a>

## updateDatasetTags
Update dataset tags

**Kind**: global constant  
<a name="createMetadata"></a>

## createMetadata ⇒ <code>Object</code>
Creates a metadata object in the specified dataset
This methods requires authentication.

**Kind**: global constant  
**Returns**: <code>Object</code> - serialized metadata object.  

| Param | Type | Description |
| --- | --- | --- |
| datasetId | <code>\*</code> | dataset ID where the metadata will be attached |
| params | <code>Object</code> | metadata object |
| token | <code>string</code> | user's token. |

<a name="updateMetadata"></a>

## updateMetadata ⇒ <code>Object</code>
Updates a metadata object in the specified dataset
This methods requires authentication.

**Kind**: global constant  
**Returns**: <code>Object</code> - serialized metadata object.  

| Param | Type | Description |
| --- | --- | --- |
| datasetId | <code>\*</code> | dataset ID where the metadata will be attached |
| params | <code>Object</code> | metadata object |
| token | <code>string</code> | user's token. |

<a name="fetchFavourites"></a>

## fetchFavourites
Retrieve all favourites items of the user

**Kind**: global constant  

| Param | Type | Description |
| --- | --- | --- |
| token | <code>\*</code> | User's token |

<a name="createFavourite"></a>

## createFavourite
Creates a new favourite item attached to the current user

**Kind**: global constant  

| Param | Type | Description |
| --- | --- | --- |
| token | <code>\*</code> | User's token |
| resourceId | <code>\*</code> | Id of the resource |
| resourceType | <code>\*</code> | Resource's type (can be dataset, layer or widget) |

<a name="deleteFavourite"></a>

## deleteFavourite
Deletes an existing favourite item attached to the current user

**Kind**: global constant  

| Param | Type | Description |
| --- | --- | --- |
| token | <code>\*</code> | User's token |
| resourceId | <code>\*</code> | Id of the resource |

<a name="fetchFields"></a>

## fetchFields ⇒ <code>Object</code>
fetches fields for a specific dataset.

**Kind**: global constant  
**Returns**: <code>Object</code> - array of dataset fields.  

| Param | Type | Description |
| --- | --- | --- |
| url | <code>String</code> | URL to get fields. |

<a name="fetchGeostore"></a>

## fetchGeostore ⇒ <code>Array.&lt;Object&gt;</code>
fetches Geostore

**Kind**: global constant  
**Returns**: <code>Array.&lt;Object&gt;</code> - serialized geostore object.  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>Array.&lt;Object&gt;</code> | geostore ID. |

<a name="fetchCountries"></a>

## fetchCountries
Fetch countries

**Kind**: global constant  
<a name="fetchCountry"></a>

## fetchCountry
Get country

**Kind**: global constant  
<a name="fetchAllTags"></a>

## fetchAllTags
Get all tags

**Kind**: global constant  

| Param | Type | Description |
| --- | --- | --- |
| params | <code>Object</code> | Request parameters https://resource-watch.github.io/doc-api/index-rw.html#list-concepts |

<a name="fetchInferredTags"></a>

## fetchInferredTags
Get inferred tags

**Kind**: global constant  

| Param | Type | Description |
| --- | --- | --- |
| params | <code>Object</code> | Request parameters https://resource-watch.github.io/doc-api/index-rw.html#get-inferred-concepts |

<a name="countDatasetView"></a>

## countDatasetView ⇒ <code>Promise.&lt;void&gt;</code>
Send a request to count a view to the dataset

**Kind**: global constant  

| Param | Type | Description |
| --- | --- | --- |
| datasetId | <code>string</code> | Dataset ID |
| [token] | <code>string</code> | User token |

<a name="fetchMostViewedDatasets"></a>

## fetchMostViewedDatasets ⇒ <code>Promise.&lt;Array.&lt;string&gt;&gt;</code>
Get the list of most viewed datasets

**Kind**: global constant  
**Returns**: <code>Promise.&lt;Array.&lt;string&gt;&gt;</code> - List of sorted ids  

| Param | Type | Description |
| --- | --- | --- |
| params | <code>Object</code> | Request parameters |

<a name="fetchMostFavoritedDatasets"></a>

## fetchMostFavoritedDatasets
Get the list of most favourited datasets

**Kind**: global constant  

| Param | Type | Description |
| --- | --- | --- |
| params | <code>Object</code> | Request parameters https://resource-watch.github.io/doc-api/index-rw.html#most-liked-datasets |

<a name="fetchSimilarDatasets"></a>

## fetchSimilarDatasets
Fetch similar datasets

**Kind**: global constant  

| Param | Type | Description |
| --- | --- | --- |
| params | <code>Object</code> | Request parameters |
| withAncestors | <code>boolean</code> | Flag indicating whether tags' ancestors should be considered or not https://resource-watch.github.io/doc-api/index-rw.html#similar-datasets-including-ancestors |

<a name="fetchLayers"></a>

## fetchLayers ⇒ <code>Array.&lt;Object&gt;</code>
Fetchs layers according to params.

**Kind**: global constant  
**Returns**: <code>Array.&lt;Object&gt;</code> - array of serialized layers.  

| Param | Type | Description |
| --- | --- | --- |
| params | <code>Array.&lt;Object&gt;</code> | params sent to the API. |

<a name="fetchLayer"></a>

## fetchLayer ⇒ <code>Array.&lt;Object&gt;</code>
Fetches a layer according to widget id and params.

**Kind**: global constant  
**Returns**: <code>Array.&lt;Object&gt;</code> - - serialized specific layer.  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>String</code> | layer id. |
| params | <code>Array.&lt;Object&gt;</code> | params sent to the API. |

<a name="deleteLayer"></a>

## deleteLayer ⇒ <code>Object</code>
Deletes a specified layer.
This fetch needs authentication.

**Kind**: global constant  
**Returns**: <code>Object</code> - fetch response.  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>\*</code> | layer ID to be deleted. |
| token | <code>string</code> | user's token. |

<a name="fetchPartners"></a>

## fetchPartners ⇒ <code>Array.&lt;Object&gt;</code>
Fetchs partners according to params.

**Kind**: global constant  
**Returns**: <code>Array.&lt;Object&gt;</code> - array of serialized partners.  

| Param | Type | Description |
| --- | --- | --- |
| params | <code>Array.&lt;Object&gt;</code> | params sent to the API. |

<a name="fetchPartner"></a>

## fetchPartner ⇒ <code>Object</code>
fetchs data for a specific partnet.

**Kind**: global constant  
**Returns**: <code>Object</code> - serialized specified partnet.  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>String</code> | partnet id. |

<a name="fetchStaticPage"></a>

## fetchStaticPage ⇒ <code>Array.&lt;Object&gt;</code>
Fetchs content of a specific page.

**Kind**: global constant  
**Returns**: <code>Array.&lt;Object&gt;</code> - page content serialized.  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>String</code> | id of the page to fetch. |

<a name="fetchSubscriptions"></a>

## fetchSubscriptions
Get Subscriptions

**Kind**: global constant  
<a name="createSubscriptionToArea"></a>

## createSubscriptionToArea
Creates a subscription for an area

**Kind**: global constant  
<a name="updateSubscriptionToArea"></a>

## updateSubscriptionToArea
Update Subscription

**Kind**: global constant  
<a name="fetchSubscription"></a>

## fetchSubscription
Get Subscription

**Kind**: global constant  
<a name="deleteSubscription"></a>

## deleteSubscription ⇒ <code>Promise</code>
Deletes a subscription

**Kind**: global constant  

| Param | Type | Description |
| --- | --- | --- |
| ID | <code>subscriptionId</code> | of the subscription that will be deleted |
| User | <code>token</code> | token |

<a name="fetchTool"></a>

## fetchTool ⇒ <code>Array.&lt;Object&gt;</code>
Fetchs a specific tool.

**Kind**: global constant  
**Returns**: <code>Array.&lt;Object&gt;</code> - tool serialized.  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>String</code> | tool id. |

<a name="fetchTopics"></a>

## fetchTopics ⇒ <code>Array.&lt;Object&gt;</code>
Fetches topics according to params.

**Kind**: global constant  
**Returns**: <code>Array.&lt;Object&gt;</code> - array of serialized topics.  

| Param | Type | Description |
| --- | --- | --- |
| params | <code>Array.&lt;Object&gt;</code> | params sent to the API. |

<a name="fetchTopic"></a>

## fetchTopic ⇒ <code>Object</code>
fetches data for a specific topic.

**Kind**: global constant  
**Returns**: <code>Object</code> - serialized specified topic.  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>String</code> | topic id. |

<a name="createTopic"></a>

## createTopic ⇒ <code>Object</code>
Creates a topic with the provided data.
This fetch needs authentication.

**Kind**: global constant  
**Returns**: <code>Object</code> - serialized created topic.  

| Param | Type | Description |
| --- | --- | --- |
| body | <code>Object</code> | data provided to create the new topic. |
| token | <code>String</code> | user's token. |

<a name="updateTopic"></a>

## updateTopic ⇒ <code>Object</code>
Updates a specified topic with the provided data.
This fetch needs authentication.

**Kind**: global constant  
**Returns**: <code>Object</code> - serialized topic with updated data  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>String</code> | topic ID to be updated. |
| body | <code>Object</code> | data provided to update the topic. |
| token | <code>String</code> | user's token |

<a name="deleteTopic"></a>

## deleteTopic ⇒ <code>Object</code>
Deletes a specified topic.
This fetch needs authentication.

**Kind**: global constant  
**Returns**: <code>Object</code> - fetch response.  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>\*</code> | topic ID to be deleted. |
| token | <code>string</code> | user's token. |

<a name="loginUser"></a>

## loginUser
Logs in a user based on the email + password combination

**Kind**: global constant  
<a name="forgotPassword"></a>

## forgotPassword
This function sends a request to reset the user's password.
It generates a token to be used in resetPassword

**Kind**: global constant  
<a name="registerUser"></a>

## registerUser
Register a new user based on the email + password combination

**Kind**: global constant  
<a name="resetPassword"></a>

## resetPassword
Resets the user's password.
Needs the token hosted in the email sent in forgotPassword
NOTE:this is NOT implemented in the API to be done from the app.
right now the only way it's through the email link pointing to Control Tower.

**Kind**: global constant  
<a name="fetchWidgets"></a>

## fetchWidgets ⇒ <code>Array.&lt;Object&gt;</code>
Fetchs widgets according to params.

**Kind**: global constant  
**Returns**: <code>Array.&lt;Object&gt;</code> - array of serialized widgets.  

| Param | Type | Description |
| --- | --- | --- |
| params | <code>Array.&lt;Object&gt;</code> | params sent to the API. |

<a name="fetchWidget"></a>

## fetchWidget ⇒ <code>Object</code>
fetches data for a specific widget.

**Kind**: global constant  
**Returns**: <code>Object</code> - serialized specified widget.  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>String</code> | widget id. |
| params | <code>Array.&lt;Object&gt;</code> | params sent to the API. |

<a name="deleteWidget"></a>

## deleteWidget ⇒ <code>Object</code>
Deletes a specified widget.
This fetch needs authentication.

**Kind**: global constant  
**Returns**: <code>Object</code> - fetch response.  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>\*</code> | widget ID to be deleted. |
| token | <code>string</code> | user's token. |

<a name="freezeWidget"></a>

## freezeWidget()
This method freezes a widget and returns the URL of the corresponding JSON
file that was created on the cloud

**Kind**: global function  
<a name="getBandNames"></a>

## getBandNames() ⇒ <code>Promise.&lt;Array.&lt;string&gt;&gt;</code>
Return the names of the bands

**Kind**: global function  
<a name="getBandStatsInfo"></a>

## getBandStatsInfo(bandName) ⇒ <code>Promise.&lt;object&gt;</code>
Return the statistical information of a band

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| bandName | <code>string</code> | Name of the band |

<a name="getChartInfo"></a>

## getChartInfo(widgetEditor) ⇒ <code>ChartInfo</code>
Return the ChartInfo object for a raster chart

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| widgetEditor | <code>object</code> | Store object |

