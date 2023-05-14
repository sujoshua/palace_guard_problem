class Graph {
    constructor() {
      this.adjacencyMatrix = []; // 邻接矩阵
      this.lines = new Map(); // 线段映射表
      this.nodes = [];
    }

//对于新加入的边会不会构成环
hasCycle(start){
  const nodeCount = this.adjacencyMatrix.length;
  const visited = new Array(nodeCount).fill(false);


  const stack = [];
  stack.push([start, -1]); // 当前节点和父节点

  while (stack.length) {
    const [currentNode, parentNode] = stack.pop();
    visited[currentNode] = true;

    for(let nextNode = 0; nextNode < nodeCount; nextNode++) {
      if (this.adjacencyMatrix[currentNode][nextNode]) {
        if (!visited[nextNode]) {
          stack.push([nextNode, currentNode]);
        } else if (nextNode !== parentNode) { // 存在环
          return true;
        }
      }
    }
  }
  return false;
}


    
    // 添加边
  addLine(line){
        let start = line.start;
        let end = line.end;
        if(start < 0 || end < 0) {
            console.log("Error: invalid node index!");
            return false;
        }
        let start_index = this.getIndex(start);
        let end_index = this.getIndex(end);
        this.adjacencyMatrix[start_index][end_index] = line;
        this.adjacencyMatrix[end_index][start_index] = line;
        if(this.hasCycle(start_index)){
          this.adjacencyMatrix[start_index][end_index] = 0;
          this.adjacencyMatrix[end_index][start_index] = 0;
          return false;
        }
        this.lines.set(line.index, line);
        return true;
  }

    // 删除一条线
    delLine(line_index){
        let line = this.lines.get(line_index);
        let start = line.start;
        let end = line.end;
        const n = this.adjacencyMatrix.length;
        if(start < 0 || start >= n || end < 0 || end >= n) {
            console.log("Error: invalid node index!");
            return;
        }
        if(start > end){
            let temp = start;
            start = end;
            end = temp;
        }
        line.remove();
        let start_index = this.getIndex(start);
        let end_index = this.getIndex(end);
        this.adjacencyMatrix[start_index][end_index] = 0;
        this.adjacencyMatrix[end_index][start_index] = 0;
        this.line.delete(line_index);
    }

    // 通过起始点和终点删除一条线
    getLine(start, end){
        return this.lineMap.get([start, end]);
    }
  
    // 添加节点
    addNode(node) {
      this.nodes.push(node)
      const n = this.adjacencyMatrix.length;
      for(let i = 0; i < n; i++) {
        this.adjacencyMatrix[i].push(0);
      }
      this.adjacencyMatrix.push(new Array(n + 1).fill(0));
    }

    // 使用对分排序查找nodes中的index和node_index的index
    getIndex(node_index){
      let left = 0;
      let right = this.nodes.length - 1;
      while(left <= right){
          let mid = Math.floor((left + right) / 2);
          if(this.nodes[mid].index == node_index){
              return mid;
          }
          else if(this.nodes[mid].index < node_index){
              left = mid + 1;
          }
          else{
              right = mid - 1;
          }
      }
      return -1
    }

    getNode(node_index){
        let index = this.getIndex(node_index);
        if(index == -1){
            return null;
        }
        return this.nodes[index];
    }
  
    // 删除节点
    delNode(node_index) {
      let index = this.getIndex(node_index);

      const n = this.adjacencyMatrix.length;
      if(index < 0 || index >= n) {
        console.log("Error: invalid node index!");
        return;
      }
      let tempList = this.adjacencyMatrix[index];
      for (var i = 0; i < tempList.length; i++) {
        if(tempList[i] != 0){
            tempList[i].remove();
        }
      }
        this.adjacencyMatrix.splice(index, 1);
        this.nodes.splice(index, 1);
      for(let i = 0; i < n - 1; i++) {
        if(this.adjacencyMatrix[i][index] != 0){
            this.adjacencyMatrix[i][index].remove();
        }
        this.adjacencyMatrix[i].splice(index, 1);
      }
    }

    findChildren() {
      let visited = new Array(this.adjacencyMatrix.length).fill(false);
      let dfs;
      dfs = (index,_visited)=>{
        if (_visited[index]) {
          return -1;
        }
        _visited[index] = true;

      let children = [];
    
      for (let i = 0; i < this.adjacencyMatrix.length; i++) {
        if (this.adjacencyMatrix[index][i] !== 0 && !_visited[i]) {
          let subChildren = dfs(i, _visited);
          if(subChildren !== -1){
            children.push(subChildren);
          }
        }
      }
      return {index: index, children: children };
      }
      return dfs(0,visited);
    }
    
    printTree(node_indexes, result) {
      let node = this.nodes[node_indexes.index]
      let strs = [node.index, node.price, node_indexes.children.length]
    
      for (let i = 0; i < node_indexes.children.length; i++) {
        strs.push(node_indexes.children[i].index+1)
        this.printTree(node_indexes.children[i], result);
      }

      result.push(strs)
    }
    
    output(){
        let node_indexes = this.findChildren();
        let strs = [];
        this.printTree(node_indexes, strs)
        // 按照strs数组中的每个对象的第一位，升序排序
        strs.sort((a,b)=>{return a[0] - b[0]})
        let str = "";
        strs.forEach(element => {
          str += element.join(" ") + "\n";
        });
        console.log(strs.length);
        str = strs.length + "\n" + str;
        return str.slice(0,-1);
    }
}
  
  
class Line{
    constructor(index, start, end, lineObj){
      this.index = index;
      this.start = start;
      this.end = end;
      this.lineObj = lineObj;
    }

    remove(){
        this.lineObj.remove();
    }
  }

class Node{
    constructor(index, nodeObj, price){
        this.index = index;
        this.nodeObj = nodeObj;
        this.price = price;
    }
}

export {Graph, Line, Node}