const functions = require('./functions');

describe('Test: isValidNumebrString function', () => {
    test("isValidNumebrString: test1 on ''", ()=>{    
        expect(functions.isValidNumebrString("")).toBe(false);
    });
    test("isValidNumebrString: test2 on '.'", ()=>{    
        expect(functions.isValidNumebrString(".")).toBe(false);
    });
    test("isValidNumebrString: test3 on '-.2'", ()=>{    
        expect(functions.isValidNumebrString("-.2")).toBe(true);
    });
    test("isValidNumebrString: test4 on '-123'", ()=>{    
        expect(functions.isValidNumebrString("-123")).toBe(true);
    });
    test("isValidNumebrString: test5 on '-123-'", ()=>{    
        expect(functions.isValidNumebrString("-123-")).toBe(false);
    });
    test("isValidNumebrString: test6 on '123'", ()=>{    
        expect(functions.isValidNumebrString("123")).toBe(true);
    });
    test("isValidNumebrString: test7 on '123.12.1'", ()=>{    
        expect(functions.isValidNumebrString("123.12.1")).toBe(false);
    });
    test("isValidNumebrString: test8 on ' 0'", ()=>{    
        expect(functions.isValidNumebrString(" 0")).toBe(false);
    });
    test("isValidNumebrString: test9 on '0'", ()=>{    
        expect(functions.isValidNumebrString("0")).toBe(true);
    });
    test("isValidNumebrString: test10 on '111111111111111111111111111111111111111111111111111111111111111111111111111111111111111'", ()=>{    
        expect(functions.isValidNumebrString("111111111111111111111111111111111111111111111111111111111111111111111111111111111111111")).toBe(true);
    });
});

describe('Test: isNotValidNumebrString function', () => {
    test("isNotValidNumebrString: test1 on ''", ()=>{    
        expect(functions.isNotValidNumebrString("")).toBe(true);
    });
    test("isNotValidNumebrString: test2 on '.'", ()=>{    
        expect(functions.isNotValidNumebrString(".")).toBe(true);
    });
    test("isNotValidNumebrString: test3 on '-.2'", ()=>{    
        expect(functions.isNotValidNumebrString("-.2")).toBe(false);
    });
    test("isNotValidNumebrString: test4 on '-123'", ()=>{    
        expect(functions.isNotValidNumebrString("-123")).toBe(false);
    });
    test("isNotValidNumebrString: test5 on '-123-'", ()=>{    
        expect(functions.isNotValidNumebrString("-123-")).toBe(true);
    });
    test("isNotValidNumebrString: test6 on '123'", ()=>{    
        expect(functions.isNotValidNumebrString("123")).toBe(false);
    });
    test("isNotValidNumebrString: test7 on '123.12.1'", ()=>{    
        expect(functions.isNotValidNumebrString("123.12.1")).toBe(true);
    });
    test("isNotValidNumebrString: test8 on ' 0'", ()=>{    
        expect(functions.isNotValidNumebrString(" 0")).toBe(true);
    });
    test("isNotValidNumebrString: test9 on '0'", ()=>{    
        expect(functions.isNotValidNumebrString("0")).toBe(false);
    });
    test("isNotValidNumebrString: test10 on '111111111111111111111111111111111111111111111111111111111111111111111111111111111111111'", ()=>{    
        expect(functions.isNotValidNumebrString("111111111111111111111111111111111111111111111111111111111111111111111111111111111111111")).toBe(false);
    });
});


describe('Test: appendText function', () => {
    test("appendText: test1 on ('','A')", ()=>{    
        expect(functions.appendText('','A')).toBe('A');
    });
    test("appendText: test2 on ('AB','A')", ()=>{    
        expect(functions.appendText('AB','A')).toBe('ABA');
    });
    test("appendText: test3 on ('R',2)", ()=>{    
        expect(functions.appendText('R',2)).toBe('R2');
    });
    test("appendText: test4 on (2,'R')", ()=>{    
        expect(functions.appendText(2,'R')).toBe('2R');
    });
    test("appendText: test4 on (true,true)", ()=>{    
        expect(functions.appendText(true,true)).toBe('truetrue');
    });
    test("appendText: test5 on (true,false)", ()=>{    
        expect(functions.appendText(true,false)).toBe('truefalse');
    });
    test("appendText: test6 on ('is by',' value')", ()=>{    
        text = 'is by';
        functions.appendText(text,' value');
        expect(text).toBe('is by');
    });
    test("appendText: test7 on ('Result',' is OK')", ()=>{    
        text = 'Result';
        text = functions.appendText(text,' is OK');
        expect(text).toBe('Result is OK');
    });
    test("appendText: test8 on (null,null)", ()=>{    
        expect(functions.appendText(null,null)).toBe('');
    });
    test("appendText: test9 on (null,'Appended')", ()=>{    
        expect(functions.appendText(null,'Appended')).toBe('Appended');
    });
    test("appendText: test10 on (null,'Appended')", ()=>{    
        expect(functions.appendText('Appended', null)).toBe('Appended');
    });
});

describe('Test: resetText function', () => {
    test("resetText: test1 on ('','A')", ()=>{    
        expect(functions.resetText('','A')).toBe('A');
    });
    test("resetText: test2 on ('AB','A')", ()=>{    
        expect(functions.resetText('AB','A')).toBe('A');
    });
    test("resetText: test3 on ('R',2)", ()=>{    
        expect(functions.resetText('R',2)).toBe('2');
    });
    test("resetText: test4 on (2,'R')", ()=>{    
        expect(functions.resetText(2,'R')).toBe('R');
    });
    test("resetText: test4 on (true,true)", ()=>{    
        expect(functions.resetText(true,true)).toBe('true');
    });
    test("resetText: test5 on (true,false)", ()=>{    
        expect(functions.resetText(true,false)).toBe('false');
    });
    test("resetText: test6 on ('is not by reference','not reseted')", ()=>{    
        text = 'is not by reference';
        functions.resetText(text,'not reseted');
        expect(text).toBe('is not by reference');
    });
    test("resetText: test7 on ('Result',' is OK')", ()=>{    
        text = 'Result';
        text = functions.resetText(text,' is OK');
        expect(text).toBe(' is OK');
    });
});


describe('Test: checkValidData function', () => {
    test("checkValidData: test1 on ('','+', '1')", ()=>{    
        expect(functions.checkValidData('','+', '1')).toBe(false);
    });
    test("checkValidData: test2 on ('1','+', '1')", ()=>{    
        expect(functions.checkValidData('1','+', '1')).toBe(true);
    });
    test("checkValidData: test3 on (null,'+', '1')", ()=>{    
        expect(functions.checkValidData(null,'+', '1')).toBe(false);
    });
    test("checkValidData: test4 on ('1', null, '1')", ()=>{    
        expect(functions.checkValidData('1',null, '1')).toBe(false);
    });
    test("checkValidData: test5 on ('1','+', null)", ()=>{    
        expect(functions.checkValidData('1','+', null)).toBe(false);
    });
    test("checkValidData: test6 on ('1','+', null)", ()=>{    
        expect(functions.checkValidData('1','+', null)).toBe(false);
    });
    test("checkValidData: test7 on ('+','+', '-1')", ()=>{    
        expect(functions.checkValidData('+','+', '-1')).toBe(false);
    });
    test("checkValidData: test8 on ('.1','+', '-')", ()=>{    
        expect(functions.checkValidData('.1','+', '-')).toBe(false);
    });
    test("checkValidData: test9 on ('.1','+','.1')", ()=>{    
        expect(functions.checkValidData('.1','+','.1')).toBe(true);
    });
    test("checkValidData: test10 on ('-2.1','+','-.2')", ()=>{    
        expect(functions.checkValidData('-2.1','*','-.2')).toBe(true);
    });
    test("checkValidData: test11 on ('-2.1','%','-.2')", ()=>{    
        expect(functions.checkValidData('-2.1','%','-.2')).toBe(false);
    });
    test("checkValidData: test12 on ('-2.1','','-.2')", ()=>{    
        expect(functions.checkValidData('-2.1','','-.2')).toBe(false);
    });
});
