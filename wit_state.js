const azdev = require(`azure-devops-node-api`);
const core = require(`@actions/core`);

main();
async function main () {
  try {
    let vm = [];
    const env = process.env

    vm = getValuesFromPayload(env);

    getworkitemstates(vm);
  }
  catch(err){
    core.setFailed(err)
  }
    
    
}

async function getworkitemstates(env) {

    try {

        var state = vm.env.adostate;
        let authHandler = azdev.getPersonalAccessTokenHandler(vm.env.adoToken);
        //let orgUrl1 = "https://dev.azure.com/vaishnavnugala";
        let connection = new azdev.WebApi(vm.env.orgUrl, authHandler);
        let client = await connection.getWorkItemTrackingApi();
        var workitem = await client.getWorkItem(vm.env.wit_id);

        if (workItem === null)
        {
            core.setFailed();
        }
        else
        {
            var witstate = workitem.fields["System.State"];
        
            console.log(witstate);
        
            if (state == witstate)
            {
                console.log("Work Item State is "+ state);
            }
            else
            {
                core.setFailed();
                return;
            }
        }
        
    }
    catch (err)
    {
        core.setFailed(err)
    }

}

function getValuesFromPayload(env)
{
    vm = {
        env : {
            organization: env.ado_organization != undefined ? env.ado_organization : "",
            orgUrl: env.ado_organization != undefined ? "https://dev.azure.com/" + env.ado_organization : "",
            adoToken: env.ado_token != undefined ? env.ado_token : "",
            adostate: env.ado_state != undefined ? env.ado_state : "",
            wit_id: env.ado_workitemid != undefined ? env.ado_workitemid :""
        }
    }
}
