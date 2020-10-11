# Get Work Item State 

Gets the work item state based on the work item id. User to provide the following inputs.

      - Azure DevOps Organization
      - Work Item Id
      - Work Item state to compare to
      - Azure DevOps Token

      ```
      env:  
        ado_token: '${{ secrets.ADO_PERSONAL_ACCESS_TOKEN }}'
        ado_organization: '${{ secrets.ADO_ORGANIZATION}}'
        ado_state: 'Work Item State'
        ado_workitemid: 'Work Item Id'
      ```

The input state is compared against the work item's state, if they are not equal the action will fail.

## Sample Input Format

  ```
	  
	name: get work item state

	on:
	 push:
	  branches: [ master ]
    
	jobs:
	  alert:
       runs-on: ubuntu-latest
       name: Test workflow
       steps:       
       - uses: CanarysPlayground/wit_states@master
       env:  
        ado_token: '${{ secrets.ADO_PERSONAL_ACCESS_TOKEN }}'
        ado_organization: '${{ secrets.ADO_ORGANIZATION}}
        ado_state: 'Work Item State
        ado_workitemid: 'Work Item Id'
    ```
