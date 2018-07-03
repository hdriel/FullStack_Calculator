const math = require('mathjs')

module.exports = {
    operatorplus: (req,res)=>{
        const { number1, number2} = req.body
        try {
            var result = Number(number1) + Number(number2)
            return res.status(200).send({result});
        }catch(e){
            return res.status(400).send({error:'failed to calculate, try again'});
        }
    },
    operatorminus: (req,res)=>{
        const { number1, number2} = req.body
        try {
            var result = Number(number1)  - Number(number2)
            return res.status(200).send({result});
        }catch(e){
            return res.status(400).send({error:'failed to calculate, try again'});

        }
    },
    operatormultiply: (req,res)=>{
        const { number1, number2} = req.body
        try {
            var result = Number(number1)  * Number(number2)
            return res.status(200).send({result});
        }catch(e){
            return res.status(400).send({error:'failed to calculate, try again'});

        }
    },
    operatordivide: (req,res)=>{
        const { number1, number2} = req.body
        try {
            var result = Number(number1)  / Number(number2)
            return res.status(200).send({result});
        }catch(e){
            return res.status(400).send({error:'failed to calculate, try again'});

        }
    },
    fullexpression: (req, res) => {
        const { expression } = req.body
        try {
            var result = math.eval(expression)
            return res.status(200).send({result});
        }catch(e){
            return res.status(400).send({error:'failed to calculate, try again'});
        }
    }
}


