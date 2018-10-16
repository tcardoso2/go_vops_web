# go_vops_web  
An old personal project revamp from .NET to Go  

* Installation instructions:  
 (Need to fill-in)

* Directory Structure:  

(root) --|
         |-- bin
         |
         |-- pkg
         |
         |-- src
              |-- github.com
                     |
                     |-- sctrechr (dependency, install with "go get")
                     |
                     |-- tcardoso2
                             |
                             |-- go_vops_web (this git repo)
                                     |
                                     |-- api (sub-package)
                                     |-- app (main)


* Bash profile:    
````
export PATH="$PATH:/usr/local/go/gowork/bin"
export GOBIN="$HOME/work/go/gowork/bin"
export GOPATH="$HOME/work/go/gowork"
export PATH=$PATH:$(go env GOPATH)/bin
````

Version History:  
- 0.0.2: Created a proper folder structure. Fixed first test. Need logs and installation notes / and or script?  
- 0.0.1: First version with a basic HTTP server and a GET api call (WIP); run using "go run main.go"; need to fix tests;   


