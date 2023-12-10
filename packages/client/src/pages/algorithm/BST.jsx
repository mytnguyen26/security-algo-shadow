/**
 * TODO
 */
import React, { useState, useEffect, useRef } from "react";
import { Container, Box } from "@mui/material";
import { AlgorithmSpace } from "./algo-component/AlgorithmSpace.jsx";
import { AnalyzeRuntime } from "../../utils/algorithm-solver/runtimeAnalysis.js";
import { SaveInputToLocalStorage } from "./algo-component/SaveInputToLocalStorage.jsx";
import BSTConcreteStrategy from "../../utils/algorithm-solver/bstSolver.js";
import Common from "../../utils/common/common";
import { TreeAnimationData, Node } from "../../utils/common/animationData.js";
import TreeGraphRenderer from "../../utils/common/treeRenderer.js";
import ResultsTable from "./algo-component/TableCreater.jsx";
import { getBarchartData } from "../../utils/barchart-analyze/getBarchartData.js";
import { BarChart } from "./analyze-graph/BarChart.jsx";

let data = [5, 2, 9, 7, 8, 6, 1, 3, 10];
let animationData = null;
let record = []; // this array saves all animation steps that needs to happen
// allow users to have next and back functionality
let step = 0;
let tree = null;

function back() {
  if (step < 1) {
    alert("This is the first step!");
  } else {
    if (typeof record[step - 1].e1 == "undefined") {
      step--;
      const c = document.getElementById("c" + record[step]);
      TreeGraphRenderer.pathDisplay.pathDisplay(c, "fill", "blue;white");
    } else {
      step = Common.back(step, record);
    }
  }
}

function reset() {
  step = 0;
  animationData.dataset.forEach((element) => {
    //TreeGraphRenderer.Pathdisappear(element.position)
    const c = document.getElementById("c" + element.position);
    TreeGraphRenderer.pathDisplay(c, "fill", "blue;white");
  });
}

function inOrder() {
  reset();
  record = tree.inOrderTraverse();
  //console.log(record)
}

function preOrder() {
  reset();
  record = tree.preOrderTraverse();
}

function postOrder() {
  reset();
  record = tree.postOrderTraverse();
}

function searchBST(sdata) {
  record = [];
  reset();
  let node = tree.search(sdata, record);
  console.log(node);
}

const BST = () => {
  const svgRef = useRef(null);
  useEffect(() => {
    createBST();
  }, []);

  useEffect(() => {
    SaveInputToLocalStorage;
  }, []);

  const useHisInput = (input) => {
    // Assuming `createHeap` is a function that takes an input array to create a heap
    data = input;
    createBST();
  };

  function next() {
    if (step >= record.length) {
      TreeGraphRenderer.renderGraph(animationData, svgRef);
      createBST();
      alert("Animation ends!");
    } else {
      if (typeof record[step].e1 == "undefined") {
        const c = document.getElementById("c" + record[step]);
        TreeGraphRenderer.pathDisplay(c, "fill", "white;blue");
        step++;
      } else {
        step = Common.next(step, record);
      }
    }
  }

  function createBST() {
    record = [];
    const result = AnalyzeRuntime("createBST", data, () => {
      tree = new BSTConcreteStrategy();
      animationData = new TreeAnimationData(data, "position");
      animationData.dataset.forEach((element) => {
        tree.insert(element, record);
      });
    });
    TreeGraphRenderer.renderGraph(animationData, svgRef);
    reset();
    addResult(result); // Correctly add the result
  }

  function insertBST(idata) {
    record = [];
    reset();
    data.push(Number(idata[0]));
    animationData.push(new Node(data.length, idata));
    tree.insert(animationData.dataset[data.length - 1], record);
    TreeGraphRenderer.renderGraph(animationData, svgRef);
  }

  function deleteBST(ddata, index) {
    record = [];
    reset();
    //temptree = tree
    // index delete，prevSuccessorNodePosition exchange
    tree.delete(ddata, record);
    let prevSuccessorNodePosition = record[record.length - 1]; // exchange position to position found at index
    if (animationData.dataset[index].position !== prevSuccessorNodePosition) {
      record.push({
        e1: prevSuccessorNodePosition,
        e2: animationData.dataset[index].position,
      });
    }
    record.push({
      e1: 0,
      e2: [prevSuccessorNodePosition, animationData.dataset[index].position],
    });
    data.splice(animationData.dataset[index].index - 1, 1);
    //console.log("Removing from animationData dataset index", index);
    animationData.dataset.splice(index, 1);
  }

  const [bstResults, setBstResults] = useState(() => {
    const savedResults = localStorage.getItem("bstResults");
    return savedResults ? JSON.parse(savedResults) : [];
  });

  const addResult = (newResult) => {
    setBstResults((prevResults) => {
      // Ensure prevResults is always an array
      const updatedResults = Array.isArray(prevResults)
        ? [...prevResults, newResult]
        : [newResult];

      if (updatedResults.length > 10) {
        updatedResults.shift(); // Remove the oldest result
      }

      localStorage.setItem("bstResults", JSON.stringify(updatedResults));
      return updatedResults;
    });
  };

  return (
    <Container maxWidth="md">
      <Box className="canvas">
        <div style={{ display: "flex" }}>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "10px" }}
          >
            <input id="create" placeholder="Enter comma separated numbers" />
            <button
              id="csubmit"
              onClick={() => {
                try {
                  let cdata = Common.validData("create");
                  data = cdata.map((item) => Number(item.trim()));
                  createBST();
                } catch (error) {
                  alert("Error: " + error.message);
                }
              }}
            >
              Create
            </button>

            <input id="insert" placeholder="Insert a number" />
            <button
              id="isubmit"
              onClick={() => {
                try {
                  let idata = Common.validOneData("insert");
                  insertBST(idata);
                } catch (error) {
                  alert("Error: " + error.message);
                }
              }}
            >
              Insert
            </button>

            <input id="delete" placeholder="Insert a number" />
            <button
              id="dsubmit"
              onClick={() => {
                try {
                  let ddata = Common.validOneData("delete");
                  const index = Common.findInArray(
                    ddata,
                    animationData.dataset
                  );
                  deleteBST(ddata, index);
                } catch (error) {
                  alert("Error: " + error.message);
                }
              }}
            >
              Delete
            </button>

            <input id="search" placeholder="Insert a number" />
            <button
              id="ssubmit"
              onClick={() => {
                try {
                  let sdata = Common.validOneData("search");
                  searchBST(sdata);
                } catch (error) {
                  alert("Error: " + error.message);
                }
              }}
            >
              Search
            </button>
            <SaveInputToLocalStorage
              algorithm="bst"
              inputData={data}
              useHisInput={useHisInput}
            />
          </div>
          <div style={{ flexGrow: 1 }}>
            <AlgorithmSpace
              svgRef={svgRef}
              width={Common.width}
              height={Common.height}
            />

            <div
              style={{
                display: "flex",
                justifyContent: "middle",
                gap: "10px",
                marginTop: "10px",
              }}
            >
              <button onClick={inOrder}>Inorder</button>
              <button onClick={preOrder}>Preorder</button>
              <button onClick={postOrder}>Postorder</button>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "middle",
                gap: "10px",
                marginTop: "10px",
              }}
            >
              <button onClick={next}>Next Step</button>
              <button onClick={back}>Back</button>
              <button onClick={reset}>Reset</button>
            </div>
            <div>
              <ResultsTable results={bstResults} />
              <BarChart data={getBarchartData(bstResults).reverse()} />
            </div>
          </div>
        </div>
      </Box>
    </Container>
  );
};

export default BST;
