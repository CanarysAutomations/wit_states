const azdev = require(`azure-devops-node-api`);
const core = require(`@actions/core`);

const axios = require('axios');

main();
async function main () {
  
    try 
    {
      let vm = [];
      const env = process.env

      vm = getValuesFromPayload(env);

      getiterations(vm);
    }
    catch(err){
        core.setFailed(err)
    }
       
}

async function getiterations(env) {

    let authHandler = azdev.getPersonalAccessTokenHandler(vm.env.adoToken);
    let connection = new azdev.WebApi(vm.env.orgUrl, authHandler);
    let client = connection.getCoreApi();

    let teams = await (await client).getAllTeams();

    let teamscount = teams.length;


    for (j= 0; j< teamscount ; ++j)
    {

        let projectname = encodeURIComponent(teams[j].projectName);

        let teamname = encodeURIComponent(teams[j].name);

        const requesturl = vm.env.orgUrl+"/"+projectname+"/"+teamname+"/_apis/work/teamsettings/Iterations?api-version=6.0";    
        var result = await axios (requesturl, {
               method: 'GET',
               headers:{
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: `Basic ${Buffer.from(`PAT:${vm.env.adoToken}`).toString('base64')}`
               }
        })
    
        var count = result.data.count;
    
    
        for (i = 0; i < count ; ++i)
        {
            var sprinttimeframe = result.data.value[i].attributes.timeFrame;
            if (sprinttimeframe == 'current')
            {
                var sprintname = result.data.value[i].name;
                console.log(sprintname);
            }

        }
        getworkitemstates(projectname,sprintname)
    }

}


async function getworkitemstates(env,projectname,sprintname) {

    try {
      
        
        let iterationpath = projectname + "\\" + sprintname
        var state = vm.env.adostate;
        var closedstate = vm.env.closestate;
        let authHandler = azdev.getPersonalAccessTokenHandler(vm.env.adoToken);
        let connection = new azdev.WebApi(vm.env.orgUrl, authHandler);

        console.log(iterationpath);

        
        let client = await connection.getWorkItemTrackingApi();

        var query = "Select [System.Id] From WorkItems Where [System.IterationPath] =" +"'"+iterationpath+"'";

        var workitem = await client.queryByWiql({query});
        console.log(workitem);

        var count = workitem.workItems.length;

        for (wid = 0; wid < count ; ++wid)
        {
            var witem = await client.getWorkItem(workitem.workItems[wid].id);
            var witemstate = witem.fields["System.State"];
            var witemid = witem.id;

            if (witem === null)
            {
                console.log("No Work Items are available to Check State"); 
                core.setFailed();
            }
            else
            {
                if (closedstate == witemstate)
                {
                    console.log("Work Item " + witemid + " is in " + witemstate + " State");
                }
                else
                {
                    if (state == witemstate)
                    {
                        console.log("Work Item " + witemid + " State is "+ state);
                    }
                    else
                    {
                        core.setFailed();
                        console.log("Not all workitems are in " + state);
                        console.log("Work Item " + witemid + " State is "+ witemstate);
                    }
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
            closestate: env.close_state != undefined ? env.close_state : "",
            wit_id: env.ado_workitemid != undefined ? env.ado_workitemid :""
        }
    }
}
