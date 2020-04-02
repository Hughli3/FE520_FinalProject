# FE520_FinalProject
My FE520 Final Project

## Team member :
Zheng Li, Jianing Zhang, Wenxuan Wang

## Enviroment 
Package management tool: Anaconda, node.js
Language: Pyhon 3.8.2

## How to run?

1. Git clone the project
2. Open terminal 
3. Go to folder `FE520_FinalProject/FE520/src`
4. type in `python -m flask run`
5. Hit 'Enter'

## Enviroment Init
Check the existing enviroment
```
conda env list
```

If you don't have the conda enviromnt named FE520, please use the code below to crate a new one.
```
conda create -n FE520 python=3.8.2
```

Switch to the new created environment
```
conda activate FE520
```

## Install packages 

```
conda install --name FE520 flask
conda install --name FE520 ipykernel -y

```