![Demo](https://gcdnb.pbrd.co/images/yj0299PEuIUh.png?o=1)


# chunkr

Chunkr is a powerful, flexible and efficient tool designed to streamline the process of managing large files by breaking them down into manageable 'chunks' of data.

When given an input file, such as one with 100,000 lines, Chunkr will effectively split this file into 100 separate files, each containing a user-configured number of lines, in this case, 1,000 lines per file. This makes it easier for users to manipulate, analyze, and process large files in a way that is both more efficient and less taxing on system resources.

However, Chunkr goes beyond merely splitting large files into chunks. It also enables users to execute specific commands over each chunk individually, further automating and simplifying file manipulation tasks. Users can input commands via the -c option, replacing {input} and {output} with their respective files.

In the given example, chunkr -f file.txt -c 'cat {input} | httprobe > {output}' -s 1000, Chunkr will split the file.txt into multiple chunks, each containing 1,000 lines. It will then execute the cat command (which reads each input file) and pipes the output into httprobe (a tool to probe for active HTTP and HTTPS servers), redirecting the output to a designated output file. This operation is repeated for each chunk.

Through a single command, Chunkr, therefore, offers a highly efficient and versatile solution for dealing with large files, combining file splitting and command execution into a user-friendly tool. With Chunkr, large file management is no longer a daunting task, but a straightforward, automated process.

# How to install?

`git clone REPO_URL`

`cd REPO_FOLDER`

`sudo npm install -g`

# How to use?


Suppose there's an input file(input.txt) with 100000 lines, chunkr will split the file into 100 files containing 1000 lines each and then execute command over them one by one while saving all the output to configured output file

Command example: 

`chunkr -f file.txt -c 'cat {input} | httprobe > {output}' -s 1000`



