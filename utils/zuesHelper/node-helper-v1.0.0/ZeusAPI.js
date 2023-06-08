'use extrict'
var crypto = require('crypto');
var zlib = require ('zlib');
var request = require ('request');
var axios = require('axios');

Date.prototype.toZeusString = function (){
    return this.toISOString().replace(/^(\d{4})-(\d{1,2})-(\d{1,2})T(\d{1,2})\:(\d{1,2})\:(\d{1,2})\.(\d{1,3})(\w)/g, '$3-$2-$1;$4:$5:$6');
};
 
Date.prototype.toZeusStringms = function (){
    return this.toISOString().replace(/^(\d{4})-(\d{1,2})-(\d{1,2})T(\d{1,2})\:(\d{1,2})\:(\d{1,2})\.(\d{1,3})(\w)/g, '$3-$2-$1;$4:$5:$6.$7');
};

Date.prototype.fromZeusString = function (sdate, utm= '+00:00'){
    return new Date(sdate.replace (/^(\d{1,2})-(\d{1,2})-(\d{4});(\d{1,2})\:(\d{1,2})\:(\d{1,2})\.(\d{1,3})(\w)/g, '$3-$2-$1\T$4:$5:$6.$7')+utm);
};

String.prototype.rtrim = function (s) {
    if (s == undefined)
        s = '\\s';
    return this.replace(new RegExp("[" + s + "]*$"), '');
};

String.prototype.ltrim = function (s) {
    if (s == undefined)
        s = '\\s';
    return this.replace(new RegExp("^[" + s + "]*"), '');
};

function get_Date (myDate) {
    var myD = new Date(myDate);
    return myD.toZeusString();
}


function add_minutes (dt, minutes) {
    return new Date(dt.getTime() + minutes*60000);
}

function ProgramableRelayFormat (myDate) {
   return (myDate.getHours()<10?'0':'') + myDate.getHours() + ":" + (myDate.getMinutes()<10?'0':'') + myDate.getMinutes();
}


const reasons = {
    TIME                : "0",
    ALARM_HIGH          : "1",
    ALARM_LOW           : "2",
    RESTORE             : "3",
    DIGITAL_IN_CHANGE   : "4",
    DIGITAL_IN_ALARM    : "5",
    DIGITAL_OUT_CHANGE  : "6",
    DAILY_MINIMUM       : "7",
    DAILY_MAXIMUM       : "8",
    USER_EVENT          : "9",
    TRANSIENT           : "10"
} 

const channels ={
    ANALOG_0         : 0,
    ANALOG_1         : 1,
    ANALOG_2         : 2,
    ANALOG_3         : 3,
    FLOWMETER_0      : 12,
    FLOWMETER_1      : 13,
    FLOWMETER_2      : 14,
    FLOWMETER_3      : 15,
    FLOWMETER_4      : 16,
    FLOWMETER_5      : 17,
    FLOWMETER_6      : 18,
    FLOWMETER_7      : 19,
    NONE             : 20,
    DIGITAL_IN_0     : 21,
    DIGITAL_IN_1     : 22,
    DIGITAL_IN_2     : 23,
    DIGITAL_IN_3     : 24,
    DIGITAL_IN_4     : 25,
    DIGITAL_IN_5     : 26,
    DIGITAL_IN_6     : 27,
    DIGITAL_IN_7     : 28,
    DIGITAL_IN_8     : 97,
    DIGITAL_IN_9     : 98,
    DIGITAL_IN_10    : 99,
    DIGITAL_IN_11    : 100,
    DIGITAL_IN_12    : 101,
    DIGITAL_IN_13    : 102,
    DIGITAL_IN_14    : 103,
    DIGITAL_IN_15    : 104,
    TOTALIZATOR_0    : 4,
    TOTALIZATOR_1    : 5,
    TOTALIZATOR_2    : 6,
    TOTALIZATOR_3    : 7,
    TOTALIZATOR_4    : 8,
    TOTALIZATOR_5    : 9,
    TOTALIZATOR_6    : 10,
    TOTALIZATOR_7    : 11,
    DIGITAL_OUT_0    : 77,
    DIGITAL_OUT_1    : 78,
    DIGITAL_OUT_2    : 79,
    DIGITAL_OUT_3    : 80,
    DIGITAL_OUT_4    : 81,
    DIGITAL_OUT_5    : 82,
    DIGITAL_OUT_6    : 83,
    DIGITAL_OUT_7    : 84,
    FLAG_0           : 61,
    FLAG_1           : 62,
    FLAG_2           : 63,
    FLAG_3           : 64,
    FLAG_4           : 65,
    FLAG_5           : 66,
    FLAG_6           : 67,
    FLAG_7           : 68,
    FLAG_8           : 69,
    FLAG_9           : 70,
    FLAG_10          : 71,
    FLAG_11          : 72,
    FLAG_12          : 73,
    FLAG_13          : 74,
    FLAG_14          : 75,
    FLAG_15          : 76,
    MATH_0           : 93,
    MATH_1           : 94,
    MATH_2           : 95,
    MATH_3           : 96,
    MATH_4           : 113,
    MATH_5           : 114,
    MATH_6           : 115,
    MATH_7           : 116,
    MATH_8           : 213,
    MATH_9           : 214,
    MATH_10          : 215,
    MATH_11          : 216,
    MATH_12          : 217,
    MATH_13          : 218,
    MATH_14          : 219,
    MATH_15          : 220,
    PROBE_0          : 105,
    PROBE_1          : 106,
    PROBE_2          : 107,
    PROBE_3          : 108,
    PROBE_4          : 109,
    PROBE_5          : 110,
    PROBE_6          : 111,
    PROBE_7          : 112,
    MODBUS_EX_0      : 29,
    MODBUS_EX_1      : 30,
    MODBUS_EX_2      : 31,
    MODBUS_EX_3      : 32,
    MODBUS_EX_4      : 33,
    MODBUS_EX_5      : 34,
    MODBUS_EX_6      : 35,
    MODBUS_EX_7      : 36,
    MODBUS_EX_8      : 37,
    MODBUS_EX_9      : 38,
    MODBUS_EX_10     : 39,
    MODBUS_EX_11     : 40,
    MODBUS_EX_12     : 41,
    MODBUS_EX_13     : 42,
    MODBUS_EX_14     : 43,
    MODBUS_EX_15     : 44,
    MODBUS_EX_16     : 45,
    MODBUS_EX_17     : 46,
    MODBUS_EX_18     : 47,
    MODBUS_EX_19     : 48,
    MODBUS_EX_20     : 49,
    MODBUS_EX_21     : 50,
    MODBUS_EX_22     : 51,
    MODBUS_EX_23     : 52,
    MODBUS_EX_24     : 53,
    MODBUS_EX_25     : 54,
    MODBUS_EX_26     : 55,
    MODBUS_EX_27     : 56,
    MODBUS_EX_28     : 57,
    MODBUS_EX_29     : 58,
    MODBUS_EX_30     : 59,
    MODBUS_EX_31     : 60,
    MODBUS_EX_32     : 117,
    MODBUS_EX_33     : 118,
    MODBUS_EX_34     : 119,
    MODBUS_EX_35     : 120,
    MODBUS_EX_36     : 121,
    MODBUS_EX_37     : 122,
    MODBUS_EX_38     : 123,
    MODBUS_EX_39     : 124,
    MODBUS_EX_40     : 125,
    MODBUS_EX_41     : 126,
    MODBUS_EX_42     : 127,
    MODBUS_EX_43     : 128,
    MODBUS_EX_44     : 129,
    MODBUS_EX_45     : 130,
    MODBUS_EX_46     : 131,
    MODBUS_EX_47     : 132,
    MODBUS_EX_48     : 133,
    MODBUS_EX_49     : 134,
    MODBUS_EX_50     : 135,
    MODBUS_EX_51     : 136,
    MODBUS_EX_52     : 137,
    MODBUS_EX_53     : 138,
    MODBUS_EX_54     : 139,
    MODBUS_EX_55     : 140,
    MODBUS_EX_56     : 141,
    MODBUS_EX_57     : 142,
    MODBUS_EX_58     : 143,
    MODBUS_EX_59     : 144,
    MODBUS_EX_60     : 145,
    MODBUS_EX_61     : 146,
    MODBUS_EX_62     : 147,
    MODBUS_EX_63     : 148,
    MODBUS_EX_64     : 149,
    MODBUS_EX_65     : 150,
    MODBUS_EX_66     : 151,
    MODBUS_EX_67     : 152,
    MODBUS_EX_68     : 153,
    MODBUS_EX_69     : 154,
    MODBUS_EX_70     : 155,
    MODBUS_EX_71     : 156,
    MODBUS_EX_72     : 157,
    MODBUS_EX_73     : 158,
    MODBUS_EX_74     : 159,
    MODBUS_EX_75     : 160,
    MODBUS_EX_76     : 161,
    MODBUS_EX_77     : 162,
    MODBUS_EX_78     : 163,
    MODBUS_EX_79     : 164,
    MODBUS_EX_80     : 165,
    MODBUS_EX_81     : 166,
    MODBUS_EX_82     : 167,
    MODBUS_EX_83     : 168,
    MODBUS_EX_84     : 169,
    MODBUS_EX_85     : 170,
    MODBUS_EX_86     : 171,
    MODBUS_EX_87     : 172,
    MODBUS_EX_88     : 173,
    MODBUS_EX_89     : 174,
    MODBUS_EX_90     : 175,
    MODBUS_EX_91     : 176,
    MODBUS_EX_92     : 177,
    MODBUS_EX_93     : 178,
    MODBUS_EX_94     : 179,
    MODBUS_EX_95     : 180,
    MODBUS_EX_96     : 181,
    MODBUS_EX_97     : 182,
    MODBUS_EX_98     : 183,
    MODBUS_EX_99     : 184,
    MODBUS_EX_100    : 185,
    MODBUS_EX_101    : 186,
    MODBUS_EX_102    : 187,
    MODBUS_EX_103    : 188,
    MODBUS_EX_104    : 189,
    MODBUS_EX_105    : 190,
    MODBUS_EX_106    : 191,
    MODBUS_EX_107    : 192,
    MODBUS_EX_108    : 193,
    MODBUS_EX_109    : 194,
    MODBUS_EX_110    : 195,
    MODBUS_EX_111    : 196,
    MODBUS_EX_112    : 197,
    MODBUS_EX_113    : 198,
    MODBUS_EX_114    : 199,
    MODBUS_EX_115    : 200,
    MODBUS_EX_116    : 201,
    MODBUS_EX_117    : 202,
    MODBUS_EX_118    : 203,
    MODBUS_EX_119    : 204,
    MODBUS_EX_120    : 205,
    MODBUS_EX_121    : 206,
    MODBUS_EX_122    : 207,
    MODBUS_EX_123    : 208,
    MODBUS_EX_124    : 209,
    MODBUS_EX_125    : 210,
    MODBUS_EX_126    : 211,
    MODBUS_EX_127    : 212,
} 

class LastKnownValues{
    constructor (lastConnectionTime=null,RSSI= null,PowerSupply="",values=null) {
        this.lastConnectionTime = lastConnectionTime; // String with Date. Format (d-m-Y;H:i:s.u)
        this.RSSI = RSSI;                             // Integer
        this.PowerSupply =PowerSupply;                // String
        this.values = values;                         // Dictionary of string, float.
    }
};

class StationProperties{
    constructor (Model="",Serial="",Latitude="",Longitude="",Group="",Reference1="",Reference2="",ChannelsNames=null,ChannelUnits=null,ChannelViews=null)
    {
        this.Model = Model;                 // string
        this.Serial = Serial;               // string
        this.Latitude = Latitude;           // string
        this.Longitude = Longitude;         // string
        this.Group = Group;                 // string
        this.Reference1 = Reference1;       // string
        this.Reference2 = Reference2;       // string
        this.ChannelsNames = ChannelsNames; // Array string
        this.ChannelUnits = ChannelUnits;   // Array string
        this.ChannelViews = ChannelViews;   // Dictionary string, Array(of string)
    };
};

class Historical{
    constructor  (DateOfRecord=null,ChannelID=null,Reason="",Value=null) {
        this.DateOfRecord = DateOfRecord;
        this.Reason=Reason;
        this.Value=Value;
        this.ChannelID=ChannelID;
    };
};

class Alarms{ 
    constructor (StationID="",DateOfRecord=null, Reason=null, ChannelID = null, AlarmText="",RawValue="") {
        this.StationID=StationID;
        this.DateOfRecord=DateOfRecord;
        this.Reason=Reason;
        this.ChannelID = ChannelID;
        this.AlarmText=AlarmText;
        this.RawValue=RawValue;
    };
};

class KeyValue{
    constructor (Key="",Value="") {
        this.Key=Key;
        this.Value=Value;
    };
};

class ProgrammableRelayPeriod{
    constructor (Weekdays,ActivationTime="00:00",Duration=0) {
        this.Weekdays = Weekdays;
        this.ActivationTime = ProgramableRelayFormat(ActivationTime);
        this.Duration = Duration;
    };
};

class HTTPResponse {
    constuctor(){
        httpVersion;
        statusCode;
        reason;
        headers;
        payload; 
    };
};

class Client {
    constructor ()  {
        this.IP = "";
        this.Port = null;
        this.AuthAccount = "";
        this.Password = "";
        this._AuthPass = "";
        this._AuthToken ;
        this._Created = false;
        this._SSL = false;
        this._ZeusAPILastError = "";
        this._APIVersion = "v1";
        this.iv = crypto.randomBytes(16);
        this._isPromise = false;
        this._timer = 0;
        this._Accept_Encoding = false;
        this._Content_Encoding = false;
        this._algorithm = "aes-256-cbc";
    };
    
    async init (IP="",Port=null,SSL=false,AuthAccount="",Password="",AuthPass=""){
        if (this.IsNullOrWhiteSpace(IP) || this.IsNullOrWhiteSpace(Port) || this.IsNullOrWhiteSpace(AuthAccount)||  this.IsNullOrWhiteSpace(AuthPass))
        {
            Error ("The input parameters are incorrect.");
        };

        this.IP = IP;
        this.Port = Port;
        this.AuthAccount = AuthAccount;
        this._AuthPass = Buffer.from (AuthPass, 'base64');
        this._SSL = SSL;
        this.url = SSL ? 'https://':'http://';
        this.url += IP + (this.IsNullOrWhiteSpace(Port) ? "" : ':' +  Port);
           
        if (this.IsNullOrWhiteSpace(Password))
                this.Password = "fJFYD42CMLEEKsUe";
            else
                this.Password = Password;

        await this.RequestAuthenticationToken().then( response => {
            if(response)
             this._Created = true;
            else{
                this.IP = "";
                this.Port = null;
                this.AuthAccount = "";
                this.Password = "";
                this._AuthPass = "";
                this._AuthToken = "";
                this._SSL = null;
                this._Created = false;
                Error ("Request Authentication incorrect.");
                console.log ("error");                
            } 
        });
    };         

    Is_Created() {
        return this._Created;
    }

    Get_ZeusAPILastError()  {
        return this._ZeusAPILastError;
    }

    Txt_AcceptEncoding (Insert = ""){
        return (this._Accept_Encoding ? Insert + "Accept-Encoding=gzip":"");
    }

    Txt_ContentEncoding (Insert = ""){
        return (this._Content_Encoding ? Insert + "Content-Encoding=gzip":"");
    }  

    IsNullOrWhiteSpace (input) {
        if (typeof input === 'boolean') return false;
        if (!input) return true;
        if (typeof input === 'string') return input.replace(/\s/g, '').length < 1;
        for(var key in input) if(input.hasOwnProperty(key)) return false;
        return true
     }

    encrypt(text,iv=this.iv) {
        let cipher = crypto.createCipheriv(this._algorithm, Buffer.from(this._AuthPass), iv);
        let encrypted = cipher.update(text);
        encrypted = Buffer.concat([encrypted, cipher.final()]);
       return {iv: iv.toString('base64'), encryptedData: encrypted.toString('base64') };
       }
       
    decrypt(text) {
        let iv = Buffer.from(text.iv, 'base64');
        let encryptedText = Buffer.from(text.encryptedData, 'base64');
        let decipher = crypto.createDecipheriv(this._algorithm, Buffer.from(this._AuthPass), iv);
        let decrypted = decipher.update(encryptedText);
        decrypted = Buffer.concat([decrypted, decipher.final()]);
        return decrypted.toString();
    }

    EncryptString_Aes(payloadToEncrypt)
    {
        // Si es vacio o nulo.
        if(this.IsNullOrWhiteSpace(payloadToEncrypt))
            return false;
            
       // Generamos el vector iv de forma criptosegura para a�adir aleatoriedad al mensaje.
        this.iv = crypto.randomBytes(16);

        // Encriptamos el mensaje.
        let hw = this.encrypt(payloadToEncrypt.toString('base64'),this.iv);

        let iv_with_encrypted = hw.iv.toString('base64') + hw.encryptedData;

        // Devolvemos.
        return iv_with_encrypted;
    }

    DecryptString_Aes(encryptedString)
    {
        // Si es vacio o nulo.
        if(this.IsNullOrWhiteSpace(encryptedString))
            return false;

        // Si el payload es menor que 25 significa que no contiene el vector IV y aparte el contenido.
        if (encryptedString.length < 25)
            return false;

        let msg = {};
                    
        // Obtenemos el vector iv del mensaje.
        msg.iv = Buffer.from(encryptedString.substring(0, 24), 'base64');

        // Obtenemos el resto del mensaje que es lo q hay q desencriptar.
        msg.encryptedData = encryptedString.substring(24);

        // Desencriptamos.
        let decrypted = this.decrypt(msg);
  
        // Devolvemos.
        return decrypted;
    }    

    async RequestAuthenticationToken  () 
    {
        let proccessResponse;

        this._timer = Date.now();

        let encryptedPass;
        encryptedPass = this.EncryptString_Aes(this.Password);

        await this.CreateSendReceive("GET", "accounts/" + encodeURIComponent(this.AuthAccount) + "?authentication=" + encodeURIComponent(encryptedPass), null, false, false, false, 1, true).then(response=> proccessResponse= response);
        if (!this.IsNullOrWhiteSpace(proccessResponse)) {
            if (proccessResponse.statusCode === 200 & !this.IsNullOrWhiteSpace(proccessResponse.payload))  {
                this._AuthToken = proccessResponse.payload;
                return true;
            }
        }
        return false
    }

    CreateRequest0(httpMethod = "", URIResource = "", payload, AcceptEncoding = false, ContentEncoding = false)
    {
        let request = {};
                
        if (!this.IsNullOrWhiteSpace(httpMethod) && !this.IsNullOrWhiteSpace(URIResource))
        {
            if (httpMethod === "GET" || httpMethod === "POST" || httpMethod === "DELETE" || httpMethod === "PUT") 
            {
                request.url = this.url + "/api/" +  this._APIVersion + "/" + URIResource;
                request.method = httpMethod;
                request.headers = {} ;
                request.body = '';

                let myPayload = "";
            
                request.headers['User-Agent']= "ZeusClient ApiREST";
                request.headers['Date']= new Date().toZeusString();
                
                if (!this.IsNullOrWhiteSpace(this._AuthToken))
                    request.headers['Authorization'] = "Bearer " + this._AuthToken; 

                if (!this.IsNullOrWhiteSpace(payload))
                {
                    request.body = payload
                     let newPayload = payload;
                     if (!this.IsNullOrWhiteSpace(payload) && ContentEncoding == true) { 
                        newPayload = zlib.gzipSync(newPayload).toString('base64');
                     } 
                   
                     myPayload = this.EncryptString_Aes(newPayload);
                     
                     if (myPayload === false)
                        request ={} ;
                     else 
                        request.body =  myPayload;
                }
            }
        }
 
        return request;
    };

    async MakeRequest(Opt) {
        let data = {};
        try {
            let res = await axios(Opt);
            data.status = res.status;
            data.reason = res.statusText;
            data.headers = res.headers;
            data.payload = res.data;
        } catch (error) {
            data.status = error.response.status;
            data.reason = error.response.statusText;
            data.headers = error.response.headers;
            if (error.response.data != null)
                data.payload = JSON.stringify(error.response.data);
            else
                data.payload = '';
    
        }
        return data;
    }

    async CreateSendReceive0(method, resource, payload, AcceptEncoding, ContentEncoding, OptionDecrypt, Attempts = 3, AuthRequest = false)
    {
        let myResponse = new HTTPResponse();
        let intentos = 0;

        do
        {
            let myRequest = this.CreateRequest(method, resource, payload, AcceptEncoding, ContentEncoding);
            if (this.IsNullOrWhiteSpace(myRequest))
            {
                this._ZeusAPILastError = "Creating request failure.";
                return null;
            }
            
            let myResponseRaw = await this.MakeRequest(myRequest);

            if (this.IsNullOrWhiteSpace(myResponseRaw))  return false;
            
            myResponse = this.ProccessRespond(myResponseRaw, OptionDecrypt);
             
            if (this.IsNullOrWhiteSpace(myResponse))
            {
                intentos = Attempts;
                this._ZeusAPILastError = "Proccess ZeusServer Respond failure.";
                return null;
            }
            else
            {
               switch (myResponse.statusCode) {
                    case 200:
                        intentos = Attempts;
                        this._ZeusAPILastError = "";
                        break;

                    case 401:
                        this._ZeusAPILastError = "[401] Request Authentication failure.";
                        if (AuthRequest == false)
                        {
                            intentos = intentos + 1;
                            myResponse = null;
                            this.RequestAuthenticationToken();
                        }
                        else
                        {
                            myResponse = null;
                            intentos = Attempts;
                        }
                        break;
                    
                    case 400:
                        this._ZeusAPILastError = this._ZeusAPILastError + "Reason [400]: Bad Request.";
                        if (!this.IsNullOrWhiteSpace(myResponse.payload))
                            this._ZeusAPILastError += " -- Server message: " + myResponse.payload;
                        intentos = Attempts;
                        myResponse = null;
                        break;

                    case 403:
                        this._ZeusAPILastError = this._ZeusAPILastError + "Reason  [403]: permissions.";
                        if (!this.IsNullOrWhiteSpace(myResponse.payload))
                            this._ZeusAPILastError += " -- Server message: " + myResponse.payload;
                        intentos = Attempts;
                        myResponse = null;
                        break;

                    case 404:
                        this._ZeusAPILastError = this._ZeusAPILastError + "Reason [404]: The requested resource was not found.";
                        if (!this.IsNullOrWhiteSpace(myResponse.payload))
                            this._ZeusAPILastError += " -- Server message: " + myResponse.payload;
                        intentos = Attempts;
                        myResponse = null;
                        break;

                    case 405:
                        this._ZeusAPILastError += "Reason [405]: The method is not allowed.";
                        if (!this.IsNullOrWhiteSpace(myResponse.payload))
                            this._ZeusAPILastError += " -- Server message: " + myResponse.payload;
                        intentos = Attempts;
                        myResponse = null;
                        break;

                    case 500:
                        this._ZeusAPILastError += "Reason [500]: An internal error occurred on the server.";
                        if (!this.IsNullOrWhiteSpace(myResponse.payload))
                            this._ZeusAPILastError += " -- Server message: " + myResponse.payload;
                        intentos = Attempts;
                        myResponse = null;
                        break;

                    default:
                        this._ZeusAPILastError = this._ZeusAPILastError + "Reason: Unknown error.";
                        if (!this.IsNullOrWhiteSpace(myResponse.payload))
                            this._ZeusAPILastError += " -- Server message: " + myResponse.payload;
                        intentos = Attempts;
                        myResponse = null;
                        break;
                } 
            }
        }while(intentos < Attempts);
        
        return myResponse;

    }   

    ProccessRespond0(httpRespond, decrypt)
    {
        let myResponse = new HTTPResponse();

        if (this.IsNullOrWhiteSpace(httpRespond))
            return null;
        else
        {
            
            myResponse.statusCode = httpRespond.status;
            myResponse.reason = httpRespond.reason;
            myResponse.headers = httpRespond.headers;

            if (myResponse.statusCode === 200) {
                if(this.IsNullOrWhiteSpace(httpRespond.payload) === false) {
                    let decryptPayload = '';
                    // Decrypt
                    if (decrypt){
                        try{ 
                            decryptPayload = this.DecryptString_Aes(httpRespond.payload);
                        } catch (e){return null;} 
                    }else{
                        decryptPayload = httpRespond.payload;
                    }
                    // GZIP
                    if(this._Accept_Encoding){
                        try{ 
                            myResponse.payload = zlib.gunzipSync ( Buffer.from (decryptPayload, 'base64'));
                        } catch (e){return null;} 
                    }else{
                        myResponse.payload = decryptPayload;
                    }
                } else {
                    myResponse.payload = httpRespond.payload;
                }
            } else {
                myResponse.payload = httpRespond.payload;
            }            
        }
        return myResponse;
    }

    // Estas tres funciones son las que están actualmente en uso. Eliminar el 0 del final y descomentar
    CreateRequest(httpMethod = "", URIResource = "", payload, AcceptEncoding = false, ContentEncoding = false)
    {
        let req={} ;
        
        if (!this.IsNullOrWhiteSpace(httpMethod) && !this.IsNullOrWhiteSpace(URIResource))
        {
            if (httpMethod === "GET" || httpMethod === "POST" || httpMethod === "DELETE" || httpMethod === "PUT") 
            {
                req.uri = this.url + "/api/" +  this._APIVersion + "/" + URIResource;
                req.method = httpMethod.toLowerCase();
                req.headers = {} ;
                let myPayload = "";
            
                req.headers['User-Agent']="ZeusClient ApiREST";
                req.headers.Date= new Date().toZeusString();
                
                if (!this.IsNullOrWhiteSpace(this._AuthToken))
                    req.headers.Authorization ="Bearer " + this._AuthToken; 

                if (!this.IsNullOrWhiteSpace(payload))
                {
                    req.body= payload
                     let newPayload = payload;
                     if (!this.IsNullOrWhiteSpace(payload) && ContentEncoding == true) { 
                        newPayload = zlib.gzipSync(newPayload).toString('base64');
                     } 
                   
                     myPayload = this.EncryptString_Aes(newPayload);
                     
                     if (myPayload === false)
                         req ={} ;
                     else 
                         req.body =  myPayload;
                }
            }
        }
        //console.log ("Request Created: ", req);  
        return req;
    };

    async CreateSendReceive(method, resource, payload, AcceptEncoding, ContentEncoding, OptionDecrypt, Attempts = 3, AuthRequest = false)
    {
        let myResponse = new HTTPResponse();
        let intentos = 0;

        do
        {
            let myRequest = this.CreateRequest(method, resource, payload, AcceptEncoding, ContentEncoding);
            if (this.IsNullOrWhiteSpace(myRequest))
            {
                this._ZeusAPILastError = "Creating request failure.";
                return null;
            }
            
            let myResponseString = {};
            var _include_response = function(body, response, resolveWithFullResponse) {
                return {'response': response, 'data': body};
              };
              
            myRequest.transform = _include_response;
      
            const getaut = async () => {
                try {
                    // return await request( myRequest);
                    return await new Promise(function(resolve, reject) {
                        // Do async job
                           request(myRequest, function(err, resp, body) {
                               if (err) {
                                   reject(err);
                               } else {
                                   resolve({response: resp, data:body} );
                               }
                           })
                       })
                  } catch (error){ console.error('\n\rError al procesar peticion WEB:\n\r', error.response.data); return error;}
            }

            const getmsg = async () => {
                const resp = await getaut()
                if (!this.IsNullOrWhiteSpace(resp)) {
                    return resp;
                } 
                return  false;
            }

            myResponseString = await getmsg();

            if (this.IsNullOrWhiteSpace(myResponseString))  return false;
            
            myResponse = this.ProccessRespond(myResponseString, OptionDecrypt);
             
            if (this.IsNullOrWhiteSpace(myResponse))
            {
                intentos = Attempts;
                this._ZeusAPILastError = "Proccess ZeusServer Respond failure.";
                return null;
            }
            else
            {
               switch (myResponse.statusCode) {
                    case 200:
                        intentos = Attempts;
                        this._ZeusAPILastError = "";
                        break;

                    case 401:
                        this._ZeusAPILastError = "[401] Request Authentication failure.";
                        if (AuthRequest == false)
                        {
                            intentos = intentos + 1;
                            myResponse = null;
                            this.RequestAuthenticationToken();
                        }
                        else
                        {
                            myResponse = null;
                            intentos = Attempts;
                        }
                        break;
                    
                    case 400:
                        this._ZeusAPILastError = this._ZeusAPILastError + "Reason [400]: Bad Request.";
                        if (!this.IsNullOrWhiteSpace(myResponse.payload))
                            this._ZeusAPILastError += " -- Server message: " + myResponse.payload;
                        intentos = Attempts;
                        myResponse = null;
                        break;

                    case 403:
                        this._ZeusAPILastError = this._ZeusAPILastError + "Reason  [403]: permissions.";
                        if (!this.IsNullOrWhiteSpace(myResponse.payload))
                            this._ZeusAPILastError += " -- Server message: " + myResponse.payload;
                        intentos = Attempts;
                        myResponse = null;
                        break;

                    case 404:
                        this._ZeusAPILastError = this._ZeusAPILastError + "Reason [404]: The requested resource was not found.";
                        if (!this.IsNullOrWhiteSpace(myResponse.payload))
                            this._ZeusAPILastError += " -- Server message: " + myResponse.payload;
                        intentos = Attempts;
                        myResponse = null;
                        break;

                    case 405:
                        this._ZeusAPILastError += "Reason [405]: The method is not allowed.";
                        if (!this.IsNullOrWhiteSpace(myResponse.payload))
                            this._ZeusAPILastError += " -- Server message: " + myResponse.payload;
                        intentos = Attempts;
                        myResponse = null;
                        break;

                    case 500:
                        this._ZeusAPILastError += "Reason [500]: An internal error occurred on the server.";
                        if (!this.IsNullOrWhiteSpace(myResponse.payload))
                            this._ZeusAPILastError += " -- Server message: " + myResponse.payload;
                        intentos = Attempts;
                        myResponse = null;
                        break;

                    default:
                        this._ZeusAPILastError = this._ZeusAPILastError + "Reason: Unknown error.";
                        if (!this.IsNullOrWhiteSpace(myResponse.payload))
                            this._ZeusAPILastError += " -- Server message: " + myResponse.payload;
                        intentos = Attempts;
                        myResponse = null;
                        break;
                } 
            }
        }while(intentos < Attempts);
        
        return myResponse;

    }   

    ProccessRespond(httpRespond, decrypt)
    {
        let myResponse = new HTTPResponse();

        if (this.IsNullOrWhiteSpace(httpRespond))
            return null;
        else
        {
            // console.log ("httpRespond: ", httpRespond); // #Debug

            let payload = httpRespond.data;
            try{ 
                if (this.IsNullOrWhiteSpace(payload)){
                    if (!this.IsNullOrWhiteSpace(httpRespond.response.data)){
                        payload = httpRespond.response.data.message;
                        decrypt=false;
                    }  
                    else payload ="";
                } 
            } catch (e){ payload="";} 

            myResponse.httpVersion = httpRespond.response.httpVersion;
            myResponse.statusCode = httpRespond.response.statusCode;
            myResponse.reason = "";
            myResponse.headers = httpRespond.response.headers;


            /*
            if (myResponse.statusCode === 200){
                if(this.IsNullOrWhiteSpace(payload) === false){
                    let decryptPayload = "";
                    if (decrypt){
                        try{ 
                            decryptPayload = this.DecryptString_Aes(payload);
                        } catch (e){return null;} 
                    }else{
                        decryptPayload = payload;
                    }

                    if(this.AcceptEncoding){
                        try{ 
                            myResponse.payload = zlib.gunzipSync ( Buffer.from (decryptPayload, 'base64'));
                        } catch (e){return null;} 
                    }else{
                        myResponse.payload = decryptPayload;
                    }
                }
            }else{
                myResponse.payload = payload;
            }

            */
            
            if (decrypt & myResponse.statusCode === 200){
                try{ 
                    myResponse.payload = this.DecryptString_Aes(payload);
                } catch (e){myResponse.payload = payload;} 
            }  else 
                myResponse.payload = payload;

            if (this._Accept_Encoding & myResponse.statusCode === 200 & myResponse.payload != false){ 
                try{ 
                    myResponse.payload = zlib.gunzipSync ( Buffer.from (myResponse.payload, 'base64'));
                } catch (e){console.log ('Error al descomprimir: ', e.code);} 
            }
            
        }
        return myResponse;
    }

    async Stations()
    {
        if (this._Created == false)
        {
            this._ZeusAPILastError = "Object Client not _Created.";
            return null;
        }

        let result = null;
        let proccessResponse;

        await this.CreateSendReceive("GET", "stations?status=all" + this.Txt_AcceptEncoding("&"), null, this._Accept_Encoding, this._Content_Encoding, true).then(response=> proccessResponse= response);
        
        if(this.IsNullOrWhiteSpace(proccessResponse)){ 
            return null;
        }
        else
        {
            if (proccessResponse.statusCode == 200)
            {
                if (this.IsNullOrWhiteSpace(proccessResponse.payload))
                {
                    this._ZeusAPILastError = "Incorrect data received.";
                    return null;
                }
                else
                {
                    try { 
                        result = JSON.parse(proccessResponse.payload);
                        this._ZeusAPILastError = "";
                    } catch (e){ this._ZeusAPILastError = 'Error al procesar JSON: ';} 
                }
            }
        }

        return result;
    };

    async OnlineStation()
    {
        if (this._Created == false)
        {
            this._ZeusAPILastError = "Object Client not created.";
            return null;
        }

        let result = null;
        let proccessResponse; 
        await this.CreateSendReceive("GET", "stations?status=online" + this.Txt_AcceptEncoding("&"), null, this._Accept_Encoding, this._Content_Encoding, true).then(response=> proccessResponse= response);
 
        if(this.IsNullOrWhiteSpace(proccessResponse))
            return null;
        else
        {
            if (proccessResponse.statusCode == 200)
            {
                if (this.IsNullOrWhiteSpace(proccessResponse.payload))
                {
                    this._ZeusAPILastError = "Incorrect data received.";
                    return null;
                }
                else
                {
                    try { 
                        result = JSON.parse(proccessResponse.payload);
                        this._ZeusAPILastError = "";
                    } catch (e){ this._ZeusAPILastError = 'Error al procesar JSON: ';} 
                }
            }
        }

        return result;
    }

    async  PendingMessages()
    {
        if (this.Created == false)
        {
            this._ZeusAPILastError = "Object Client not created.";
            return null;
        }

        let result = null;
        let proccessResponse; 
        await this.CreateSendReceive("GET", "stations/pending-messages" + this.Txt_AcceptEncoding("?"), null, this._Accept_Encoding, this._Content_Encoding, true).then(response=> proccessResponse= response);
 
        if(this.IsNullOrWhiteSpace(proccessResponse))
            return null;
        else
        {
            if (proccessResponse.statusCode == 200)
            {
                if (this.IsNullOrWhiteSpace (proccessResponse.payload))
                {
                    this._ZeusAPILastError = "Incorrect data received.";
                    return null;
                }
                else
                {
                    try { 
                        result = JSON.parse(proccessResponse.payload);
                        this._ZeusAPILastError = "";
                    } catch (e){ this._ZeusAPILastError = 'Error al procesar JSON: ';} 
                }
            }
        }

        return result;
    }

    async GetStationProperties(stationID)
    {
        if (this.Created == false)
        {
            this._ZeusAPILastError = "Object Client not created.";
            return null;
        }

        if (this.IsNullOrWhiteSpace(stationID))
        {
            this._ZeusAPILastError = "Incorrect input values: stationID.";
            return null; 
        }

        let result = null;
        let proccessResponse; 
        await this.CreateSendReceive("GET", "stations/" + encodeURIComponent(stationID) + "/properties" + this.Txt_AcceptEncoding("?"), null, this._Accept_Encoding, this._Content_Encoding, true).then(response=> proccessResponse= response);

        if(this.IsNullOrWhiteSpace(proccessResponse))
            return null;
        else
        {
            if (proccessResponse.statusCode === 200)
            {
                if (this.IsNullOrWhiteSpace(proccessResponse.payload))
                {
                    this._ZeusAPILastError = "Incorrect data received.";
                    return null;
                }
                else
                {
                    try { 
                        result = JSON.parse(proccessResponse.payload);
                        this._ZeusAPILastError = "";
                    } catch (e){ this._ZeusAPILastError = 'Error al procesar JSON';} 
                }
            }
        }

        return result;
    }

    async GetAllStationProperties()
    {
        if (this.Created == false)
        {
            this._ZeusAPILastError = "Object Client not created.";
            return null;
        }

        let result = null;
        let proccessResponse; 
        await this.CreateSendReceive("GET", "stations/properties" + this.Txt_AcceptEncoding("?"), null, this._Accept_Encoding, this._Content_Encoding, true).then(response=> proccessResponse= response);
        if(this.IsNullOrWhiteSpace(proccessResponse))
            return null;
        else
        {
            if (proccessResponse.statusCode === 200)
            {
                if (this.IsNullOrWhiteSpace(proccessResponse.payload))
                {
                    this._ZeusAPILastError = "Incorrect data received.";
                    return null;
                }
                else
                {
                    try { 
                        result = JSON.parse(proccessResponse.payload);
                        this._ZeusAPILastError = "";
                    } catch (e){ this._ZeusAPILastError = 'Error al procesar JSON';} 
                }
            }
        }

        return result;
    }   
    
    
    async GetStationExtendedProperties(stationID)
    {
        if (this.Created == false)
        {
            this._ZeusAPILastError = "Object Client not created.";
            return null;
        }

        if (this.IsNullOrWhiteSpace(stationID))
        {
            this._ZeusAPILastError = "Incorrect input values: stationID.";
            return null; 
        }
        let result = null;
        let proccessResponse; 
        await this.CreateSendReceive("GET", "stations/" + encodeURIComponent(stationID) + "/extendedproperties" + this.Txt_AcceptEncoding("?"), null, this._Accept_Encoding, this._Content_Encoding, true).then(response=> proccessResponse= response);
        if(this.IsNullOrWhiteSpace(proccessResponse))
            return null;
        else
        {
            if (proccessResponse.statusCode === 200)
            {
                if (this.IsNullOrWhiteSpace(proccessResponse.payload))
                {
                    this._ZeusAPILastError = "Incorrect data received.";
                    return null;
                }
                else
                {
                    try { 
                        result = JSON.parse(proccessResponse.payload);
                        this._ZeusAPILastError = "";
                    } catch (e){ this._ZeusAPILastError = 'Error al procesar JSON';} 
                }
            }
        }

        return result;
    }    

    async GetAllStationExtendedProperties()
    {
        if (this.Created == false)
        {
            this._ZeusAPILastError = "Object Client not created.";
            return null;
        }

        let result = null;
        let proccessResponse; 
        await this.CreateSendReceive("GET", "stations/extendedproperties" + this.Txt_AcceptEncoding("?"), null, this._Accept_Encoding, this._Content_Encoding, true).then(response=> proccessResponse= response);
        if(this.IsNullOrWhiteSpace(proccessResponse))
            return null;
        else
        {
            if (proccessResponse.statusCode === 200)
            {
                if (this.IsNullOrWhiteSpace(proccessResponse.payload))
                {
                    this._ZeusAPILastError = "Incorrect data received.";
                    return null;
                }
                else
                {
                    try { 
                        result = JSON.parse(proccessResponse.payload);
                        this._ZeusAPILastError = "";
                    } catch (e){ this._ZeusAPILastError = 'Error al procesar JSON';} 
                }
            }
        }

        return result;
    }   

    // Las fechas deben ser del tipo DateTime.
    async GetHistorical(stationID, startDate, endDate, channels)
    {
        if (this.Created == false)
        {
            this._ZeusAPILastError = "Object Client not created.";
            return null;
        }

        if (this.IsNullOrWhiteSpace(stationID))
        {
            this._ZeusAPILastError = "Incorrect input values: stationID.";
            return null; 
        }

        if (this.IsNullOrWhiteSpace (channels))
        {
            this._ZeusAPILastError = "Incorrect input values: Unspecified channels.";
            return null;             
        }


        let channelView = "CUSTOM";
        let customChannelsQuery = "";

        channels.forEach (c =>{
            customChannelsQuery += c.toString() + ",";
        });

        customChannelsQuery = customChannelsQuery.rtrim (",");

        let correctURI = false;
        let result = null;
        let uri = "";

        try
        {
            uri = "historical/" + encodeURIComponent(stationID) + "?startDate=" + startDate.toZeusString() + "&endDate=" + endDate.toZeusString() + "&channelView=";
        }catch(e) {
            this._ZeusAPILastError = "Incorrect input values: Date.";
            return null; 
        }


        if (!this.IsNullOrWhiteSpace(channelView))
        {
            if (channelView == "CUSTOM")
            {
                if(!this.IsNullOrWhiteSpace(customChannelsQuery))
                {
                    uri = uri + "CUSTOM&channels=" + customChannelsQuery;
                    correctURI = true;
                }
                else
                    correctURI = false;
            }
            else
            {
                uri = uri + channelView;
                correctURI = true;
            }
        }
        else
            correctURI = false;

        if(correctURI == true)
        {
            let proccessResponse;

            await this.CreateSendReceive("GET", uri + this.Txt_AcceptEncoding("&"), null, this._Accept_Encoding, this._Content_Encoding, true).then(response=> proccessResponse= response);


            if(this.IsNullOrWhiteSpace(proccessResponse))
                return null;
            else
            {
                if (proccessResponse.statusCode == 200)
                {
                    if (this.IsNullOrWhiteSpace(proccessResponse.payload))
                    {
                        this._ZeusAPILastError = "Incorrect data received.";
                        return null;
                    }
                    else
                    {
                        try { 
                            result = JSON.parse(proccessResponse.payload);
                            this._ZeusAPILastError = "";
                        } catch (e){ this._ZeusAPILastError = 'Error al procesar JSON';} 
                    }
                }
            }
        }
        else
        {
            this._ZeusAPILastError = "Incorrect URI data.";
            return null;             
        }

        return result;
    }

    async GetAlarm(startDate, endDate, sinceThisRawValue = "")
    {
        if (this.Created===false)
        {
            this._ZeusAPILastError = "Object Client not created.";
            return null;
        }

        let result = null;
        let correctURI = false;
        let uri = "alarms?";

        if (this.IsNullOrWhiteSpace (sinceThisRawValue))
        {
            try
            {
                uri = uri + "startDate=" + startDate.toZeusString()  + "&endDate=" + endDate.toZeusString() ;
                correctURI = true;
            }catch(e) {
                correctURI = false;
            }
        }
        else
        {
            uri = uri + "rawAlarm=" + sinceThisRawValue;
            correctURI = true;
        }

        if(correctURI == true)
        {
            let proccessResponse; 
            await this.CreateSendReceive("GET", uri + this.Txt_AcceptEncoding("&"), null, this._Accept_Encoding, this._Content_Encoding, true).then(response=> proccessResponse= response);

            if(this.IsNullOrWhiteSpace(proccessResponse))
                return null;
            else
            {
                if (proccessResponse.statusCode == 200)
                {
                    if (this.IsNullOrWhiteSpace (proccessResponse.payload))
                    {
                        this._ZeusAPILastError = "Incorrect data received.";
                        return null;
                    }
                    else
                    {
                        try { 
                            result = JSON.parse(proccessResponse.payload);
                            this._ZeusAPILastError = "";
                        } catch (e){ this._ZeusAPILastError = 'Error al procesar JSON';} 
                    }
                }
            }
        }
        else
        {
            this._ZeusAPILastError = "Incorrect URI data.";
            return null;   
        }

        return result;
    }

    async GetLastKnownValues(stationID)
    {
        if (this.Created == false)
        {
            this._ZeusAPILastError = "Object Client not created.";
            return null;
        }

        if (this.IsNullOrWhiteSpace (stationID))
        {
            this._ZeusAPILastError = "Incorrect input values: stationID.";
            return null; 
        }

        let result = null;
        let proccessResponse;

        await this.CreateSendReceive("GET", "stations/" + encodeURIComponent (stationID) + "/lastknownvalues" + this.Txt_AcceptEncoding("?"), null, this._Accept_Encoding, this._Content_Encoding, true).then(response=> proccessResponse= response);

        if(this.IsNullOrWhiteSpace(proccessResponse))
            return null;
            
        else
        {
            if (proccessResponse.statusCode == 200)
            {
                if (this.IsNullOrWhiteSpace (proccessResponse.payload))
                {
                    this._ZeusAPILastError = "Incorrect data received.";
                    return null;
                }
                else
                {
                    try { 
                        result = JSON.parse(proccessResponse.payload);
                        let myArray = [] ;
                        for (var key in result.values){
                            myArray[key] = result.values[key];
                        }
                        result.values = myArray;
                        this._ZeusAPILastError = "";
                    } catch (e){ this._ZeusAPILastError = 'Error al procesar JSON';} 
                }
            }
        }

        return result;
    }


    async GetAllStationLastKnownValues()
    {
        if (this.Created == false)
        {
            this._ZeusAPILastError = "Object Client not created.";
            return null;
        }

        let result = null;
        let proccessResponse; 
        await this.CreateSendReceive("GET", "stations/lastknownvalues" + this.Txt_AcceptEncoding("?"), null, this._Accept_Encoding, this._Content_Encoding, true).then(response=> proccessResponse= response);
        if(this.IsNullOrWhiteSpace(proccessResponse))
            return null;
        else
        {
            if (proccessResponse.statusCode === 200)
            {
                if (this.IsNullOrWhiteSpace(proccessResponse.payload))
                {
                    this._ZeusAPILastError = "Incorrect data received.";
                    return null;
                }
                else
                {
                    try { 
                        result = JSON.parse(proccessResponse.payload);
                        this._ZeusAPILastError = "";
                    } catch (e){ this._ZeusAPILastError = 'Error al procesar JSON';} 
                }
            }
        }

        return result;
    }    

    async GetConfigurationRelay(stationID, output)
    {
        if (this.Created == false)
        {
            this._ZeusAPILastError = "Object Client not created.";
            return null;
        }

        if (this.IsNullOrWhiteSpace(stationID))
        {
            this._ZeusAPILastError = "Incorrect input values: stationID.";
            return null; 
        }

        let result = null;
        let proccessResponse;

        await this.CreateSendReceive("GET", "stations/" + encodeURIComponent(stationID) + "/configurationRelay?output=" + output.toString() + this.Txt_AcceptEncoding("&"), null, this._Accept_Encoding, this._Content_Encoding, true).then(response=> proccessResponse= response);

        if(this.IsNullOrWhiteSpace(proccessResponse))
            return null;
        else
        {
            if (proccessResponse.statusCode == 200)
            {
                if (this.IsNullOrWhiteSpace(proccessResponse.payload))
                {
                    this._ZeusAPILastError = "Incorrect data received.";
                    return null;
                }
                else
                {
                    try { 
                        result = JSON.parse(proccessResponse.payload);
                        this._ZeusAPILastError = "";
                    } catch (e){ this._ZeusAPILastError = 'Error al procesar JSON';} 
                }
            }
        }

        return result;
    }
    
    async SendMessage(destination, messageText, sendBySMS = false)
    {
        if (this.Created == false)
        {
            this._ZeusAPILastError = "Object Client not created.";
            return false;
        }

        if (this.IsNullOrWhiteSpace(destination) || this.IsNullOrWhiteSpace(messageText))
        {
            this._ZeusAPILastError = "Incorrect input values: String.";
            return false; 
        }    
        
        let jsonDataString = JSON.stringify(new KeyValue(destination, messageText));

        if (this.IsNullOrWhiteSpace(jsonDataString))
        {
            this._ZeusAPILastError = "Incorrect input values: destination | messageText.";
            return false; 
        }

        let result = false;
        sendBySMS = (sendBySMS) ? "TRUE" : "FALSE";
        let uri =  "messages/message?bySMS=" + sendBySMS + "&dontWaitForResponse=FALSE";
        
        // console.log ("SendMessage: ", result,'-',sendBySMS,'--',uri, '---', jsonDataString); //#Debug

        let proccessResponse;
        await this.CreateSendReceive("POST", uri + this.Txt_ContentEncoding ("&"), jsonDataString, this._Accept_Encoding, this._Content_Encoding, true).then(response=> proccessResponse= response);

        if(this.IsNullOrWhiteSpace(proccessResponse))
            result = false;
        else
        {
            if (proccessResponse.statusCode == 200)
            {
                this._ZeusAPILastError = "";
                result = true; 
            }
            else
                result = false; 
        }
 
        return result;
    }

    async SetHistorical(stationID, historicalValues)
    {
        if (this.Created == false)
        {
            this._ZeusAPILastError = "Object Client not created.";
            return false;
        }

        if (this.IsNullOrWhiteSpace(stationID) || this.IsNullOrWhiteSpace(historicalValues))
        {
            this._ZeusAPILastError = "Incorrect input values.";
            return false; 
        }    

        let jsonDataString = JSON.stringify (historicalValues);
        
        if (this.IsNullOrWhiteSpace(jsonDataString))
        {
            this._ZeusAPILastError = "Incorrect input values: historicalValues.";
            return false; 
        }

        let result = false;        
        let proccessResponse;

        await this.CreateSendReceive("POST", "historical/" + encodeURIComponent(stationID) + this.Txt_ContentEncoding ("?"), jsonDataString, this._Accept_Encoding, this._Content_Encoding, true).then(response=> proccessResponse= response);

        if(this.IsNullOrWhiteSpace(proccessResponse))
            result = false;
        else
        {
            if (proccessResponse.statusCode == 200)
            {
                this._ZeusAPILastError = "";
                result = true; 
            }
            else
                result = false; 
        }
 
        return result;
    }

    async SetAlarms(alarmValues)
    {
        if (this.Created == false)
        {
            this._ZeusAPILastError = "Object Client not created.";
            return false;
        }

        if (this.IsNullOrWhiteSpace(alarmValues))
        {
            this._ZeusAPILastError = "Incorrect input values: alarmValues.";
            return false; 
        }    

        let jsonDataString = JSON.stringify(alarmValues);
        
        if (this.IsNullOrWhiteSpace(jsonDataString))
        {
            this._ZeusAPILastError = "Incorrect input values: alarmValues.";
            return false; 
        }

        let result = false;        
        let proccessResponse;
        await this.CreateSendReceive("POST", "alarms?rawAlarm=FALSE" + this.Txt_ContentEncoding ("&"), jsonDataString, this._Accept_Encoding, this._Content_Encoding, true).then(response=> proccessResponse= response);

        if(this.IsNullOrWhiteSpace(proccessResponse))
            result = false;
        else
        {
            if (proccessResponse.statusCode == 200)
            {
                this._ZeusAPILastError = "";
                result = true; 
            }
            else
                result = false; 
        }
 
        return result;
    }    

    async SetLastKnownValues(stationID, values)
    {
        if (this.Created == false)
        {
            this._ZeusAPILastError = "Object Client not created.";
            return false;
        }

        if (this.IsNullOrWhiteSpace(stationID)  || this.IsNullOrWhiteSpace(values))
        {
            this._ZeusAPILastError = "Incorrect input values.";
            return false; 
        }    

        let jsonDataString = JSON.stringify (values);
        // console.log (jsonDataString); //#Debug 
        let result = false;        
        let proccessResponse;
        await this.CreateSendReceive("POST", "stations/" + encodeURIComponent(stationID) + "/lastknownvalues" + this.Txt_ContentEncoding ("?"), jsonDataString, this._Accept_Encoding, this._Content_Encoding, true).then(response=> proccessResponse= response);

        if(this.IsNullOrWhiteSpace(proccessResponse))
            result = false;
        else
        {
            if (proccessResponse.statusCode == 200)
            {
                this._ZeusAPILastError = "";
                result = true; 
            }
            else
                result = false; 
        }
        return result;
    }  

    async SetConfigurationRelay(destination, output, myFrameTime)
    {
        if (this.Created == false)
        {
            this._ZeusAPILastError = "Object Client not created.";
            return false;
        }

        if (this.IsNullOrWhiteSpace(destination) || this.IsNullOrWhiteSpace(myFrameTime))
        {
            this._ZeusAPILastError = "Incorrect input values: destination|myFrameTime empty.";
            return false; 
        }    

        if (myFrameTime.length > 4){
            this._ZeusAPILastError = "Incorrect input values: myFrameTime elements.";
            return false; 
        }


        let messageText = "PR" + output.toString() + "=";

        myFrameTime.forEach(element => {
            messageText += element.ActivationTime + "-" + element.Duration.toString() + "@";
            element.Weekdays.forEach(myDay => {
                if (myDay.match("^[LMXJVSD]+$"))
                {
                    messageText += myDay;
                }
                else
                {
                    this._ZeusAPILastError = "Incorrect input values: myFrameTime.Weekdays format.";
                    return false;
                }
            });
            messageText += " ";
        });

        for (var i=myFrameTime.length;i<4;i++)
        {
            messageText += "00:00-0@ "
        }

        let myText = messageText.trimEnd();
        
        let jsonDataString = JSON.stringify(new KeyValue(destination, myText));
        
        if (this.IsNullOrWhiteSpace(jsonDataString))
        {
            this._ZeusAPILastError = "Incorrect input values: alarmValues.";
            return false; 
        }

        let result = false;        
        let proccessResponse;
        await this.CreateSendReceive("POST", "messages/message?Content-Encoding=gzip&bySMS=FALSE&dontWaitForResponse=TRUE", jsonDataString, this._Accept_Encoding, this._Content_Encoding, true).then(response=> proccessResponse= response);

        if(this.IsNullOrWhiteSpace(proccessResponse))
            result = false;
        else
        {
            if (proccessResponse.statusCode == 200)
            {
                this._ZeusAPILastError = "";
                result = true; 
            }
            else
                result = false; 
        }
 
        return result;
    }

}; 

module.exports ={Client, add_minutes, get_Date, ProgrammableRelayPeriod, reasons, channels, Historical, Alarms, LastKnownValues};