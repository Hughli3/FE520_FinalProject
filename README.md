# FE520_FinalProject
My FE520 Final Project

## Team member :
Zheng Li, Jianing Zhang, Wenxuan Wang

## Enviroment 
- Package management tool: conda
- Language: Pyhon 3.8.2

## Deployment
- System: CentOS 8
- Environment init
    ```sh
    yum install git
    wget https://repo.anaconda.com/miniconda/Miniconda3-latest-Linux-x86_64.sh -O ~/miniconda.sh
    bash ~/miniconda.sh -b -p $HOME/miniconda
    echo 'export PATH="~/miniconda/bin:$PATH"' >> ~/.bashrc
    source ~/.bashrc
    ```
- Now Go to "How to run" part

## How to run?

1. Git clone the project
    `git clone https://github.com/Hughli3/FE520_FinalProject.git`
2. Open terminal 
3. Go to folder `FE520_FinalProject/`
4. Use conda create the environment `conda env create -f FE520_Environment.yml`
5. Activate the environment by using `conda activate FE520`
6. Type in `python -m flask run`
