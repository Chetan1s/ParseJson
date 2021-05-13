



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
                template = template.replace(pattern, "N");

                
               //  console.log('template -> ', template);
            });
        }
    //    console.log(template);

        var tempJSON=JSON.parse(template);

      // console.log("power",tempJSON["power"]);

   
        var power=tempJSON["power"].split("*");
        // console.log(typeof power[0]);
        // console.log(power[0]);
        // console.log(power[1]);
        // console.log(power[2]);
        var pw1=power[0].substring(0,1);
        var pw2=power[1].substring(1,2);
        var pw3=power[2].substring(1,2);
        // console.log(pw1);
        // console.log(pw2);
        // console.log(pw3);
        if(pw1==="N" && pw2==="N" && pw3==="N")
        output["power"]="Inputs are not given, power can't be calculated";
        else if(pw1==="N" && pw2==="N")
        output["power"]="Voltage and Current are not given, Power can not be calculated";
        else if(pw1==="N" && pw3==="N")
        output["power"]="Voltage and Power_factor are not given, Power can not be calculated";
        else if(pw3==="N" && pw2==="N")
        output["power"]="Current and Power_factor are not given, Power can not be calculated";
        else if(pw1==="N"){
        output["power"]="Voltage is not given, Power can not be calculated";
        }
        else if(pw2==="N")
        output["power"]="Current is not given, Power can not be calculated";
        else if(pw3==="N")
        output["power"]="Power_factor is not given, Power can not be calculated";
        else{
        var powerVal= (parseFloat(power[0])*parseFloat(power[1])*parseFloat(power[2])).toFixed(4);
        output["power"]=powerVal;
        }

        // Calculation of pressure_normalized
        
        var press=tempJSON["pressure_normalized"].split("*");
        var press1=press[0].substring(1,press[0].length-1).split("-");
        var P1=parseFloat(press1[0])-parseFloat(press1[1]);
        // console.log(press1[0]);
        // console.log(press[1]);
        var pn1=press1[0].substring(0,1);
        var pn2=press[1].substring(1,2);
        // console.log(pn1);
        // console.log(pn2);
        if(pn1==="N" && pn2==="N")
        output["pressure_normalized"]="Inputs are not given, Pressure_normalized can not be calculated";
        else if(pn1==="N")
        output["pressure_normalized"]="Pressure is not given, Pressure_normalized can not be calculated";
        else if(pn2==="N")
        output["pressure_normalized"]="Current is not given, Pressure_normalized can not be calculated";
        else{
        var pressVal=(P1 * parseFloat(press[1])).toFixed(4);
        output["pressure_normalized"]=pressVal;
        }

       // console.log(output);
        
        return safeEval(JSON.stringify(output));
	} catch(err) {
		console.log(err);
	}
};

var JSON2={
    "voltage": "215.45",
    "current": "3.46",
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
if(str==='{}'){
    console.log("Input->",{});
    console.log("output->",{});
}
else{
constructMessage(template,data,output);
console.log("Input->",data);
console.log("output->",output);}










