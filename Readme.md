# Repository Migration from GitLab to GitHub

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
        ado_organization: 'vaishnavnugala'
        ado_state: 'To Do'
        ado_workitemid: '422'
    ```
