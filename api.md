## Constants

<dl>
<dt><a href="#fetchArea">fetchArea</a> ⇒ <code>Object</code></dt>
<dd><p>Get area.
Check out the API docs for this endpoint <a href="https://resource-watch.github.io/doc-api/index-rw.html#get-area">here</a></p>
</dd>
<dt><a href="#fetchUserAreas">fetchUserAreas</a> ⇒ <code>Object</code></dt>
<dd><p>Get user areas.
Check out the API docs for this endpoint <a href="https://resource-watch.github.io/doc-api/index-rw.html#get-user-areas">here</a></p>
</dd>
<dt><a href="#deleteArea">deleteArea</a> ⇒ <code>Promise</code></dt>
<dd><p>Deletes an area
Check out the API docs for this endpoint <a href="https://resource-watch.github.io/doc-api/index-rw.html#delete-area">here</a></p>
</dd>
<dt><a href="#createArea">createArea</a> ⇒ <code>Object</code></dt>
<dd><p>Create new area.
Check out the API docs for this endpoint <a href="https://resource-watch.github.io/doc-api/index-rw.html#create-area">here</a></p>
</dd>
<dt><a href="#updateArea">updateArea</a> ⇒ <code>Object</code></dt>
<dd><p>Update area.
Check out the API docs for this endpoint <a href="https://resource-watch.github.io/doc-api/index-rw.html#areas">here</a></p>
</dd>
<dt><a href="#fetchPosts">fetchPosts</a> ⇒ <code>Array.&lt;Object&gt;</code></dt>
<dd><p>Fetchs posts from wordpress API.</p>
</dd>
<dt><a href="#fetchAllCollections">fetchAllCollections</a></dt>
<dd><p>Retrieve all collections from a user
Check out the API docs for this endpoint <a href="https://resource-watch.github.io/doc-api/index-rw.html#get-collections">here</a></p>
</dd>
<dt><a href="#fetchCollection">fetchCollection</a></dt>
<dd><p>Retrieve a specific collection
Check out the API docs for this endpoint <a href="https://resource-watch.github.io/doc-api/index-rw.html#get-collection-by-id">here</a></p>
</dd>
<dt><a href="#createCollection">createCollection</a></dt>
<dd><p>Create a new collection associated to the authenticated user
Check out the API docs for this endpoint <a href="https://resource-watch.github.io/doc-api/index-rw.html#create-collection">here</a></p>
</dd>
<dt><a href="#deleteCollection">deleteCollection</a></dt>
<dd><p>Delete an existing collection associated to the authenticated user
Check out the API docs for this endpoint <a href="https://resource-watch.github.io/doc-api/index-rw.html#delete-collection">here</a></p>
</dd>
<dt><a href="#updateCollection">updateCollection</a></dt>
<dd><p>Update an existing collection associataed to the authenticated user
Check out the API docs for this endpoint <a href="https://resource-watch.github.io/doc-api/index-rw.html#update-collection">here</a></p>
</dd>
<dt><a href="#addResourceToCollection">addResourceToCollection</a></dt>
<dd><p>Add a resource to the collection
Check out the API docs for this endpoint <a href="https://resource-watch.github.io/doc-api/index-rw.html#add-resource-to-collection">here</a></p>
</dd>
<dt><a href="#removeResourceFromCollection">removeResourceFromCollection</a></dt>
<dd><p>Remove resource from collection
Check out the API docs for this endpoint <a href="https://resource-watch.github.io/doc-api/index-rw.html#delete-collection-resource">here</a></p>
</dd>
<dt><a href="#contactUs">contactUs</a> ⇒ <code>Promise</code></dt>
<dd><p>Sends a contact form including a topic, email address, and a message.
Check out the API docs for this endpoint <a href="https://resource-watch.github.io/doc-api/index-rw.html#contact-us">here</a></p>
</dd>
<dt><a href="#fetchDashboards">fetchDashboards</a> ⇒ <code>Array.&lt;Object&gt;</code></dt>
<dd><p>Fetchs dashboards according to params.
Check out the API docs for this endpoint <a href="https://resource-watch.github.io/doc-api/index-rw.html#getting-all-dashboards">here</a></p>
</dd>
<dt><a href="#fetchDashboard">fetchDashboard</a> ⇒ <code>Object</code></dt>
<dd><p>fetchs data for a specific dashboard.
Check out the API docs for this endpoint <a href="https://resource-watch.github.io/doc-api/index-rw.html#getting-a-dashboard-by-its-id">here</a></p>
</dd>
<dt><a href="#createDashboard">createDashboard</a> ⇒ <code>Object</code></dt>
<dd><p>Creates a dashboard with the provided data.
This fetch needs authentication.
Check out the API docs for this endpoint <a href="https://resource-watch.github.io/doc-api/index-rw.html#creating-a-dashboard">here</a></p>
</dd>
<dt><a href="#updateDashboard">updateDashboard</a> ⇒ <code>Object</code></dt>
<dd><p>Updates a specified dashboard with the provided data.
This fetch needs authentication.
Check out the API docs for this endpoint <a href="https://resource-watch.github.io/doc-api/index-rw.html#editing-a-dashboard">here</a></p>
</dd>
<dt><a href="#deleteDashboard">deleteDashboard</a> ⇒ <code>Object</code></dt>
<dd><p>Deletes a specified dashboard.
This fetch needs authentication.
Check out the API docs for this endpoint <a href="https://resource-watch.github.io/doc-api/index-rw.html#delete-dashboard">here</a></p>
</dd>
<dt><a href="#cloneDashboard">cloneDashboard</a> ⇒ <code>Object</code></dt>
<dd><p>Clones a topic to convert it into a dashboard based on topic&#39;s data.
This fetch needs authentication.
Check out the API docs for this endpoint <a href="https://resource-watch.github.io/doc-api/index-rw.html#clone-dashboard">here</a></p>
</dd>
<dt><a href="#fetchDatasets">fetchDatasets</a> ⇒ <code>Array</code></dt>
<dd><p>Fetchs datasets according to params.
Check out the API docs for this endpoint <a href="https://resource-watch.github.io/doc-api/index-rw.html#getting-all-datasets">here</a></p>
</dd>
<dt><a href="#fetchDataset">fetchDataset</a> ⇒ <code>Object</code></dt>
<dd><p>Fetches a dataset by id.
Check out the API docs for this endpoint <a href="https://resource-watch.github.io/doc-api/index-rw.html#how-to-get-a-dataset-by-id">here</a></p>
</dd>
<dt><a href="#fetchDatasetTags">fetchDatasetTags</a> ⇒ <code>Object</code></dt>
<dd><p>Get dataset tags.
Check out the API docs for this endpoint <a href="https://resource-watch.github.io/doc-api/index-rw.html#getting-vocabularies-associated-to-a-resource">here</a></p>
</dd>
<dt><a href="#deleteDataset">deleteDataset</a> ⇒ <code>Object</code></dt>
<dd><p>Deletes a specified dataset.
This fetch needs authentication.
Check out the API docs for this endpoint <a href="https://resource-watch.github.io/doc-api/index-rw.html#deleting-a-dataset">here</a></p>
</dd>
<dt><a href="#createDataset">createDataset</a> ⇒ <code>Object</code></dt>
<dd><p>Create a Dataset.
Check out the API docs for this endpoint <a href="https://resource-watch.github.io/doc-api/index-rw.html#creating-a-dataset">here</a></p>
</dd>
<dt><a href="#updateDataset">updateDataset</a> ⇒ <code>Object</code></dt>
<dd><p>Update a Dataset.
Check out the API docs for this endpoint <a href="https://resource-watch.github.io/doc-api/index-rw.html#updating-a-dataset">here</a></p>
</dd>
<dt><a href="#updateDatasetTags">updateDatasetTags</a> ⇒ <code>Object</code></dt>
<dd><p>Update dataset tags.
Check out the API docs for this endpoint <a href="https://resource-watch.github.io/doc-api/index-rw.html#updating-an-existing-vocabulary-resource-relationship">here</a></p>
</dd>
<dt><a href="#createMetadata">createMetadata</a> ⇒ <code>Object</code></dt>
<dd><p>Creates a metadata object in the specified dataset.
This methods requires authentication.
Check out the API docs for this endpoint <a href="https://resource-watch.github.io/doc-api/index-rw.html#creating-a-metadata-object">here</a></p>
</dd>
<dt><a href="#updateMetadata">updateMetadata</a> ⇒ <code>Object</code></dt>
<dd><p>Updates a metadata object in the specified dataset.
This methods requires authentication.
Check out the API docs for this endpoint <a href="https://resource-watch.github.io/doc-api/index-rw.html#updating-a-metadata">here</a></p>
</dd>
<dt><a href="#fetchFavourites">fetchFavourites</a></dt>
<dd><p>Retrieve all favourites items of the user
Check out the API docs for this endpoint <a href="https://resource-watch.github.io/doc-api/index-rw.html#get-favorites">here</a></p>
</dd>
<dt><a href="#createFavourite">createFavourite</a></dt>
<dd><p>Creates a new favourite item attached to the current user
Check out the API docs for this endpoint <a href="https://resource-watch.github.io/doc-api/index-rw.html#create-favorite">here</a></p>
</dd>
<dt><a href="#deleteFavourite">deleteFavourite</a></dt>
<dd><p>Deletes an existing favourite item attached to the current user
Check out the API docs for this endpoint <a href="https://resource-watch.github.io/doc-api/index-rw.html#delete-favorite">here</a></p>
</dd>
<dt><a href="#fetchFields">fetchFields</a> ⇒ <code>Object</code></dt>
<dd><p>Fetches fields for a specific dataset.
Check out the API docs for this endpoint <a href="https://resource-watch.github.io/doc-api/index-rw.html#fields">here</a></p>
</dd>
<dt><a href="#fetchGeostore">fetchGeostore</a> ⇒ <code>Object</code></dt>
<dd><p>Fetches Geostore
Check out the API docs for this endpoint <a href="https://resource-watch.github.io/doc-api/index-rw.html#obtain-a-geostore">here</a></p>
</dd>
<dt><a href="#createGeostore">createGeostore</a></dt>
<dd><p>Create a Geostore
Check out the API docs for this endpoint <a href="https://resource-watch.github.io/doc-api/index-rw.html#create-geostore">here</a></p>
</dd>
<dt><a href="#fetchCountries">fetchCountries</a> ⇒ <code>Array.&lt;Object&gt;</code></dt>
<dd><p>Fetch countries
Check out the API docs for this endpoint <a href="https://resource-watch.github.io/doc-api/index-rw.html#geostore">here</a></p>
</dd>
<dt><a href="#fetchCountry">fetchCountry</a></dt>
<dd><p>Get country</p>
</dd>
<dt><a href="#fetchAllTags">fetchAllTags</a></dt>
<dd><p>Get all tags.
Check out the API docs for this endpoint <a href="https://resource-watch.github.io/doc-api/index-rw.html#list-concepts">here</a></p>
</dd>
<dt><a href="#fetchInferredTags">fetchInferredTags</a></dt>
<dd><p>Get inferred tags.
Check out the API docs for this endpoint <a href="https://resource-watch.github.io/doc-api/index-rw.html#get-inferred-concepts">here</a></p>
</dd>
<dt><a href="#countDatasetView">countDatasetView</a></dt>
<dd><p>Send a request to count a view to the dataset.
Check out the API docs for this endpoint <a href="https://resource-watch.github.io/doc-api/index-rw.html#count-dataset-view">here</a></p>
</dd>
<dt><a href="#fetchMostViewedDatasets">fetchMostViewedDatasets</a> ⇒ <code>Promise.&lt;Array.&lt;string&gt;&gt;</code></dt>
<dd><p>Get the list of most viewed datasets.
Check out the API docs for this endpoint <a href="https://resource-watch.github.io/doc-api/index-rw.html#most-viewed-datasets">here</a></p>
</dd>
<dt><a href="#fetchMostFavoritedDatasets">fetchMostFavoritedDatasets</a></dt>
<dd><p>Get the list of most favourited datasets.
Check out the API docs for this endpoint <a href="https://resource-watch.github.io/doc-api/index-rw.html#most-liked-datasets">here</a></p>
</dd>
<dt><a href="#fetchSimilarDatasets">fetchSimilarDatasets</a></dt>
<dd><p>Fetch similar datasets.
Check out the API docs for this endpoint <a href="https://resource-watch.github.io/doc-api/index-rw.html#similar-datasets-including-ancestors">here</a></p>
</dd>
<dt><a href="#fetchLayers">fetchLayers</a> ⇒ <code>Array.&lt;Object&gt;</code></dt>
<dd><p>Fetchs layers according to params.
Check out the API docs for this endpoint <a href="https://resource-watch.github.io/doc-api/index-rw.html#how-obtain-all-layers">here</a></p>
</dd>
<dt><a href="#fetchLayer">fetchLayer</a> ⇒ <code>Array.&lt;Object&gt;</code></dt>
<dd><p>Fetches a layer according to widget id and params.
Check out the API docs for this endpoint <a href="https://resource-watch.github.io/doc-api/index-rw.html#how-obtain-specific-layers">here</a></p>
</dd>
<dt><a href="#deleteLayer">deleteLayer</a> ⇒ <code>Object</code></dt>
<dd><p>Deletes a specified layer.
This fetch needs authentication.
Check out the API docs for this endpoint <a href="https://resource-watch.github.io/doc-api/index-rw.html#delete-a-layer">here</a></p>
</dd>
<dt><a href="#fetchPartners">fetchPartners</a> ⇒ <code>Array.&lt;Object&gt;</code></dt>
<dd><p>Fetchs partners according to params.</p>
</dd>
<dt><a href="#fetchPartner">fetchPartner</a> ⇒ <code>Object</code></dt>
<dd><p>fetchs data for a specific partnet.</p>
</dd>
<dt><a href="#fetchQuery">fetchQuery</a></dt>
<dd><p>Send GET request to /query
Check out the API docs for this endpoint <a href="https://resource-watch.github.io/doc-api/index-rw.html#query">here</a></p>
</dd>
<dt><a href="#fetchStaticPage">fetchStaticPage</a> ⇒ <code>Array.&lt;Object&gt;</code></dt>
<dd><p>Fetchs content of a specific page.</p>
</dd>
<dt><a href="#fetchSubscriptions">fetchSubscriptions</a></dt>
<dd><p>Get Subscriptions
Check out the API docs for this endpoint <a href="https://resource-watch.github.io/doc-api/index-rw.html#obtain-the-subscriptions-for-a-user">here</a></p>
</dd>
<dt><a href="#createSubscriptionToArea">createSubscriptionToArea</a></dt>
<dd><p>Creates a subscription for an area
Check out the API docs for this endpoint <a href="https://resource-watch.github.io/doc-api/index-rw.html#with-an-area">here</a></p>
</dd>
<dt><a href="#updateSubscriptionToArea">updateSubscriptionToArea</a></dt>
<dd><p>Update Subscription
Check out the API docs for this endpoint <a href="https://resource-watch.github.io/doc-api/index-rw.html#modify-subscription">here</a></p>
</dd>
<dt><a href="#fetchSubscription">fetchSubscription</a></dt>
<dd><p>Get Subscription
Check out the API docs for this endpoint <a href="https://resource-watch.github.io/doc-api/index-rw.html#get-a-subscription-by-its-id">here</a></p>
</dd>
<dt><a href="#deleteSubscription">deleteSubscription</a> ⇒ <code>Promise</code></dt>
<dd><p>Deletes a subscription
Check out the API docs for this endpoint <a href="https://resource-watch.github.io/doc-api/index-rw.html#delete-subscription">here</a></p>
</dd>
<dt><a href="#fetchTool">fetchTool</a> ⇒ <code>Array.&lt;Object&gt;</code></dt>
<dd><p>Fetchs a specific tool.</p>
</dd>
<dt><a href="#fetchTopics">fetchTopics</a> ⇒ <code>Array.&lt;Object&gt;</code></dt>
<dd><p>Fetches topics according to params.
Check out the API docs for this endpoint <a href="https://resource-watch.github.io/doc-api/index-rw.html#getting-all-topics">here</a></p>
</dd>
<dt><a href="#fetchTopic">fetchTopic</a> ⇒ <code>Object</code></dt>
<dd><p>Fetches data for a specific topic.
Check out the API docs for this endpoint <a href="https://resource-watch.github.io/doc-api/index-rw.html#getting-all-topics">here</a></p>
</dd>
<dt><a href="#createTopic">createTopic</a> ⇒ <code>Object</code></dt>
<dd><p>Creates a topic with the provided data.
This fetch needs authentication.
Check out the API docs for this endpoint <a href="https://resource-watch.github.io/doc-api/index-rw.html#topic">here</a></p>
</dd>
<dt><a href="#updateTopic">updateTopic</a> ⇒ <code>Object</code></dt>
<dd><p>Updates a specified topic with the provided data.
This fetch needs authentication.
Check out the API docs for this endpoint <a href="https://resource-watch.github.io/doc-api/index-rw.html#topic">here</a></p>
</dd>
<dt><a href="#deleteTopic">deleteTopic</a> ⇒ <code>Object</code></dt>
<dd><p>Deletes a specified topic.
This fetch needs authentication.
Check out the API docs for this endpoint <a href="https://resource-watch.github.io/doc-api/index-rw.html#topic">here</a></p>
</dd>
<dt><a href="#loginUser">loginUser</a> ⇒ <code>Object</code></dt>
<dd><p>Logs in a user based on the email + password combination
Check out the API docs for this endpoint <a href="https://resource-watch.github.io/doc-api/index-rw.html#login-email-password">here</a></p>
</dd>
<dt><a href="#forgotPassword">forgotPassword</a> ⇒ <code>Object</code></dt>
<dd><p>This function sends a request to reset the user&#39;s password.
It generates a token to be used in resetPassword
Check out the API docs for this endpoint <a href="https://resource-watch.github.io/doc-api/index-rw.html#password-recovery">here</a></p>
</dd>
<dt><a href="#registerUser">registerUser</a> ⇒ <code>Object</code></dt>
<dd><p>Register a new user based on the email + password combination
Check out the API docs for this endpoint <a href="https://resource-watch.github.io/doc-api/index-rw.html#registration">here</a></p>
</dd>
<dt><a href="#resetPassword">resetPassword</a> ⇒ <code>Object</code></dt>
<dd><p>Resets the user&#39;s password.
Needs the token hosted in the email sent in forgotPassword
NOTE:this is NOT implemented in the API to be done from the app.
right now the only way it&#39;s through the email link pointing to Control Tower.
Check out the API docs for this endpoint <a href="https://resource-watch.github.io/doc-api/index-rw.html#password-recovery">here</a></p>
</dd>
<dt><a href="#uploadPhoto">uploadPhoto</a></dt>
<dd><p>Upload user photo</p>
</dd>
<dt><a href="#fetchWidgets">fetchWidgets</a></dt>
<dd><p>Fetch widgets according to params.
Check out the API docs for this endpoint <a href="https://resource-watch.github.io/doc-api/index-rw.html#how-to-obtain-all-widgets">here</a></p>
</dd>
<dt><a href="#fetchWidget">fetchWidget</a></dt>
<dd><p>Fetches data for a specific widget.
Check out the API docs for this endpoint <a href="https://resource-watch.github.io/doc-api/index-rw.html#how-obtain-a-single-widget">here</a></p>
</dd>
<dt><a href="#deleteWidget">deleteWidget</a></dt>
<dd><p>Deletes a specified widget.
This fetch needs authentication.
Check out the API docs for this endpoint <a href="https://resource-watch.github.io/doc-api/index-rw.html#delete-a-widget">here</a></p>
</dd>
<dt><a href="#updateWidget">updateWidget</a></dt>
<dd><p>Updates data for the widget provided.
Check out the API docs for this endpoint <a href="https://resource-watch.github.io/doc-api/index-rw.html#update-a-widget">here</a></p>
</dd>
<dt><a href="#createWidget">createWidget</a></dt>
<dd><p>Creates a new widget.
Check out the API docs for this endpoint <a href="https://resource-watch.github.io/doc-api/index-rw.html#create-a-widget">here</a></p>
</dd>
<dt><a href="#fetchWidgetMetadata">fetchWidgetMetadata</a></dt>
<dd><p>Fetches the metadata associated to the widget provided.
Check out the API docs for this endpoint <a href="https://resource-watch.github.io/doc-api/index-rw.html#getting-metadata">here</a></p>
</dd>
<dt><a href="#updateWidgetMetadata">updateWidgetMetadata</a></dt>
<dd><p>Updates the metadata for the widget provided.
Check out the API docs for this endpoint <a href="https://resource-watch.github.io/doc-api/index-rw.html#updating-a-metadata">here</a></p>
</dd>
<dt><a href="#createWidgetMetadata">createWidgetMetadata</a></dt>
<dd><p>Creates the metadata for the widget provided.
Check out the API docs for this endpoint <a href="https://resource-watch.github.io/doc-api/index-rw.html#creating-a-metadata-object">here</a></p>
</dd>
</dl>

## Functions

<dl>
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

## fetchArea ⇒ <code>Object</code>
Get area.
Check out the API docs for this endpoint [here](https://resource-watch.github.io/doc-api/index-rw.html#get-area)

**Kind**: global constant  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>String</code> | Area id. |
| params | <code>Object</code> | Request paremeters. |
| headers | <code>Object</code> | Request headers. |

<a name="fetchUserAreas"></a>

## fetchUserAreas ⇒ <code>Object</code>
Get user areas.
Check out the API docs for this endpoint [here](https://resource-watch.github.io/doc-api/index-rw.html#get-user-areas)

**Kind**: global constant  

| Param | Type | Description |
| --- | --- | --- |
| token | <code>String</code> | user's token. |

<a name="deleteArea"></a>

## deleteArea ⇒ <code>Promise</code>
Deletes an area
Check out the API docs for this endpoint [here](https://resource-watch.github.io/doc-api/index-rw.html#delete-area)

**Kind**: global constant  

| Param | Type | Description |
| --- | --- | --- |
| areaId | <code>String</code> | ID of the area that will be deleted |
| token | <code>String</code> | User token |

<a name="createArea"></a>

## createArea ⇒ <code>Object</code>
Create new area.
Check out the API docs for this endpoint [here](https://resource-watch.github.io/doc-api/index-rw.html#create-area)

**Kind**: global constant  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>String</code> |  |
| geostore | <code>String</code> | Geostore ID |
| token | <code>String</code> | user's token |

<a name="updateArea"></a>

## updateArea ⇒ <code>Object</code>
Update area.
Check out the API docs for this endpoint [here](https://resource-watch.github.io/doc-api/index-rw.html#areas)

**Kind**: global constant  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>String</code> |  |
| name | <code>String</code> | Name of the new area |
| token | <code>String</code> | user's token. |
| geostore | <code>String</code> | Geostore ID |

<a name="fetchPosts"></a>

## fetchPosts ⇒ <code>Array.&lt;Object&gt;</code>
Fetchs posts from wordpress API.

**Kind**: global constant  
**Returns**: <code>Array.&lt;Object&gt;</code> - array of parsed posts.  

| Param | Type | Description |
| --- | --- | --- |
| params | <code>Object</code> | params sent to the API. |
| headers | <code>Object</code> | headers sent to the API. |

<a name="fetchAllCollections"></a>

## fetchAllCollections
Retrieve all collections from a user
Check out the API docs for this endpoint [here](https://resource-watch.github.io/doc-api/index-rw.html#get-collections)

**Kind**: global constant  

| Param | Type | Description |
| --- | --- | --- |
| token | <code>String</code> | User's token |
| params | <code>Object</code> | Request optional parameters |

<a name="fetchCollection"></a>

## fetchCollection
Retrieve a specific collection
Check out the API docs for this endpoint [here](https://resource-watch.github.io/doc-api/index-rw.html#get-collection-by-id)

**Kind**: global constant  

| Param | Type | Description |
| --- | --- | --- |
| token | <code>String</code> | User's token |
| collectionId | <code>String</code> | Id of the collection we are asking for. |
| params | <code>Object</code> | Request parameters |

<a name="createCollection"></a>

## createCollection
Create a new collection associated to the authenticated user
Check out the API docs for this endpoint [here](https://resource-watch.github.io/doc-api/index-rw.html#create-collection)

**Kind**: global constant  

| Param | Type | Description |
| --- | --- | --- |
| token | <code>String</code> | User's token |
| data | <code>Object</code> | collection data |

<a name="deleteCollection"></a>

## deleteCollection
Delete an existing collection associated to the authenticated user
Check out the API docs for this endpoint [here](https://resource-watch.github.io/doc-api/index-rw.html#delete-collection)

**Kind**: global constant  

| Param | Type | Description |
| --- | --- | --- |
| token | <code>String</code> | User's token |
| collectionId | <code>String</code> | Id of the collection to be removed |

<a name="updateCollection"></a>

## updateCollection
Update an existing collection associataed to the authenticated user
Check out the API docs for this endpoint [here](https://resource-watch.github.io/doc-api/index-rw.html#update-collection)

**Kind**: global constant  

| Param | Type | Description |
| --- | --- | --- |
| token | <code>String</code> | User's token |
| collectionId | <code>String</code> | Id of the collection to be edited |
| data | <code>Object</code> | Data to be updated |

<a name="addResourceToCollection"></a>

## addResourceToCollection
Add a resource to the collection
Check out the API docs for this endpoint [here](https://resource-watch.github.io/doc-api/index-rw.html#add-resource-to-collection)

**Kind**: global constant  

| Param | Type | Description |
| --- | --- | --- |
| token | <code>String</code> | User's token |
| collectionId | <code>String</code> | Id of the collection to be edited |
| resource | <code>Object</code> | Resource to be addded to the collection |

<a name="removeResourceFromCollection"></a>

## removeResourceFromCollection
Remove resource from collection
Check out the API docs for this endpoint [here](https://resource-watch.github.io/doc-api/index-rw.html#delete-collection-resource)

**Kind**: global constant  

| Param | Type | Description |
| --- | --- | --- |
| token | <code>String</code> | User's token |
| collectionId | <code>String</code> | Id of the collection to be edited |
| resource | <code>Object</code> | Resource to be removed from the collection |

<a name="contactUs"></a>

## contactUs ⇒ <code>Promise</code>
Sends a contact form including a topic, email address, and a message.
Check out the API docs for this endpoint [here](https://resource-watch.github.io/doc-api/index-rw.html#contact-us)

**Kind**: global constant  

| Param | Type | Description |
| --- | --- | --- |
| params | <code>Object</code> | Request paremeters to API. |

<a name="fetchDashboards"></a>

## fetchDashboards ⇒ <code>Array.&lt;Object&gt;</code>
Fetchs dashboards according to params.
Check out the API docs for this endpoint [here](https://resource-watch.github.io/doc-api/index-rw.html#getting-all-dashboards)

**Kind**: global constant  
**Returns**: <code>Array.&lt;Object&gt;</code> - array of serialized dashboards.  

| Param | Type | Description |
| --- | --- | --- |
| params | <code>Object</code> | Request paremeters to API. |
| headers | <code>Object</code> | Request headers to API. |

<a name="fetchDashboard"></a>

## fetchDashboard ⇒ <code>Object</code>
fetchs data for a specific dashboard.
Check out the API docs for this endpoint [here](https://resource-watch.github.io/doc-api/index-rw.html#getting-a-dashboard-by-its-id)

**Kind**: global constant  
**Returns**: <code>Object</code> - serialized specified dashboard.  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>String</code> | dashboard id. |

<a name="createDashboard"></a>

## createDashboard ⇒ <code>Object</code>
Creates a dashboard with the provided data.
This fetch needs authentication.
Check out the API docs for this endpoint [here](https://resource-watch.github.io/doc-api/index-rw.html#creating-a-dashboard)

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
Check out the API docs for this endpoint [here](https://resource-watch.github.io/doc-api/index-rw.html#editing-a-dashboard)

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
Check out the API docs for this endpoint [here](https://resource-watch.github.io/doc-api/index-rw.html#delete-dashboard)

**Kind**: global constant  
**Returns**: <code>Object</code> - fetch response.  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>String</code> | dashboard ID to be deleted. |
| token | <code>String</code> | user's token. |

<a name="cloneDashboard"></a>

## cloneDashboard ⇒ <code>Object</code>
Clones a topic to convert it into a dashboard based on topic's data.
This fetch needs authentication.
Check out the API docs for this endpoint [here](https://resource-watch.github.io/doc-api/index-rw.html#clone-dashboard)

**Kind**: global constant  
**Returns**: <code>Object</code> - serialized dashboard cloned based on the ID topic.  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>String</code> | topic ID to be cloned. |
| token | <code>String</code> | user's token. |

<a name="fetchDatasets"></a>

## fetchDatasets ⇒ <code>Array</code>
Fetchs datasets according to params.
Check out the API docs for this endpoint [here](https://resource-watch.github.io/doc-api/index-rw.html#getting-all-datasets)

**Kind**: global constant  
**Returns**: <code>Array</code> - Array of serialized datasets.
be included in the response or not.  

| Param | Type | Description |
| --- | --- | --- |
| params | <code>Object</code> | Request paremeters. |
| headers | <code>Object</code> | Request headers. |
| _meta | <code>boolean</code> | Boolean flag indicating whether the meta object should |

<a name="fetchDataset"></a>

## fetchDataset ⇒ <code>Object</code>
Fetches a dataset by id.
Check out the API docs for this endpoint [here](https://resource-watch.github.io/doc-api/index-rw.html#how-to-get-a-dataset-by-id)

**Kind**: global constant  
**Returns**: <code>Object</code> - serialized specified dataset.  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>String</code> | dataset id. |
| params | <code>Object</code> | params sent to the API. |

<a name="fetchDatasetTags"></a>

## fetchDatasetTags ⇒ <code>Object</code>
Get dataset tags.
Check out the API docs for this endpoint [here](https://resource-watch.github.io/doc-api/index-rw.html#getting-vocabularies-associated-to-a-resource)

**Kind**: global constant  

| Param | Type | Description |
| --- | --- | --- |
| datasetId | <code>String</code> | dataset id. |
| params | <code>Object</code> | params sent to the API. |

<a name="deleteDataset"></a>

## deleteDataset ⇒ <code>Object</code>
Deletes a specified dataset.
This fetch needs authentication.
Check out the API docs for this endpoint [here](https://resource-watch.github.io/doc-api/index-rw.html#deleting-a-dataset)

**Kind**: global constant  
**Returns**: <code>Object</code> - fetch response.  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>String</code> | dataset ID to be deleted. |
| token | <code>String</code> | user's token. |

<a name="createDataset"></a>

## createDataset ⇒ <code>Object</code>
Create a Dataset.
Check out the API docs for this endpoint [here](https://resource-watch.github.io/doc-api/index-rw.html#creating-a-dataset)

**Kind**: global constant  

| Param | Type | Description |
| --- | --- | --- |
| token | <code>String</code> | user's token. |
| params | <code>Object</code> | params sent to the API. |
| headers | <code>Object</code> | headers sent to the API. |

<a name="updateDataset"></a>

## updateDataset ⇒ <code>Object</code>
Update a Dataset.
Check out the API docs for this endpoint [here](https://resource-watch.github.io/doc-api/index-rw.html#updating-a-dataset)

**Kind**: global constant  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>String</code> | dataset id. |
| token | <code>String</code> | user's token. |
| params | <code>Object</code> | params sent to the API. |

<a name="updateDatasetTags"></a>

## updateDatasetTags ⇒ <code>Object</code>
Update dataset tags.
Check out the API docs for this endpoint [here](https://resource-watch.github.io/doc-api/index-rw.html#updating-an-existing-vocabulary-resource-relationship)

**Kind**: global constant  

| Param | Type | Description |
| --- | --- | --- |
| datasetId | <code>String</code> | dataset id. |
| tags | <code>Array.&lt;Object&gt;</code> | user's token. |
| token | <code>String</code> | user's token. |
| usePatch | <code>boolean</code> | user's token. |

<a name="createMetadata"></a>

## createMetadata ⇒ <code>Object</code>
Creates a metadata object in the specified dataset.
This methods requires authentication.
Check out the API docs for this endpoint [here](https://resource-watch.github.io/doc-api/index-rw.html#creating-a-metadata-object)

**Kind**: global constant  
**Returns**: <code>Object</code> - serialized metadata object.  

| Param | Type | Description |
| --- | --- | --- |
| datasetId | <code>String</code> | dataset ID where the metadata will be attached |
| params | <code>Object</code> | metadata object |
| token | <code>String</code> | user's token. |

<a name="updateMetadata"></a>

## updateMetadata ⇒ <code>Object</code>
Updates a metadata object in the specified dataset.
This methods requires authentication.
Check out the API docs for this endpoint [here](https://resource-watch.github.io/doc-api/index-rw.html#updating-a-metadata)

**Kind**: global constant  
**Returns**: <code>Object</code> - serialized metadata object.  

| Param | Type | Description |
| --- | --- | --- |
| datasetId | <code>String</code> | dataset ID where the metadata will be attached |
| params | <code>Object</code> | metadata object |
| token | <code>String</code> | user's token. |

<a name="fetchFavourites"></a>

## fetchFavourites
Retrieve all favourites items of the user
Check out the API docs for this endpoint [here](https://resource-watch.github.io/doc-api/index-rw.html#get-favorites)

**Kind**: global constant  

| Param | Type | Description |
| --- | --- | --- |
| token | <code>String</code> | User's token |

<a name="createFavourite"></a>

## createFavourite
Creates a new favourite item attached to the current user
Check out the API docs for this endpoint [here](https://resource-watch.github.io/doc-api/index-rw.html#create-favorite)

**Kind**: global constant  

| Param | Type | Description |
| --- | --- | --- |
| token | <code>String</code> | User's token |
| options | <code>Object</code> | resourceId - Id of the resource, resourceType - resource's type (can be dataset, layer or widget) |

<a name="deleteFavourite"></a>

## deleteFavourite
Deletes an existing favourite item attached to the current user
Check out the API docs for this endpoint [here](https://resource-watch.github.io/doc-api/index-rw.html#delete-favorite)

**Kind**: global constant  

| Param | Type | Description |
| --- | --- | --- |
| token | <code>String</code> | User's token |
| resourceId | <code>String</code> | Id of the resource |

<a name="fetchFields"></a>

## fetchFields ⇒ <code>Object</code>
Fetches fields for a specific dataset.
Check out the API docs for this endpoint [here](https://resource-watch.github.io/doc-api/index-rw.html#fields)

**Kind**: global constant  
**Returns**: <code>Object</code> - array of dataset fields.  

| Param | Type | Description |
| --- | --- | --- |
| url | <code>String</code> | URL to get fields. |

<a name="fetchGeostore"></a>

## fetchGeostore ⇒ <code>Object</code>
Fetches Geostore
Check out the API docs for this endpoint [here](https://resource-watch.github.io/doc-api/index-rw.html#obtain-a-geostore)

**Kind**: global constant  
**Returns**: <code>Object</code> - serialized geostore object.  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>String</code> | geostore ID. |

<a name="createGeostore"></a>

## createGeostore
Create a Geostore
Check out the API docs for this endpoint [here](https://resource-watch.github.io/doc-api/index-rw.html#create-geostore)

**Kind**: global constant  

| Param | Type | Description |
| --- | --- | --- |
| geojson | <code>Object</code> | Geojson with your geometry |

<a name="fetchCountries"></a>

## fetchCountries ⇒ <code>Array.&lt;Object&gt;</code>
Fetch countries
Check out the API docs for this endpoint [here](https://resource-watch.github.io/doc-api/index-rw.html#geostore)

**Kind**: global constant  
<a name="fetchCountry"></a>

## fetchCountry
Get country

**Kind**: global constant  

| Param | Type |
| --- | --- |
| iso | <code>String</code> | 

<a name="fetchAllTags"></a>

## fetchAllTags
Get all tags.
Check out the API docs for this endpoint [here](https://resource-watch.github.io/doc-api/index-rw.html#list-concepts)

**Kind**: global constant  

| Param | Type | Description |
| --- | --- | --- |
| params | <code>Object</code> | Request parameters to API. |

<a name="fetchInferredTags"></a>

## fetchInferredTags
Get inferred tags.
Check out the API docs for this endpoint [here](https://resource-watch.github.io/doc-api/index-rw.html#get-inferred-concepts)

**Kind**: global constant  

| Param | Type | Description |
| --- | --- | --- |
| params | <code>Object</code> | Request parameters to API. |

<a name="countDatasetView"></a>

## countDatasetView
Send a request to count a view to the dataset.
Check out the API docs for this endpoint [here](https://resource-watch.github.io/doc-api/index-rw.html#count-dataset-view)

**Kind**: global constant  

| Param | Type | Description |
| --- | --- | --- |
| datasetId | <code>String</code> | Dataset ID |
| token | <code>String</code> | User token |
| params | <code>Object</code> | Request parameters to API. |

<a name="fetchMostViewedDatasets"></a>

## fetchMostViewedDatasets ⇒ <code>Promise.&lt;Array.&lt;string&gt;&gt;</code>
Get the list of most viewed datasets.
Check out the API docs for this endpoint [here](https://resource-watch.github.io/doc-api/index-rw.html#most-viewed-datasets)

**Kind**: global constant  
**Returns**: <code>Promise.&lt;Array.&lt;string&gt;&gt;</code> - List of sorted ids  

| Param | Type | Description |
| --- | --- | --- |
| params | <code>Object</code> | Request parameters to API. |

<a name="fetchMostFavoritedDatasets"></a>

## fetchMostFavoritedDatasets
Get the list of most favourited datasets.
Check out the API docs for this endpoint [here](https://resource-watch.github.io/doc-api/index-rw.html#most-liked-datasets)

**Kind**: global constant  

| Param | Type | Description |
| --- | --- | --- |
| params | <code>Object</code> | Request parameters to API. |

<a name="fetchSimilarDatasets"></a>

## fetchSimilarDatasets
Fetch similar datasets.
Check out the API docs for this endpoint [here](https://resource-watch.github.io/doc-api/index-rw.html#similar-datasets-including-ancestors)

**Kind**: global constant  

| Param | Type | Description |
| --- | --- | --- |
| params | <code>Object</code> | Request parameters to API. |
| withAncestors | <code>boolean</code> | Flag indicating whether tags' ancestors should be considered or not |

<a name="fetchLayers"></a>

## fetchLayers ⇒ <code>Array.&lt;Object&gt;</code>
Fetchs layers according to params.
Check out the API docs for this endpoint [here](https://resource-watch.github.io/doc-api/index-rw.html#how-obtain-all-layers)

**Kind**: global constant  
**Returns**: <code>Array.&lt;Object&gt;</code> - array of serialized layers.  

| Param | Type | Description |
| --- | --- | --- |
| params | <code>Object</code> | params sent to the API. |
| headers | <code>Object</code> | headers sent to the API. |
| _meta | <code>boolean</code> | should meta be in response or not |

<a name="fetchLayer"></a>

## fetchLayer ⇒ <code>Array.&lt;Object&gt;</code>
Fetches a layer according to widget id and params.
Check out the API docs for this endpoint [here](https://resource-watch.github.io/doc-api/index-rw.html#how-obtain-specific-layers)

**Kind**: global constant  
**Returns**: <code>Array.&lt;Object&gt;</code> - - serialized specific layer.  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>String</code> | layer id. |
| params | <code>Object</code> | params sent to the API. |

<a name="deleteLayer"></a>

## deleteLayer ⇒ <code>Object</code>
Deletes a specified layer.
This fetch needs authentication.
Check out the API docs for this endpoint [here](https://resource-watch.github.io/doc-api/index-rw.html#delete-a-layer)

**Kind**: global constant  
**Returns**: <code>Object</code> - fetch response.  

| Param | Type | Description |
| --- | --- | --- |
| layerId | <code>String</code> | layer ID to be deleted. |
| datasetId | <code>String</code> | dataset ID to be deleted. |
| token | <code>String</code> | user's token. |

<a name="fetchPartners"></a>

## fetchPartners ⇒ <code>Array.&lt;Object&gt;</code>
Fetchs partners according to params.

**Kind**: global constant  
**Returns**: <code>Array.&lt;Object&gt;</code> - array of serialized partners.  

| Param | Type | Description |
| --- | --- | --- |
| params | <code>Object</code> | params sent to the API. |

<a name="fetchPartner"></a>

## fetchPartner ⇒ <code>Object</code>
fetchs data for a specific partnet.

**Kind**: global constant  
**Returns**: <code>Object</code> - serialized specified partnet.  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>String</code> | partnet id. |

<a name="fetchQuery"></a>

## fetchQuery
Send GET request to /query
Check out the API docs for this endpoint [here](https://resource-watch.github.io/doc-api/index-rw.html#query)

**Kind**: global constant  

| Param | Type | Description |
| --- | --- | --- |
| token | <code>String</code> | token User's token |
| sql | <code>\*</code> | mandatory parameter |
| params | <code>Object</code> | request paremeters to API. |

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
Check out the API docs for this endpoint [here](https://resource-watch.github.io/doc-api/index-rw.html#obtain-the-subscriptions-for-a-user)

**Kind**: global constant  

| Param | Type | Description |
| --- | --- | --- |
| token | <code>String</code> | User's token |
| params | <code>Object</code> | request paremeters to API. |

<a name="createSubscriptionToArea"></a>

## createSubscriptionToArea
Creates a subscription for an area
Check out the API docs for this endpoint [here](https://resource-watch.github.io/doc-api/index-rw.html#with-an-area)

**Kind**: global constant  

| Param | Type |
| --- | --- |
| options | <code>Object</code> | 

<a name="updateSubscriptionToArea"></a>

## updateSubscriptionToArea
Update Subscription
Check out the API docs for this endpoint [here](https://resource-watch.github.io/doc-api/index-rw.html#modify-subscription)

**Kind**: global constant  

| Param | Type |
| --- | --- |
| subscriptionId | <code>String</code> | 
| datasets | <code>\*</code> | 
| datasetsQuery | <code>\*</code> | 
| user | <code>Object</code> | 
| language | <code>String</code> | 
| areaId | <code>String</code> | 

<a name="fetchSubscription"></a>

## fetchSubscription
Get Subscription
Check out the API docs for this endpoint [here](https://resource-watch.github.io/doc-api/index-rw.html#get-a-subscription-by-its-id)

**Kind**: global constant  

| Param | Type | Description |
| --- | --- | --- |
| subscriptionId | <code>String</code> |  |
| token | <code>String</code> | User's token |

<a name="deleteSubscription"></a>

## deleteSubscription ⇒ <code>Promise</code>
Deletes a subscription
Check out the API docs for this endpoint [here](https://resource-watch.github.io/doc-api/index-rw.html#delete-subscription)

**Kind**: global constant  

| Param | Type | Description |
| --- | --- | --- |
| subscriptionId | <code>String</code> | of the subscription that will be deleted |
| token | <code>Strign</code> | User's token |

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
Check out the API docs for this endpoint [here](https://resource-watch.github.io/doc-api/index-rw.html#getting-all-topics)

**Kind**: global constant  
**Returns**: <code>Array.&lt;Object&gt;</code> - array of serialized topics.  

| Param | Type | Description |
| --- | --- | --- |
| params | <code>Object</code> | params sent to the API. |
| headers- | <code>Object</code> | headers sent to the API. |

<a name="fetchTopic"></a>

## fetchTopic ⇒ <code>Object</code>
Fetches data for a specific topic.
Check out the API docs for this endpoint [here](https://resource-watch.github.io/doc-api/index-rw.html#getting-all-topics)

**Kind**: global constant  
**Returns**: <code>Object</code> - serialized specified topic.  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>String</code> | topic id. |

<a name="createTopic"></a>

## createTopic ⇒ <code>Object</code>
Creates a topic with the provided data.
This fetch needs authentication.
Check out the API docs for this endpoint [here](https://resource-watch.github.io/doc-api/index-rw.html#topic)

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
Check out the API docs for this endpoint [here](https://resource-watch.github.io/doc-api/index-rw.html#topic)

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
Check out the API docs for this endpoint [here](https://resource-watch.github.io/doc-api/index-rw.html#topic)

**Kind**: global constant  
**Returns**: <code>Object</code> - fetch response.  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>String</code> | topic ID to be deleted. |
| token | <code>String</code> | user's token. |

<a name="loginUser"></a>

## loginUser ⇒ <code>Object</code>
Logs in a user based on the email + password combination
Check out the API docs for this endpoint [here](https://resource-watch.github.io/doc-api/index-rw.html#login-email-password)

**Kind**: global constant  

| Param | Type |
| --- | --- |
| options | <code>Object</code> | 

<a name="forgotPassword"></a>

## forgotPassword ⇒ <code>Object</code>
This function sends a request to reset the user's password.
It generates a token to be used in resetPassword
Check out the API docs for this endpoint [here](https://resource-watch.github.io/doc-api/index-rw.html#password-recovery)

**Kind**: global constant  

| Param | Type |
| --- | --- |
| options | <code>Object</code> | 

<a name="registerUser"></a>

## registerUser ⇒ <code>Object</code>
Register a new user based on the email + password combination
Check out the API docs for this endpoint [here](https://resource-watch.github.io/doc-api/index-rw.html#registration)

**Kind**: global constant  

| Param | Type |
| --- | --- |
| options | <code>Object</code> | 

<a name="resetPassword"></a>

## resetPassword ⇒ <code>Object</code>
Resets the user's password.
Needs the token hosted in the email sent in forgotPassword
NOTE:this is NOT implemented in the API to be done from the app.
right now the only way it's through the email link pointing to Control Tower.
Check out the API docs for this endpoint [here](https://resource-watch.github.io/doc-api/index-rw.html#password-recovery)

**Kind**: global constant  

| Param | Type |
| --- | --- |
| options | <code>Object</code> | 

<a name="uploadPhoto"></a>

## uploadPhoto
Upload user photo

**Kind**: global constant  

| Param | Type | Description |
| --- | --- | --- |
| file | <code>Blob</code> | file data |
| user | <code>Object</code> |  |

<a name="fetchWidgets"></a>

## fetchWidgets
Fetch widgets according to params.
Check out the API docs for this endpoint [here](https://resource-watch.github.io/doc-api/index-rw.html#how-to-obtain-all-widgets)

**Kind**: global constant  

| Param | Type | Description |
| --- | --- | --- |
| params | <code>Object</code> | params sent to the API. |
| headers | <code>Object</code> | headers used in the request |
| _meta | <code>boolean</code> | flag indicating whether meta information should be included in the response or not |

<a name="fetchWidget"></a>

## fetchWidget
Fetches data for a specific widget.
Check out the API docs for this endpoint [here](https://resource-watch.github.io/doc-api/index-rw.html#how-obtain-a-single-widget)

**Kind**: global constant  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>String</code> | widget id. |
| params | <code>Object</code> | params sent to the API. |

<a name="deleteWidget"></a>

## deleteWidget
Deletes a specified widget.
This fetch needs authentication.
Check out the API docs for this endpoint [here](https://resource-watch.github.io/doc-api/index-rw.html#delete-a-widget)

**Kind**: global constant  

| Param | Type | Description |
| --- | --- | --- |
| widgetId | <code>String</code> | widget ID to be deleted. |
| datasetId | <code>String</code> | dataset ID. |
| token | <code>String</code> | user's token. |

<a name="updateWidget"></a>

## updateWidget
Updates data for the widget provided.
Check out the API docs for this endpoint [here](https://resource-watch.github.io/doc-api/index-rw.html#update-a-widget)

**Kind**: global constant  

| Param | Type | Description |
| --- | --- | --- |
| widget | <code>Object</code> | widget data. |
| token | <code>string</code> | user's token. |

<a name="createWidget"></a>

## createWidget
Creates a new widget.
Check out the API docs for this endpoint [here](https://resource-watch.github.io/doc-api/index-rw.html#create-a-widget)

**Kind**: global constant  

| Param | Type | Description |
| --- | --- | --- |
| widget | <code>Object</code> | widget data. |
| datasetId | <code>string</code> | Dataset ID the widget belongs to. |
| token | <code>string</code> | user's token. |

<a name="fetchWidgetMetadata"></a>

## fetchWidgetMetadata
Fetches the metadata associated to the widget provided.
Check out the API docs for this endpoint [here](https://resource-watch.github.io/doc-api/index-rw.html#getting-metadata)

**Kind**: global constant  

| Param | Type | Description |
| --- | --- | --- |
| widgetId | <code>string</code> | widget data. |
| datasetId | <code>string</code> | Dataset ID the widget belongs to. |
| token | <code>string</code> | user's token. |
| params | <code>Object</code> | request parameters. |

<a name="updateWidgetMetadata"></a>

## updateWidgetMetadata
Updates the metadata for the widget provided.
Check out the API docs for this endpoint [here](https://resource-watch.github.io/doc-api/index-rw.html#updating-a-metadata)

**Kind**: global constant  

| Param | Type | Description |
| --- | --- | --- |
| widget | <code>Object</code> | widget data. |
| datasetId | <code>string</code> | Dataset ID the widget belongs to. |
| metadata | <code>Object</code> | metadata to be updated. |
| token | <code>string</code> | user's token. |

<a name="createWidgetMetadata"></a>

## createWidgetMetadata
Creates the metadata for the widget provided.
Check out the API docs for this endpoint [here](https://resource-watch.github.io/doc-api/index-rw.html#creating-a-metadata-object)

**Kind**: global constant  

| Param | Type | Description |
| --- | --- | --- |
| widgetId | <code>string</code> | widget id. |
| datasetId | <code>string</code> | Dataset ID the widget belongs to. |
| metadata | <code>Object</code> | metadata to be updated. |
| token | <code>string</code> | user's token. |

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

