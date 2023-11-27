import React, { useState, useEffect , useRef} from "react";
import { Container, Box, Paper } from "@mui/material";
import { AlgorithmSpace } from "./AlgComponent/algorithmSpace";
import BinarySearchTree from "./bstComponent/bstmethod.js";
import AnimationB from "./bstComponent/bstanimate.jsx";
import Animation from "../../components/GraphRenderer/animate";
import { AnalyzeRuntime } from './AlgComponent/RuntimeAnalysis.jsx';
import { SaveInputToLocalStorage } from "./AlgComponent/saveInputToLocalStorage";
import Common from "./Common/common";
import GraphRenderer from "../../components/GraphRenderder"

var data = [4,7,8,2,1,3,5,9]
var dataset = []
var record = []
var step = 0
var tree = null

function datatran(data){
  dataset = []
  for (let i = 1; i <= data.length; ++i) {
    dataset[i-1] = { index: i, value: Number(data[i-1]),position: 1 };
  }
  return dataset
}

function reset(){
  step = 0
  record.forEach(element => {
    AnimationB.Pathdisappear(dataset[element-1].position)
  })
}

function Inorder(){
  reset()
  record = tree.inOrderTraverse()
}

function Preorder(){
  reset()
  record = tree.preOrderTraverse()  
}

function Postorder(){
  reset()
  record = tree.postOrderTraverse()
}

function nextStep(){
  if(step>=record.length)
  {
    alert("AnimationB is end!")
  }
  else
  {
    if(typeof(record[step].e1) == "undefined"){
      AnimationB.Pathdisplay(dataset[record[step]-1].position);
    }
    else{
      if(record[step].e1==0){
        Animation.deleteelement(record[step-1].e2,record[step-1].e1)
      }
      else{
        const text1 = document.getElementById("t" + record[step].e1);
        const text2 = document.getElementById("t" + record[step].e2);
        Animation.animateExchange(text1,text2);
      }
    }
    step++
  }
}

function back(){
  if(step<1)
  {
    alert("This is the first step!")
  }
  else
  {
    step--
    if(typeof(record[step].e1) == "undefined"){
      AnimationB.Pathdisappear(dataset[record[step]-1].position);
    }
    else{
      if(record[step].e1==0){
        Animation.showelement(record[step-1].e2,record[step-1].e1)
      }
      else{
        const text1 = document.getElementById("t" + record[step].e1);
        const text2 = document.getElementById("t" + record[step].e2);
        Animation.animateExchange(text1,text2);
      }
    }
  }
    
}

const BST = () => {
  const svgRef = useRef(null);
  useEffect(() => {
    createbst();
  },[]);

  useEffect(() => {
    SaveInputToLocalStorage
  },[]);

  const [bstResult, setBstResult] = useState(null);

  const useHisInput = (input) => {
    // Assuming `createHeap` is a function that takes an input array to create a heap
    data = input
    createbst();
  };

  function createbst(){
    record = []
    tree = new BinarySearchTree();
      datatran(data);
      dataset.forEach(element => {
        tree.insert(element, record);
      });
    const result = AnalyzeRuntime('createBST', data, () => {
      //AnimationB.createbst(dataset,svgRef);
      const renderder = new GraphRenderer();
      renderder.solverStrategy = "bst";
      renderder.createTree(dataset, svgRef);
      return tree;
    });
    setBstResult(result); // Update state
  }

  function insertbst(idata){
    record = []
    data.push(Number(idata[0]))
    dataset.push({index:data.length,value:Number(idata[0]),position: 1})
    tree.insert(dataset[data.length-1],record);
    record.push(dataset[data.length-1].index)
    AnimationB.createbst(dataset,svgRef);
  }

  function deletebst(ddata,k){
    record = []
    //k 被删除，i交换
    tree.delete(ddata,record)
    //tree.inOrderTraverse()
    let t = record[record.length-1]
    for (var i = 0; i < dataset.length; i++) {
      if (dataset[i].index == t) {        
        if(dataset[i].value!=ddata){
          console.log("exchange "+dataset[i].position + " and " +dataset[k].position)         
          record.push({
            e1: dataset[i].position,
            e2: dataset[k].position
          })
        }        
        break;
      }
    }
    record.push({
      e1: 0,
      e2: dataset[k].position
    })
    data.splice(dataset[i].index-1, 1); 
  }

  function test(){
    console.log(record[0].e1)
    //AnimationB.addGradients(dataset,svgRef)
  }

  return (
    <Container maxWidth="md">
      <Box className="canvas"><div style={{ display: 'flex' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <input id="create" placeholder="Enter comma separated numbers" />
        <button id="csubmit" onClick={() => {
          try {
            let cdata = Common.validData("create");
            data = cdata.map(item => Number(item.trim()))
            createbst()
          } catch (error) {
            alert("Error: " + error.message); // 输出错误消息
          }
          }}>Create</button>

        <input id="insert" placeholder="Insert a number" />
        <button id="isubmit" onClick={() => {
          try {
            let idata = Common.validonedata("insert");
            insertbst(idata)
          } catch (error) {
            alert("Error: " + error.message); // 输出错误消息
          }
          }}>Insert</button>

        <input id="delete" placeholder="Insert a number" />
        <button id="dsubmit" onClick={() => {
          try {
            let ddata = Common.validonedata("delete");
            const index = Common.findinarray(ddata,dataset);
            deletebst(ddata,index)
          } catch (error) {
            alert("Error: " + error.message); // 输出错误消息
          }
          }}>Delete</button>
        </div>

        <div style={{ flexGrow: 1 }}>
          <AlgorithmSpace svgRef={svgRef} width={Common.width} height={Common.height} />

          {bstResult && (
            <div>
              <h3>BST Result:</h3>
              <div>
                <strong>Input:</strong> [{bstResult.input.join(", ")}]
              </div>
              <div>
                <strong>Runtime:</strong> {bstResult.runtime} ms
              </div>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'middle', gap: '10px', marginTop: '10px' }}>
          <button onClick={Inorder}>Inorder</button>
          <button onClick={Preorder}>Preorder</button>
          <button onClick={Postorder}>Postorder</button>
          </div>
        <div style={{ display: 'flex', justifyContent: 'middle', gap: '10px', marginTop: '10px' }}>
          <button onClick={nextStep}>Next Step</button>
          <button onClick={back}>Back</button>
          <button onClick={reset}>Reset</button>
          <button onClick={test}>Test</button>
          </div>
        </div>
        <div><SaveInputToLocalStorage algorithm="bst" inputData={data} useHisInput={useHisInput}/>
          </div>
        

      </div>
      </Box>
    </Container>
  );
};

export default BST;