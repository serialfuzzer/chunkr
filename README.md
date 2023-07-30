![Demo](https://gcdnb.pbrd.co/images/yj0299PEuIUh.png?o=1)


# chunkr
Execute a command on a large file chunk by chunk


# How to install?

`git clone REPO_URL`
`cd REPO_FOLDER`
`sudo npm install -g`

# How to use?


Suppose there's an input file with 100000 lines namely input.txt, chunkr will split the file into 100 files containing 1000 lines each and then execute command over them one by one while saving all the output to configured output file

Command example: 

`chunkr -f file.txt -c 'cat {input} | httprobe > {output}'`



