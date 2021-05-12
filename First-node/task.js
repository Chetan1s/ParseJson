

const safeEval = require('safe-eval'),
    jmespath = require('jmespath');

const constructMessage = async function(template='', data={},output={}, templateVersion=1) {
	try {
        //replace the rest of the variables
        const variablesInExpression = template.match(/{{(.*?)}}/g);
       // console.log('variablesInExpression -> ', variablesInExpression);
        if(Array.isArray(variablesInExpression)) {
            variablesInExpression.map((variable) => {
                const jmesPathExpression = variable.substring(2, variable.length-2).split('::')[1];
                // console.log('jmesPathExpression -> ', jmesPathExpression);
                // console.log('jmesPathValue -> ', jmespath.search(data.variables, jmesPathExpression));
                const pattern = new RegExp(variable, 'g');
               // console.log(data[jmesPathExpression]);
                //template = template.replace(pattern, jmespath.search(data.variables, jmesPathExpression));
                
              //  console.log(pattern);
              if(data[jmesPathExpression])
                template = template.replace(pattern, data[jmesPathExpression]);
                else
                template = template.replace(pattern, "0");

                
               //  console.log('template -> ', template);
            });
        }
        console.log(template);

        var tempJSON=JSON.parse(template);

       // console.log("power",tempJSON["power"]);

        var power=tempJSON["power"].split("*");

        var powerVal= (parseFloat(power[0])*parseFloat(power[1])*parseFloat(power[2])).toFixed(4);
        if(powerVal==='0.0000')
        output["power"]="Can not be calculated";
        else
        output["power"]=powerVal;
    
        var press=tempJSON["pressure_normalized"].split("*");
        var press1=press[0].substring(1,press[0].length-1).split("-");
        var P1=parseFloat(press1[0])-parseFloat(press1[1]);
        var pressVal=(P1 * parseFloat(press[1])).toFixed(4);
        if(pressVal==='0.0000')
        output["pressure_normalized"]="Can not be calculated";
        else
        output["pressure_normalized"]=pressVal;
        

       // console.log(output);
        
        return safeEval(JSON.stringify(output));
	} catch(err) {
		console.log(err);
	}
};

var JSON2={
    "voltage": "215.45",
   // "current": "3.46",
    "power_factor": "0.98",
    "pressure": "1024.56"
};

var str=JSON.stringify(JSON2);
var out=str;
var output=JSON.parse(out);
var data=JSON.parse(str);
//console.log("data : ",data);

var JSON1={
    "power": "{{data::voltage}} * {{data::current}} * {{data::power_factor}}",
    "pressure_normalized": "({{data::pressure}} - 1010) * {{data::current}}"
};
var template =JSON.stringify(JSON1);

constructMessage(template,data,output);
console.log("Input->",data);
console.log("output->",output);









