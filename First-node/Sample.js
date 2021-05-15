const safeEval = require('safe-eval'),
    jmespath = require('jmespath');



const constructMessage = async function(template='', data={}, templateVersion=1) {
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
                x='NA';}
               // console.log(v,typeof v);
                template = template.replace(pattern, jmespath.search(data, jmesPathExpression));
                // console.log('template -> ', template);
            });
        }
        if(x==='NA')
        return await "N";
        var templateJSON=JSON.parse(template);
        //console.log(templateJSON);
        var ans;
        
        Object.keys(templateJSON).forEach(function(key) {
            var value = templateJSON[key];
            ans=safeEval(value);
        });

        return await ans;
       
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

async function fun (){
Object.keys(JSON1).forEach(function(key) {
    var value = JSON1[key];
    var str='{"'+key+'"'+':"'+value+'"}';
    
    //console.log(str,typeof str);
    var count=0;
    let ans;
    (async ()=>{
        ans=await constructMessage(str.toString(),data);
        if(ans==='N'){}
        else{
        output[key]=parseFloat(ans).toFixed(4);}
    })()
});
return await "" ;
}
(async()=>{
    await fun();
    console.log("input->",data)
    console.log("output->",output);
})()

