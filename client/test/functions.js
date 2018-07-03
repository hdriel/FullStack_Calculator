const functions = {
    isValidNumebrString: (numberStr) =>{
        if(numberStr == null || numberStr == '' || numberStr == '.' || numberStr.search(' ') >= 0) numberStr = NaN
        res = Number(numberStr)
        return !isNaN(res);
    },
    isNotValidNumebrString: (numberStr) =>{
        return functions.isValidNumebrString(numberStr) == false;
    },
    appendText: (text, toAppend) =>{
        if(text === null || toAppend === undefined) text = '';
        if(toAppend === null || toAppend === undefined) toAppend =  '';

        text = text.toString() + toAppend.toString();
        return text.toString();
    },
    resetText: (text, resetTo) =>{ 
        text = functions.appendText('', resetTo)
        return text.toString();
    },
    checkValidData: (num1, operator, num2) =>{
        return functions.isValidNumebrString(num1) &&  ['+','*','/','-'].includes(operator) && functions.isValidNumebrString(num2) ;
    }
}


module.exports = functions