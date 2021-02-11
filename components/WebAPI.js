import * as React from 'react';
import { Platform, Alert, AsyncStorage } from 'react-native';
import XMLParser from 'react-xml-parser';
import Urls from '../constants/Urls';
import Const from '../constants/Const';

export function AssetExample(props) {
  return 'Привет всем присутствующим!';
}

function PostHeaders(props) {

  let headers = {};

  headers["X-Requested-With"]  = "XMLHttpRequest";
  headers["Content-Length"]     = props.contentLength;
  headers["Accept"]            = "*/*";
  headers["Accept-Language"]   = "ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7";
  headers["Connection"]        = "keep-alive";
  headers["Content-Type"]      = "application/x-www-form-urlencoded; charset=UTF-8";

  return headers;

}

function GetHeaders(props) {

  let headers = {};

  headers["Accept"]            = "*/*";
  headers["Connection"]        = "keep-alive";
  headers["Content-Type"]      = "application/x-www-form-urlencoded; charset=UTF-8";
  headers["User-Agent"]        = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36";

  return headers;

}

export function GetSessionInfo(props) {

    let sessionInfo = _getSessionInfo();

    return sessionInfo
}

export function Login(props) {

  let loginParameters = _getTokenAsync(props);

  return loginParameters

}

export function GetOrderInfo(props) {

  let orders = _postOrderInfoAsync(props);
  return orders;

};

export function GetOrders(props) {

  let orders = _postGetOrdersAsync(props);

  return orders;

};

export function GetFlyMap(props) {

  let orders = _postFlyMapAsync(props);

  return orders;

};

_postFlyMapAsync = async (props) => {

  console.log('_postFlyMapAsync');
  console.log(props);

  const SERVER_ARRAY = Const.SERVER_ARRAY;
  const GET_ORDERINFO_URL = SERVER_ARRAY[props.zone].url+Urls.GET_FLYMAP_URL;

  console.log(GET_ORDERINFO_URL);

  let pdepdate = "" + props.DT1.substr(0, 4)
                  + "." + props.DT1.substr(4, 2)
                  + "." + props.DT1.substr(6, 2)
                  + " " + props.DT1.substr(8, 2)
                  + ":" + props.DT1.substr(10, 2)
                  + ":" + props.DT1.substr(12, 2);

  let parrdate = "" + props.DT2.substr(0, 4)
                  + "." + props.DT2.substr(4, 2)
                  + "." + props.DT2.substr(6, 2)
                  + " " + props.DT2.substr(8, 2)
                  + ":" + props.DT2.substr(10, 2)
                  + ":" + props.DT2.substr(12, 2);

  let body = "PDATAFROM=&PADDEP_MAIN="+props.departure_aerodrome+
			"&PDEPDATE="+pdepdate+
			"&PADARR_MAIN="+props.destination_aerodrome+
			"&PARRDATE="+parrdate+
			"&PDOF="+props.other_information_dof+
			"&PETD="+props.time+
			"&PETE="+props.total_eet+
			"&PFLT="+props.aircraft_identification+
			"&PTWS="+props.type_of_aircraft+
			"&PEET="+props.other_information_eet+
			"&PROUTE_FIELD15="+props.cruising_speed+""+props.level+""+props.route+
			"&PFIELD18=EET/"+props.other_information_eet+
			" STS/"+props.other_information_ctc+
			" DOF/"+props.other_information_dof+
			" DEP/"+props.other_information_dep+
			" DEST/"+props.other_information_dest+
			" ALTN/"+props.other_information_pbn+
			" OPR/"+props.other_information_opr+
			""+props.other_information+
			"&time="+
			"&eng_lang=true";


  let headers = PostHeaders({contentLength: body.length})

  let response  = await fetch(GET_ORDERINFO_URL, {method: 'POST', body: body, headers: headers});

  let data  = await response.text();

  //if (Platform.OS === 'android') {
  //    data = data.replace(/\r?\n/g, '').replace(/[\u0080-\uFFFF]/g, '');
  //};

  //data = data.replace("'", "").replace("'", "");

  //

  let firstSymbol = data.substr(0,1);
  console.log('firstSymbol----------');
  console.log(firstSymbol);

  data = data.replace(firstSymbol, "");

  //re.sub("(\w+):", r'"\1":',  data)

  //data = data.replace(/(['"])?([a-zA-Z0-9]+)(['"])?:/g, '"$2":');
  //data = data.replace(/\'/g, "\"");
  //    dataJSON['errors'] = {message: 'Неизвестная ошибка'};
  //};
  //console.log('1----------');
  //console.log(data);

  let lonArr = [];
  let latArr = [];

  let target = 'LON:'; // цель поиска
  let pos = 0;

  while (true) {
    let foundPos = data.indexOf(target, pos);
    if (foundPos == -1) break;

    let substr = data.substr(foundPos+5, 20);
    lonArr.push(substr.substr(0, substr.indexOf("'")));
    pos = foundPos + 1; // продолжаем со следующей позиции
  }

  target = 'LAT:'; // цель поиска
  pos = 0;

  while (true) {
    let foundPos = data.indexOf(target, pos);
    if (foundPos == -1) break;

    let substr = data.substr(foundPos+5, 20);
    latArr.push(substr.substr(0, substr.indexOf("'")));
    pos = foundPos + 1; // продолжаем со следующей позиции
  }

  let dataArr = [];

  for (var i = 0; i < lonArr.length; i++) {
    dataArr.push({longitude: parseFloat(lonArr[i]), latitude: parseFloat(latArr[i])})
  }

  //console.log(dataArr);

  return dataArr//dataJSON;

}

_postOrderInfoAsync = async (props) => {

  console.log('_postOrderInfoAsync');
  const SERVER_ARRAY = Const.SERVER_ARRAY;
  const GET_ORDERINFO_URL = SERVER_ARRAY[props.zone].url+Urls.GET_ORDERINFO_URL;
  let body = "id_fpl="+props.id+"&text_fpl=";

  let headers = PostHeaders({contentLength: body.length})

  let response  = await fetch(GET_ORDERINFO_URL, {method: 'POST', body: body, headers: headers});

  let data  = await response.text();

  if (Platform.OS === 'android') {
      data = data.replace(/\r?\n/g, '').replace(/[\u0080-\uFFFF]/g, '');
  };

  let dataJSON  = {};

  try {
      dataJSON = JSON.parse(data);
  } catch (e) {
      dataJSON['success'] = false;
      dataJSON['errors'] = {message: 'Неизвестная ошибка'};
  };

  return dataJSON;

}

_postGetOrdersAsync = async (props) => {

  console.log('_postGetOrdersAsync');
  console.log(props);
  const GET_ORDERS_URL = props.url+Urls.GET_ORDERS_URL;
  let result = [];
  let body = "start=0&limit=20&sort=TM&dir=DESC&mode=1&filter_type=1&filter_mdp=&seach_aftn=&type_tlg=&tel_fax=&type_sts=&ad1=&ad2=";

  //start: 0        начальная позиция
  //limit: 20       количество
  //sort: TM
  //dir: DESC
  //mode: 1
  //filter_type:
  //	1 - все
  //	2 - только актуальные
  //	12 - только новые
  //	3 - только архивные
  //	4 - только уведомительные
  //	5 - только разрешительные
  //	6 - на сегодня
  //query: "тверь"
  let headers = PostHeaders({contentLength: body.length})

  let response  = await fetch(GET_ORDERS_URL, {method: 'POST', body: body, headers: headers});

  let data  = await response.text();

  let dataJSON  = {};
  //if (Platform.OS === 'android') {
  //    data = data.replace(/\r?\n/g, '').replace(/[\u0080-\uFFFF]/g, '');
  //};
  try {
      //dataJSON = JSON.parse(data);

      dataJSON = new XMLParser().parseFromString(data);

      dataJSON.children.forEach((item, index, array) => {

        if (item['name'] == 'row') {

          let child = {};

          item.children.forEach((item, index, array) => {
                child[item.name] = item.value;
          });

          result.push(child);

        }
      });

      //console.log(result);

      //if (dataJSON['success']) {
      //    result = dataJSON.data.fio_org;
      //    await _setSessionInfo({fio: dataJSON.data.fio_org, session_active: '1'})
      //}else{
      //    result = dataJSON.errors.message;
      //    await _setSessionInfo({session_active: '0'})
      //}

  } catch (e) {
      dataJSON['error'] = data;
      result = []
      //await _setSessionInfo({session_active: '0'})
  };

  //console.log(dataJSON);

  return result;

}

_postTokenAsync = async (props) => {

  const SIGNUP_URL = props.authdata.url.url+Urls.REGISTER_URL;
  let result = "";
  let body = ""+props.loginParameters.AUTORIZATION_LOGIN+"="+props.authdata.login+"&"+props.loginParameters.AUTORIZATION_PASS+"="+props.authdata.password+"&system_login="+props.authdata.login+"&p_checksum="+props.loginParameters.GLOBAL_CHECKSUM+"&system_password="+props.authdata.password;

  console.log(body);

  headers = PostHeaders({contentLength: body.length})

  response  = await fetch(SIGNUP_URL, {method: 'POST', body: body, headers: headers});

  let data  = await response.text();

  let dataJSON  = {};
  if (Platform.OS === 'android') {
      data = data.replace(/\r?\n/g, '').replace(/[\u0080-\uFFFF]/g, '');
  };
  try {
      dataJSON = JSON.parse(data);

      if (dataJSON['success']) {
          result = dataJSON.data.fio_org;
          await _setSessionInfo({fio: dataJSON.data.fio_org, session_active: '1'})
      }else{
          result = dataJSON.errors.message;
          await _setSessionInfo({session_active: '0'})
      }

  } catch (e) {
      result = 'Unknown error'
      await _setSessionInfo({session_active: '0'})
  };

  console.log(dataJSON);

  return result;
}

_getTokenAsync = async (props) => {
    console.log('_getTokenAsync');
    console.log(props.url);

    let headers   = null;

    headers = GetHeaders()
    response  = await fetch(props.url.url, {method: 'GET', headers: headers, credentials: 'same-origin'});
    let data  = await response.text();

    let id_autorization_login_string = data.substr(data.indexOf("id_autorization_login"), 1000);
    let id_autorization_pass_string = data.substr(data.indexOf("id_autorization_pass"), 1000);

    const ID_AUTORIZATION_LOGIN	= id_autorization_login_string.substr(id_autorization_login_string.indexOf("name")+7, 16);
    const ID_AUTORIZATION_PASS	= id_autorization_pass_string.substr(id_autorization_pass_string.indexOf("name")+7, 16);
    const GLOBAL_P_CHECKSUM = data.substr(data.indexOf("'p_checksum').setValue('")+24, 32);

    let jsondata = await _postTokenAsync({loginParameters: {GLOBAL_CHECKSUM: GLOBAL_P_CHECKSUM,
                                                              AUTORIZATION_LOGIN: ID_AUTORIZATION_LOGIN,
                                                              AUTORIZATION_PASS: ID_AUTORIZATION_PASS},
                                          authdata: props});

    return jsondata
}

_setSessionInfo = async (props) => {

  if (props['fio'] != null) {
    await AsyncStorage.setItem("fio", props['fio'])
  }else{

  };
  if (props['session_active'] != null) {
    await AsyncStorage.setItem("session_active", props['session_active'])
  }else{

  };

}

_getSessionInfo = async (props) => {

   const fio            = await AsyncStorage.getItem('fio');
   const session_active = await AsyncStorage.getItem('session_active');

   return {fio: fio, session_active: session_active}

}
