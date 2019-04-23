import { SPHttpClient, SPHttpClientResponse, ISPHttpClientOptions, ISPHttpClientBatchOptions, ISPHttpClientBatchCreationOptions, SPHttpClientBatch } from '@microsoft/sp-http'; --UNCOMMENT AFTER
import { Context } from 'react'; 
import { WebPartContext } from '@microsoft/sp-webpart-base';
import { IODataList, IODataListItem } from '@microsoft/sp-odata-types'; 
import { escape } from '@microsoft/sp-lodash-subset';
require('jquery');
require('bootstrap');
require('popper.js');

export async function render5k(currentProps, currentState) {
  try {
    currentState._spItems = [];
    //_loadingSpinner(true, ": Matuto kang mag-intay paps...", currentProps); --UNCOMMENT AFTER
    var Items = []
    var intCount, intervalCount, batchCount = 0;
    var _xxxItems: {
      Title: string,
      Source: string,
      Transaction: string,
      EventDate: string,
      UserName: string,
    }[] = [];

    var nextCount = 0;
    intervalCount = 5000;
    let _requestUrl = "";
    _xxxItems = [];
    //count Items
    let _getitemCount = currentState.props.siteUrl.concat("/_api/web/Lists/GetByTitle('" + "<Your Target Library>" + "')/ItemCount")
    var jsonRequest_Count = await currentProps.spHttpClient.get(_getitemCount, SPHttpClient.configurations.v1); 
    if (!jsonRequest_Count.ok) {
      const responseText = await jsonRequest_Count.text();
      throw new Error(responseText + " || " + _getitemCount);
    };
    //If request was successful
    intCount = await jsonRequest_Count.json();

    //execute loop   
    for (var i = 0; i < intCount.value; i += 1000) {
      try {
        nextCount += 1000;
        _requestUrl = currentState.props.siteUrl.concat("/_api/web/Lists/GetByTitle('" + "<Your Target Library>" + "')/Items?%24skiptoken=Paged%3DTRUE%26p_ID=" + (i.toString()) + "&%24top=" + (nextCount.toString()) + "&$select=Attachments,AttachmentFiles,*&$expand=AttachmentFiles")
        const jsonRequest_5k = await currentProps.spHttpClient.get(_requestUrl, SPHttpClient.configurations.v1);

        if (!jsonRequest_5k.ok) {
          const responseText = await jsonRequest_5k.text();
          throw new Error(responseText + _requestUrl);
        };
        //If request was successful
        const resGrid: any = await jsonRequest_5k.json();
        //map
        resGrid.value.map((list: IODataList) => {

        });
        batchCount = _xxxItems.length;

        if (_xxxItems.length > 2000) {
          // _loadingSpinner(false, "N/A", currentProps);
          currentState._spItems = _xxxItems;
          currentState.forceUpdate();
        }
      } catch (error) {
        throw new Error(error);
      }
    }
  } catch (error) {
    console.log("Reach Batch Count: " + batchCount.toString() + " --> " + error);
  }
}
export function renderBatchRequests(currentProps, currentState): any {
  currentState._imgItems = [];
  var intCount, intervalCount, batchCount = 0;
  var reqObj = [];
  //count Items
  let _getitemCount = currentState.props.siteUrl.concat("/_api/web/Lists/GetByTitle('" + "<Your Target Library>" + "')/ItemCount")
  currentProps.spHttpClient.get(_getitemCount, SPHttpClient.configurations.v1).then((response: SPHttpClientResponse) => {
    if (response.ok) {

    }
  });
  var nextCount = 0;
  //override total
  intCount = 8000;
  intervalCount = 5000;
  let _requestUrl = "";
  //initiate batch
  const spBatchCreationOpts: ISPHttpClientBatchCreationOptions = { webUrl: currentState.props.siteUrl };
  const spBatch: SPHttpClientBatch = currentProps.spHttpClient.beginBatch(spBatchCreationOpts);
  _requestUrl = currentState.props.siteUrl.concat("/_api/web/Lists/GetByTitle('" + "<Your Target Library>" + "')/ItemCount") ///test
  const _newBatch: Promise<SPHttpClientResponse> = spBatch.get(_requestUrl, SPHttpClientBatch.configurations.v1);

  for (var i = 0; i < intCount; i += 5000) {
    nextCount += 5000;
    batchCount += 1;
    _requestUrl = currentState.props.siteUrl.concat("/_api/web/Lists/GetByTitle('" + "<Your Target Library>" + "')/Items?%24skiptoken=Paged%3DTRUE%26p_ID%3D" + (i.toString()) + "&%24top=" + (nextCount.toString()) + "&$select=Attachments,AttachmentFiles,*&$expand=AttachmentFiles")
    const _newBatch: Promise<SPHttpClientResponse> = spBatch.get(_requestUrl, SPHttpClientBatch.configurations.v1);
    reqObj.push(_newBatch)
  }

  spBatch.execute().then(() => {
    for (var i = 0; i < reqObj.length; i++) {
      reqObj[i].then((response: SPHttpClientResponse) => {
        response.json().then((responseJSON) => {


        }).catch(function (err) {
          console.log(err);
        });
      });
    }
    currentState.forceUpdate();
  });
}
export function renderImageCarousel(currentProps, currentState): any {
  let _requestUrl = currentState.props.siteUrl.concat("/_api/web/Lists/GetByTitle('" + "<Your Target Library>" + "')/GetItems?$select=Title,Description,FileRef")
  let _camlSingleQuery =
    `<View><Query></Query></View>`;
  const camlQueryPayLoad: any = {
    query: {
      __metadata: { type: 'SP.CamlQuery' },
      ViewXml: _camlSingleQuery
    }
  };
  let postOptions: ISPHttpClientOptions = { headers: { 'odata-version': '3.0' }, body: JSON.stringify(camlQueryPayLoad) };
  currentProps.spHttpClient.post(_requestUrl, SPHttpClient.configurations.v1, postOptions)
    .then((response: SPHttpClientResponse) => {
      if (response.ok) {

      }
    });
};
export function searchSingleListItem(searchText, currentProps, currentEtag, currentState) {
  alert("Searching for " + "'" + searchText + "'");
  //execute service    
  let _requestUrl = currentState.props.siteUrl.concat("/_api/web/Lists/GetByTitle('" + "BikeLibrary" + "')/GetItems")
  let _camlSingleQuery = "<View><Query><Where><Contains><FieldRef Name='Title' /><Value Type='Text'>" + searchText + "</Value></Contains></Where></Query></View>"
  const camlQueryPayLoad: any = {
    query: {
      __metadata: { type: 'SP.CamlQuery' },
      ViewXml: _camlSingleQuery
    }
  };
  let postOptions: ISPHttpClientOptions = { headers: { 'odata-version': '3.0' }, body: JSON.stringify(camlQueryPayLoad) };
  currentProps.spHttpClient.post(_requestUrl, SPHttpClient.configurations.v1, postOptions)
    .then((response: SPHttpClientResponse) => {
      if (response.ok) {

      }
    });
};
export function editSingleListItem(searchText, currentProps, currentEtag, currentState) {
  let _spSearchItems = [];
  let _requestUrl = currentState.props.siteUrl.concat("/_api/web/Lists/GetByTitle('" + "<Your Target Library>" + "')/items('" + currentState.searchId + "')")
  const camlQueryPayLoad: any = {
    'Title': currentState.searchTitle,
    'Description': currentState.searcDescription
  };
  let postOptions: ISPHttpClientOptions =
  {
    headers: {
      'Accept': 'application/json;odata=nometadata',
      'Content-type': 'application/json;odata=nometadata',
      'odata-version': '',
      'IF-MATCH': '*',
      'X-HTTP-Method': 'MERGE'
    },
    body: JSON.stringify(camlQueryPayLoad)
  };
  currentProps.spHttpClient.post(_requestUrl, SPHttpClient.configurations.v1, postOptions)
    .then((response: SPHttpClientResponse) => {
      if (response.ok) {

      }
    });
};
export function addSingleListItem(searchText, currentProps, currentEtag, currentState) {
  console.log('Current value: ' + currentState.state.searchTitle + '|' + currentState.state.searcDescription);

  //clear container
  let _spSearchItems = [];
  alert("Add for Item #" + "'" + currentState.state.searchId.toString() + "'");
  //execute service
  let _requestUrl = currentState.props.siteUrl.concat("/_api/web/Lists/GetByTitle('" + "<Your Target Library>" + "')/items")
  const camlQueryPayLoad: any = {
    'Title': currentState.state.searchTitle,
    'Description': currentState.state.searcDescription
  };
  let postOptions: ISPHttpClientOptions =
  {
    headers: {
      'Accept': 'application/json;odata=nometadata',
      'Content-type': 'application/json;odata=nometadata',
      'odata-version': '',
    },
    body: JSON.stringify(camlQueryPayLoad)
  };
  currentProps.spHttpClient.post(_requestUrl, SPHttpClient.configurations.v1, postOptions)
    .then((response: SPHttpClientResponse) => {
      if (response.ok) {

      }
    });
};
export function deleteSingleListItem(searchText, currentProps, currentEtag, currentState) {
  let _spSearchItems = [];
  let _requestUrl = currentState.props.siteUrl.concat("/_api/web/Lists/GetByTitle('" + "<Your Target Library>" + "')/items('" + currentState.searchId + "')")
  const camlQueryPayLoad: any = {
    'Title': currentState.searchTitle,
    'Description': currentState.searcDescription
  };
  let postOptions: ISPHttpClientOptions =
  {
    headers: {
      'Accept': 'application/json;odata=nometadata',
      'Content-type': 'application/json;odata=nometadata',
      'odata-version': '',
      'IF-MATCH': '*',
      'X-HTTP-Method': 'DELETE'
    },
    body: JSON.stringify(camlQueryPayLoad)
  };
  currentProps.spHttpClient.post(_requestUrl, SPHttpClient.configurations.v1, postOptions)
    .then((response: SPHttpClientResponse) => {
      if (response.ok) {
      }
    });
};
export class o365SP_CommonService {
  private _spHttpClient: SPHttpClient;


}