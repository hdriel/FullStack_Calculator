var app = angular.module('app', ['ngRoute']);
const {remote} = require('electron');
const functionsSet = require('./test/functions');
var request = require("request");


const CLIENT_ID = 'Pw1qrXE9YDj38HTa1DkKDQMf1E00SZkt' 
const CLIENT_SECRET = 'LuefTVwmaqqX45GlCeOoa-D2ShgEdkN-NcV-tU094eR3cVoHgiY2dCmyPIHn-STD'
const AUDIENCE = 'https://hdriel.auth0.com/api/v2/';
const DOMAIN = 'hdriel.auth0.com';

var win = null;
var store = {};

// routing pages
app.config(function($routeProvider){    
    $routeProvider
    .when('/', {
        templateUrl: `${__dirname}/components/home/home.html`,
        controller: 'homeCtrl'
    })
    .otherwise({
        template: '404 bro'
    });
});

// handeling 'head Controller' that is the header tag
app.controller('headCtrl', function($scope){
    win = remote.getCurrentWindow()
});


app.controller('homeCtrl', function($scope, $http){
    $scope.tokenField = null;
    $scope.expr    = '';
    $scope.number1 = null;
    $scope.number2 = null;
    $scope.operator= null;
    $scope.routeServer= null;
    $scope.display = "";
    $scope.theme = 0;

    // handle the right / left click mouse on the display filed
    $scope.handleClickBox = function handleClickBox(evt){
        switch(evt.which) {
            case 1:
                console.log('left click on Box');
                $scope.changeTheme();
                break;
            case 2:
                console.log('middle click on Box');
                break;
            case 3:
                console.log('right click on Box');
                $scope.changeTheme();
                break;
            default:
                alert("you have a strange mouse!");
                break;
        }
    }
    // handle the right / left click mouse on the Login Button
    $scope.handleClickLogin = function handleClickLogin(evt){
        switch(evt.which) {
            case 1:
                console.log('left click on Login button');
                $scope.authServer(); // this is left click
                break;
            case 2:
                console.log('middle click on Login button');
                $scope.changeTheme(); // in case you need some middle click things
                break;
            case 3:
                console.log('right click on Login button');
                $scope.expendCalc(); // this is right click
                break;
            default:
                alert("you have a strange mouse!");
                break;
        }
    }
   
    // ##################################################################################

    $scope.expend = false;
    // change theme of app, there is for now 2 themes
    $scope.expendCalc = function expendCalc(){
        $scope.expend = !$scope.expend;
        console.log('expend : ' , $scope.expend)
    }

    // change theme of app, there is for now 2 themes
    $scope.changeTheme = function changeTheme(){
        $scope.theme = $scope.theme + 1;
        $scope.theme = $scope.theme % 2;
        console.log('theme : ' , $scope.theme)
    }

    // clear the screen and put some text
    $scope.c = function c(val){
        $scope.display = functionsSet.resetText($scope.display, val);
    }
    
    // append some text to display
    $scope.v = function v(val){
        $scope.display = functionsSet.appendText($scope.display, val);
    }

    // finish the program
    $scope.close = function close(){
        $scope.c("Goodbay...")
        setTimeout($scope.exitApp, 2000);
    }
    $scope.exitApp = function exitApp(){
        win.close();
    }

    // press '0-9' or '+,-,/,*,.' key button
    $scope.pressKey = function pressKey(i){
        if($scope.expend == false){
            switch(i){
                case "-":
                    if($scope.display.length == 0) {
                        $scope.v(i);
                        return;
                    }
                case "+": case "/": case "*": 
                    if($scope.number1 == "-") 
                         $scope.number1 += $scope.display;  
                    else $scope.number1 = $scope.display;
    
                    //$scope.number1 = $scope.checkNum($scope.number1);
                    if(functionsSet.isNotValidNumebrString($scope.number1)){
                        $scope.number1 = null;
                        $scope.showMessage("Enter first number...");
                        return;
                    }
                    $scope.number2 = null;
                    $scope.operator = i;
                    $scope.showMessage("Enter second number...")
                    console.log("number1 : ", $scope.number1, " | operator: ", $scope.operator, " | number2 : ", $scope.number2);
                break;
                case '':case '.':case '0':case '1':case '2':case '3':case '4':case '5':case '6':case '7':case '8':case '9': $scope.v(i); break;
                default: break;
            }
        }
        else{
            if(i == 'BS'){
                $scope.display = $scope.display.substring(0, $scope.display.length - 1);
            }
            else{
                $scope.v(i);
            }
            $scope.expr = $scope.display;
        }
    }

    // clear the display screen and pus message to user
    $scope.showMessage = function showMessage(msg, sec){
        setTimeout($scope.c , 100);
        $scope.c(msg);
    }
    
    
    // press '=' key button
    $scope.pressKeyEval = function pressKeyOperation(){
        if($scope.expend == false){
            if(!!$scope.number1 && !!$scope.operator){ $scope.number2 = $scope.display; }
            else if($scope.number1 == null)  { $scope.showMessage("Enter first number..."); return;}
            else if($scope.operator == null) { $scope.showMessage("Enter Operation..."); return;}
            console.log("number2 : ", $scope.number2);

            if(functionsSet.checkValidData($scope.number1,$scope.operator, $scope.number2))
            {
                console.log("send request to server" , $scope.number1, $scope.number2, $scope.operator);
                $scope.showMessage("Please Wait...")
                $scope.sendRequest($scope.number1, $scope.number2, $scope.operator, true);
            }
            else
            {
                console.log($scope.number1, $scope.operator, $scope.number2);
                $scope.resetData(true, 'Error: Incorrect input!');
            }
        }
        else{
            $scope.sendExprRequest($scope.expr, true);
        }
    }

    // clear the data and the screen
    $scope.resetData = function resetData(printable = false, msg = 'Enter first number...'){
        $scope.number1 = null;
        $scope.number2 = null;
        $scope.operator= null;
        $scope.routeServer = null;
        if(printable)
            $scope.showMessage(msg)
    }  


    // ##################################################################################


    // send a requrst to server and get result
    $scope.sendExprRequest = async function sendExprRequest(expr, printMsg){
        let promise = new Promise((resolve, reject) =>
        {
            let result = null;
            let routeInServer = 'fullexpression'
            urlServer = 'http://localhost:3013/calculator/' + routeInServer;
            console.log("Route to: ", urlServer);
        
            $http.post(
                    urlServer, 
                    {
                        'expression': expr
                    }, 
                    { headers: {
                        'Content-Type': 'application/json',
                        'Authorization': "Bearer " + store["accessToken"]
                    }}
                    ).then(function successCallback(response) 
                    {
                        console.log("successCallback: " , response)
                        if(response.data.result == null)
                        {
                            console.log(response)
                            if(printMsg) $scope.showMessage("Error: Divided By Zero!")
                            resolve(result)
                            return result;
                        }
                        result = response.data.result.toString()
                        n = result.indexOf('.');
                        digitsAfterDot = 4
                        if(n != -1 && n + digitsAfterDot + 1 < result.length){     
                            result = result.substring(0, n + digitsAfterDot + 1);
                        }
                        if(printMsg) $scope.resetData();
                        if(printMsg) $scope.showMessage("Result : " + result)
                        resolve(result);
                    }, function errorCallback(response) {
                        console.log("errorCallback: " , response)
                        if(printMsg) {
                            if(response.status == 400){
                                $scope.showMessage("Error: Incorrect input!")
                            }
                            else{
                                $scope.showMessage("Error: Not Connected!")
                            }
                        }
                        resolve(result)
                    });
        });
        let result = await promise;
        return result;
    }

    // send a requrst to server and get result
    $scope.sendRequest = async function sendRequest(num1, num2, operation, printMsg){
        let promise = new Promise((resolve, reject) =>
        {
            let result = null;
            let routeInServer = ''
            switch(operation){
                case "+": routeInServer = 'operatorplus' ; break;
                case "-": routeInServer = 'operatorminus' ; break;
                case "*": routeInServer = 'operatormultiply' ; break;
                case "/": routeInServer = 'operatordivide' ; break;
                default: if(printMsg) $scope.showMessage("Missed Operator!"); return;
            }
            if(!num2) {if(printMsg) $scope.showMessage("Enter second number..."); return;}

            urlServer = 'http://localhost:3013/calculator/' + routeInServer;
            console.log("Route to: ", urlServer);
        
            $http.post(
                    urlServer, 
                    {
                        'number1': num1,
                        'number2': num2
                    }, 
                    { headers: {
                        'Content-Type': 'application/json',
                        'Authorization': "Bearer " + store["accessToken"]
                    }}
                    ).then(function successCallback(response) 
                    {
                        console.log("successCallback: " , response)
                        if(response.data.result == null)
                        {
                            console.log(response)
                            if(printMsg) $scope.showMessage("Error: Divided By Zero!")
                            resolve(result)
                            return result;
                        }
                        result = response.data.result.toString()
                        n = result.indexOf('.');
                        digitsAfterDot = 4
                        if(n != -1 && n + digitsAfterDot + 1 < result.length){     
                            result = result.substring(0, n + digitsAfterDot + 1);
                        }
                        if(printMsg) $scope.resetData();
                        if(printMsg) $scope.showMessage("Result : " + result)
                        resolve(result);
                    }, function errorCallback(response) {
                        console.log("errorCallback: " , response)
                        if(printMsg) {
                            if(response.status == 400){
                                $scope.showMessage("Error: Incorrect input!")
                            }
                            else{
                                $scope.showMessage("Error: Not Connected!")
                            }
                        }
                        resolve(result)
                    });
        });
        let result = await promise;
        return result;
    }

    // ##################################################################################

    

    $scope.pressShift = false;
    $scope.pressKeyAfterShift = null;
    function keyup(e) {
        //setting your input text to the global Javascript Variable for every key press
        console.log('Keyup: ', e.keyCode, 'val:' , String.fromCharCode(e.keyCode));
        let key = e.keyCode;
        switch(e.keyCode){
            case 96:  // ` to numpad0 (0)
            case 97:  // a to numpad1 (1) 
            case 98:  // b to numpad2 (2) 
            case 99:  // c to numpad3 (3) 
            case 100: // d to numpad4 (4) 
            case 101: // e to numpad5 (5) 
            case 102: // f to numpad6 (6) 
            case 103: // g to numpad7 (7) 
            case 104: // h to numpad8 (8) 
            case 105: // i to numpad9 (9) 
                key = e.keyCode - 48;  // '1-9'
                break;
            case 106: key = 42; break; // '*'
            case 107: key = 43; break; // '+'
            case 109: key = 45; break; // '-'
            case 111: key = 47; break; // '/'
            case 110: key = 46; break; // '.'

            //case 16: $scope.pressShift = true;          break; // shift pressed
            case 53: $scope.pressKeyAfterShift = '%';   break; // 5 key pressed - for % 
            case 54: $scope.pressKeyAfterShift = '^';   break; // 6 key pressed - for ^
            case 57: $scope.pressKeyAfterShift = '(';   break; // 9 key pressed - for ( 
            case 48: $scope.pressKeyAfterShift = ')';   break; // 0 key pressed - for )
            
            case 8:  
                console.log('before: ',$scope.display )
                $scope.display = $scope.display.substring(0,$scope.display.length - 1); 
                console.log('after : ',$scope.display )
                document.getElementById('emptyKey').click()
                return;            
                // press backspace
            case 46: $scope.pressShift = false; $scope.pressKeyAfterShift= null; $scope.resetData(); document.getElementById('emptyKey').click();break;
            case 48: case 49: case 50: case 51: case 52: case 53: case 54: case 55: case 56: case 57: key = key; break;
            case 13: $scope.pressShift = false; $scope.pressKeyAfterShift= null; break;
            default: return;
        }

        //listens for you to press the ENTER key, at which point your web address will change to the one you have input in the search box
        if (e.keyCode == 13) {
            $scope.pressKeyEval();
        }
        else{
            if($scope.expend){
                if($scope.pressShift && $scope.pressKeyAfterShift != null){
                    //$scope.display = $scope.display.substring(0,$scope.display.length - 1);
                    $scope.pressKey($scope.pressKeyAfterShift);   
                    $scope.pressKeyAfterShift = '';
                    $scope.pressShift = false;
                }
                else if($scope.pressShift){
                    $scope.pressShift = false;
                    $scope.pressKeyAfterShift != null
                }
                else{
                    $scope.pressKey('' + String.fromCharCode(key));
                }
            }
            else{
                $scope.pressKey('' + String.fromCharCode(key));
            }
          document.getElementById('emptyKey').click()
        }
    }
    window.onkeyup = keyup;
    window.onkeydown = (e)=>{
        switch(e.keyCode){
            case 16: $scope.pressShift = true; break;
        }
    }

    // ##################################################################################

    // send a requrst to server and get result of access token
    $scope.requestTokenID = async function requestTokenID(printMsg){
        let promise = new Promise((resolve, reject) =>
        {
            let result = null;
            urlServer = `https://${DOMAIN}/oauth/token`
            console.log("Route to server for getting a token id: ", urlServer);
            
            var options = { 
                        method:     'POST',
                        url:        `https://${DOMAIN}/oauth/token`,
                        headers: {  'content-type': 'application/json' },
                        body: `{"client_id":"${CLIENT_ID}","client_secret":"${CLIENT_SECRET}","audience":"${AUDIENCE}","grant_type":"client_credentials"}`
                      };

            request(options, function (error, response, body) {
                if (error) {
                    console.log('error:', error)
                    resolve(error)
                    return;
                    //throw new Error(error);
                }
                var obj = JSON.parse(body);
                console.log('body accessToken', obj.access_token);
                resolve(obj)
            });
        });
        let result = await promise;
        return result;
    }

    // loging to server with Auth0 protocol
    $scope.getUpdatedTokenID = async function getUpdatedTokenID(){
        store = {}
        ResultConnection = await $scope.requestTokenID()
        //console.log('wait for requrst of token : ', ResultConnection) 
        $scope.tokenField = ResultConnection.access_token
        console.log('get auto updated tokenID', store["accessToken"])
    }
    $scope.getUpdatedTokenID(true);


    // authentication/Unauthentication with the 'login' key button
    $scope.authFlag = false;
    $scope.authServer = function authServer(){
        $scope.resetData()
        if($scope.authFlag) $scope.authFlag = $scope.logoutServer(); 
        else                $scope.authFlag = $scope.loginServer();
        return !!store["accessToken"]
    }

    // loging to server with Auth0 protocol
    $scope.loginServer = async function loginServer(){
        // get this token from the site: 
        // https://manage.auth0.com/#/apis/          Id            /explorer -> COPY TOKEN
        // https://manage.auth0.com/#/apis/5b2a2969ae61424ecc7a3b06/explorer -> COPY TOKEN
        // now it gettin automatic the tuken id 
        store = {}
        store["accessToken"] = $scope.tokenField;
        
        ResultConnection = await $scope.sendRequest('1','1','+', false)
        console.log('wait for requrst : ', ResultConnection)

        if(ResultConnection == 2)
        {
            console.log('Connected to Server')
            $scope.showMessage("You're Connected...", 1000)
            document.getElementById('emptyKey').click()
            return true;
        } 
        else {
            store = {}
            $scope.resetData(true, 'TokenID has expired!')
            $scope.getUpdatedTokenID();
            document.getElementById('emptyKey').click();
            return false;
        }
    }

    // logout from server
    $scope.logoutServer = function logoutServer(){
        store = {}
        $scope.showMessage("You're Disconnected !")
        return false;
    }

    // reset data first, and show message to user
    $scope.resetData(true, 'Please Login!');
});





