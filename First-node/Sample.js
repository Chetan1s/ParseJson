const safeEval = require('safe-eval'),
    jmespath = require('jmespath');



const constructMessage = function(template='', data={}, templateVersion=1) {
	try {
        //replace the rest of the variables
        const variablesInExpression = template.match(/{{(.*?)}}/g);
        var x;
        // console.log('variablesInExpression -> ', variablesInExpression);
        if(Array.isArray(variablesInExpression)) {
            variablesInExpression.map((variable) => {
                const jmesPathExpression = variable.substring(2, variable.length-2).split('::')[1];
                // console.log('jmesPathExpression -> ', jmesPathExpression);
                // console.log('jmesPathValue -> ', jmespath.search(data.variables, jmesPathExpression));
                const pattern = new RegExp(variable, 'g');
                var v=(jmespath.search(data, jmesPathExpression));
                if(v===null){
                x='NA';
                return x;}
               // console.log(v,typeof v);
                template = template.replace(pattern, jmespath.search(data, jmesPathExpression));
                // console.log('template -> ', template);
            });
        }
        if(x==='NA')
        return "N";
        var templateJSON=JSON.parse(template);
        //console.log(templateJSON);
        var ans;
        
        Object.keys(templateJSON).forEach(function(key) {
            var value = templateJSON[key];
            ans=safeEval(value);
        });

        return ans;
       
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
var data=JSON.parse(str);

var JSON1={
    "power": "{{data::voltage}} * {{data::current}} * {{data::power_factor}}",
    "pressure_normalized": "({{data::pressure}} - 1010) * {{data::current}}"
};
var out=str;
var output=JSON.parse(out);


Object.keys(JSON1).forEach(function(key) {
    var value = JSON1[key];
    var str='{"'+key+'"'+':"'+value+'"}';
    //console.log(str,typeof str);
    var ans=constructMessage(str.toString(),data);
    //console.log(ans);
    if(ans==='N'){}
    else{
    var a=ans.toFixed(4);
    output[key]=a;}
    //console.log(a,typeof a);
   // ans=safeEval(value);
});
console.log("Input->",data);
console.log("Output->",output);