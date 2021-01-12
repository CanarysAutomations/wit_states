const azdev = require(`azure-devops-node-api`);
const core = require(`@actions/core`);

main();
async function main () {
  
    try 
    {
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
        let connection = new azdev.WebApi(vm.env.orgUrl, authHandler);
        let client = await connection.getWorkItemTrackingApi();

        var query = "Select [System.Id] From WorkItems";
        var workitem = await client.queryByWiql({query});

        var count = workitem.workItems.length;
    
        console.log(" The number of workitems discovered " + count);

        for (wid = 0; wid < count ; ++wid)
        {
            var witem = await client.getWorkItem(workitem.workItems[wid].id);
            var witemid = witem.id;

            if (witem === null)
            {
                console.log("No Work Items are available to Check State"); 
                core.setFailed();
            }
            else
            {
                var witemstate = witem.fields["System.State"];

                if (state == witemstate)
                {
                    console.log("Work Item " + witemid + " State is "+ state);
                }
                else
                {
                    core.setFailed();
                    console.log("Not all workitems are in " + state);
                }
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
