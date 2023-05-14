s = `6
1 30 3 2 3 4
2 16 2 5 6
3 5 0
4 4 0
5 11 0
6 5 0`

//t = convertToAdjacencyList(s);

let node_color;


    // 临界矩阵转换为邻接表
function convertToAdjacencyList(str){
  let lines = str.split('\n')
  let result = new Array(lines.length).fill([]); // 数组长度多生成了一位，第0位不使用，因为节点标号从1开始
  let prices = new Array(lines.length).fill(-1);
  for(let i = 0; i < lines.length; i++) {
    let arr = lines[i].split(' ');
    let index = parseInt(arr[0]);
    prices[index] = parseInt(arr[1]);
    let childrenNum = parseInt(arr[2]);

    result[index] = [];
    for(let j = 0; j < childrenNum; j++) {
      let childIndex = parseInt(arr[3+j]);
      result[index].push(childIndex);
    } 
  }
  return {result, prices};
}

function convertToTreeStructure(result, prices){
  function genNode(index){
    return {
      index,
      weight: prices[index],
      children: result[index].map(genNode)
    }
  }
  return genNode(1);
}
    

// 临界矩阵转换为邻接表
function convertToAdjacencyList(str){
  let lines = str.split('\n')
  let result = new Array(lines.length).fill([]); // 数组长度多生成了一位，第0位不使用，因为节点标号从1开始
  let prices = new Array(lines.length).fill(-1);
  for(let i = 0; i < lines.length; i++) {
    let arr = lines[i].split(' ');
    let index = parseInt(arr[0]);
    prices[index] = parseInt(arr[1]);
    let childrenNum = parseInt(arr[2]);

    result[index] = [];
    for(let j = 0; j < childrenNum; j++) {
      let childIndex = parseInt(arr[3+j]);
      result[index].push(childIndex);
    } 
  }
  return {result, prices};
}

function convertToTreeStructure(result, prices){
  function genNode(index){
    return {
      index,
      weight: prices[index],
      children: result[index].map(genNode)
    }
  }
  return genNode(1);
}


function min(a,b){
  if(a< b){
    return a;
  }
  return b;
}

function* cal(prices, al){
  let len = prices.length;
  let f = new Array(len+1).fill(null).map(() => new Array(3).fill(0));

  // 利用深度搜索，进行树形dp
  function* dfs(u) {
    yield {action: "currentNode", index: u};
    let  children = al[u];
    for(let i=0;i < children.length;i++){
		  let _c = dfs(children[i]);//递归
      while(true){
        let {value, done} = _c.next();
        if(done) break;
        yield value;
      }
      yield({action: "pre-0", index:u, childIndex: children[i], fu0: f[u][0], fc0: f[children[i]][0], fc1: f[children[i]][1], fc2: f[children[i]][2]});
		  f[u][0] += min(f[children[i]][0],min(f[children[i]][1],f[children[i]][2]));//0
      yield({action: "done-0", index:u, childIndex: children[i], fu0: f[u][0]});
      yield({action: "pre-2", index: u, childIndex: children[i], fu2: f[u][2], fc1: f[children[i]][1]});
		  f[u][2] += f[children[i]][1]; //2
      yield({action: "done-2", index:u, childIndex: children[i], fu2: f[u][2]});
	  }
    yield({action: "pre-01", index:u, fu0: f[u][0], price: prices[u]});
	  f[u][0]+=prices[u];//累加
    yield({action: "done-01", index:u, fu0: f[u][0]});
    let o = 0;
    yield({action: "pre-sum", index:u});
    for(let i=0;i < children.length;i++){
      o+=min(f[children[i]][0],f[children[i]][1]);//找最小
	  }
    yield({action: "done-sum", index:u, sum:o});
	  f[u][1] = 114514; 
    for(let i=0;i < children.length;i++){
      yield({action: "pre-1", index:u, childIndex: children[i], fu1: f[u][1], fc0: f[children[i]][0], fc1: f[children[i]][1]});
      f[u][1]=min(f[u][1],o-min(f[children[i]][0],f[children[i]][1])+f[children[i]][0]);//2
      yield({action: "done-1", index:u, childIndex: children[i], fu1: f[u][1]});
	  }
    yield({action: "done", index:u, fu0: f[u][0], fu1: f[u][1], fu2: f[u][2]});
  }
  let c = dfs(1);
  let t;
  while(true){
    t= c.next()
    if(t.done){
      break;
    }
    yield t.value;
  }
  return f;
}

function* controlCal(prices, al){
  let process = cal(prices, al);
  let c;
  let toolBox = document.getElementById("status-wrapper");
  while(true){
    c = process.next();
    toolBox.innerHTML = ""
    if(c.done){
      initFinalAnswerHtml(toolBox, 1, c.value[1][0], c.value[1][1]);
      break;
    }
    let v = c.value
    initCurrentNodeHtml(toolBox, v.index);
    switch(v.action){
      case "currentNode":
        break;
      case "pre-sum":
        initPreSumHtml(toolBox);
        break;
      case "done-sum":
        initDoneSumHtml(toolBox, v.sum);
        break;
      case "pre-0":
        initPreCurrentChildHtml(toolBox, v.childIndex);
        initPreF0html(toolBox, v.index, v.childIndex, v.fc0, v.fc1, v.fc2);
        break;
      case "done-0":
        initDoneCurrentChildHtml(toolBox, v.childIndex);
        initDoneF0Html(toolBox, v.index, v.fu0);
        break;
      case "pre-01":
        initPreF01Html(toolBox, v.index, v.fu0, v.price);
        break;
      case "done-01":
        initDoneF01Html(toolBox, v.index, v.fu0);
        break;
      case "pre-1":
        initPreCurrentChildHtml(toolBox, v.childIndex);
        initPreF1Html(toolBox, v.index, v.childIndex, v.fu1, v.fc0, v.fc1);
        break;
      case "done-1":
        initDoneCurrentChildHtml(toolBox, v.childIndex);
        initDoneF1Html(toolBox, v.index, v.fu1);
        break;
      case "pre-2":
        initPreCurrentChildHtml(toolBox, v.childIndex);
        initPreF2Html(toolBox, v.index, v.childIndex, v.fc1, v.fu2);
        break;
      case "done-2":
        initDoneCurrentChildHtml(toolBox, v.childIndex);
        initDoneF2Html(toolBox, v.index, v.fu2);
        break;
      case "done": 
        initNodeDoneHtml(toolBox, v.index, v.fu0, v.fu1, v.fu2);
        break;
      default:
        console.log(v);
    }
    yield v;
}
}

function initFinalAnswerHtml(parent, index, fu0, fu1){
  let div = document.createElement("div")
  let p1 = document.createElement("p")
  p1.innerHTML = `最后进行比较：<span>min(f[${index}][0],f[${index}][1])}</span>`
  div.appendChild(p1)

  let p2 = document.createElement("p")
  p2.innerHTML = `f[${index}][0] = ${fu0},f[${index}][1] = ${fu1}`
  div.appendChild(p2)
  let p3 = document.createElement("p")
  p3.innerHTML = `最终结果：<span>${min(fu0,fu1)}</span>`
  div.appendChild(p3)
  div.classList.add("item")
  parent.appendChild(div)
}


function Cal(data){
  let t = convertToAdjacencyList(data);
  genTreeSvg(t);
  node_color = new Array(t.prices).fill('node');
  let control = controlCal(t.prices, t.result);
  //f = cal(t.prices, t.result);
  document.getElementById("next-button").onclick = ()=>{control.next()}
}

function SetNodeClass(index,className){
  if(!index){
    return;
  }
  let node = document.getElementById("node"+index);
  node.setAttribute("class", className);

}

function initCurrentNodeHtml(parent, index){
  let div = document.createElement("div")
  div.innerHTML = `当前节点编号：<span>${index}</span>`
  div.classList.add("item")
  parent.appendChild(div)
  node_color[index] = "node_current"
  SetNodeClass(index, "node_current")
  return div
}

function initFHtml(parent, fc0,fc1,fc2){
  let div = document.createElement("div")
  div.innerHTML = `当前节点的子节点值：<span>${fc0}</span>, <span>${fc1}</span>, <span>${fc2}</span>`
  div.classList.add("item")
  parent.appendChild(div)
  return div
}

function initCurrentFPreHtml(parent, fu0, fu1, fu2){
  let div = document.createElement("div")
  div.innerHTML = `当前节点的f值：<span>${fu0}</span>, <span>${fu1}</span>, <span>${fu2}</span>`
  div.classList.add("item")
  parent.appendChild(div)
  return div
}

// 需要restore childIndex
function initPreCurrentChildHtml(parent, childIndex){
  let div = document.createElement("div")
  div.innerHTML = `正在计算子节点：<span>${childIndex}</span>`
  div.classList.add("item")
  parent.appendChild(div)
  SetNodeClass(childIndex, "node_current_child")
  return div
}

function initDoneCurrentChildHtml(parent, childIndex){
  let div = document.createElement("div")
  div.innerHTML = `完成子节点：<span>${childIndex}</span>`
  div.classList.add("item")
  parent.appendChild(div)
  SetNodeClass(childIndex, node_color[childIndex])
  return div
}

function initNodeDoneHtml(parent, index, fu0, fu1, fu2){
  node_color[index] = "node_done"
  SetNodeClass(index, "node_done")
  let div = document.createElement("div")
  let p1  = document.createElement("p")
  p1.innerHTML = `节点编号：<span>${index}</span>, 已计算完成`
  let p2  = document.createElement("p")
  p2.innerHTML = `f[${index}][0]：<span>${fu0}</span>, f[${index}][1]：<span>${fu1}</span>, f[${index}][2]：<span>${fu2}</span>`
  div.appendChild(p1)
  div.appendChild(p2)
  div.classList.add("item")
  parent.appendChild(div)
  return div
}

// 需要restore childIndex
function initPreF0html(parent, index, childIndex, fc0, fc1, fc2){
    // 创建 MathML 标签
    const mathML = document.createElementNS('http://www.w3.org/1998/Math/MathML', 'math')

    // 创建子元素
    const f = document.createElementNS('http://www.w3.org/1998/Math/MathML', 'mi')
    f.textContent = 'f'
    const mrow1 = document.createElementNS('http://www.w3.org/1998/Math/MathML', 'mrow')
    const left1 = document.createElementNS('http://www.w3.org/1998/Math/MathML', 'mo')
    left1.textContent = '['
    const u = document.createElementNS('http://www.w3.org/1998/Math/MathML', 'mi')
    u.textContent = 'u'
    const right1 = document.createElementNS('http://www.w3.org/1998/Math/MathML', 'mo')
    right1.textContent = ']'
    mrow1.appendChild(left1)
    mrow1.appendChild(u)
    mrow1.appendChild(right1)
    const mrow2 = document.createElementNS('http://www.w3.org/1998/Math/MathML', 'mrow')
    const left2 = left1.cloneNode(true)
    const zero = document.createElementNS('http://www.w3.org/1998/Math/MathML', 'mn')
    zero.textContent = '0'
    const right2 = right1.cloneNode(true)
    mrow2.appendChild(left2)
    mrow2.appendChild(zero)
    mrow2.appendChild(right2)
    
    const equal = document.createElementNS('http://www.w3.org/1998/Math/MathML', 'mo')
    equal.textContent = '='
    const min = document.createElementNS('http://www.w3.org/1998/Math/MathML', 'mi')
    min.textContent = 'min'
    const mrow3 = document.createElementNS('http://www.w3.org/1998/Math/MathML', 'mrow')
    const left3 = document.createElementNS('http://www.w3.org/1998/Math/MathML', 'mo')
    left3.textContent = '('
    const f1 = f.cloneNode(true)
    const mrow4 = document.createElementNS('http://www.w3.org/1998/Math/MathML', 'mrow')
    const left4 = left1.cloneNode(true)
    const i = document.createElementNS('http://www.w3.org/1998/Math/MathML', 'mi')
    i.textContent = 'i'
    const right4 = right1.cloneNode(true)
    mrow4.appendChild(left4)
    mrow4.appendChild(i)
    mrow4.appendChild(right4)
    const coma1 = document.createElementNS('http://www.w3.org/1998/Math/MathML', 'mo')
    coma1.textContent = ','
    const t1 = document.createElementNS('http://www.w3.org/1998/Math/MathML', 'mi')
    t1.textContent = '1'
    const t2 = document.createElementNS('http://www.w3.org/1998/Math/MathML', 'mi')
    t2.textContent = '2'
    const mrow5 = document.createElementNS('http://www.w3.org/1998/Math/MathML', 'mrow')
    mrow5.appendChild(left4.cloneNode(true))
    mrow5.appendChild(t1)
    mrow5.appendChild(right4.cloneNode(true))
    const mrow6 = document.createElementNS('http://www.w3.org/1998/Math/MathML', 'mrow')
    mrow6.appendChild(left4.cloneNode(true))
    mrow6.appendChild(t2)
    mrow6.appendChild(right4.cloneNode(true))
    const right3 = document.createElementNS('http://www.w3.org/1998/Math/MathML', 'mo')
    right3.textContent = ')'
    mrow3.appendChild(left3)
    mrow3.appendChild(f1)
    mrow3.appendChild(mrow4)
    mrow3.appendChild(mrow2.cloneNode(true))
    mrow3.appendChild(coma1)
    mrow3.appendChild(f1.cloneNode(true))
    mrow3.appendChild(mrow4.cloneNode(true))
    mrow3.appendChild(mrow5)
    mrow3.appendChild(coma1.cloneNode(true))
    mrow3.appendChild(f1.cloneNode(true))
    mrow3.appendChild(mrow4.cloneNode(true))
    mrow3.appendChild(mrow6)
    mrow3.appendChild(right3)
    const right = document.createElementNS('http://www.w3.org/1998/Math/MathML', 'mo')
    right.textContent = ')'
    const plus = document.createElementNS('http://www.w3.org/1998/Math/MathML', 'mo')
    plus.textContent = '+'
     
    // 将公式插入到 HTML 页面中
    mathML.appendChild(f)
    mathML.appendChild(mrow1)
    mathML.appendChild(mrow2)
    mathML.appendChild(equal)
    mathML.appendChild(f.cloneNode(true))
    mathML.appendChild(mrow1.cloneNode(true))
    mathML.appendChild(mrow2.cloneNode(true))
    mathML.appendChild(plus)
    mathML.appendChild(min)
    mathML.appendChild(mrow3)
    

  // 将公式插入到 HTML 页面中
  let formula = document.createElement('div')
  formula.appendChild(mathML)

  let div = document.createElement("div")
  div.classList.add("item")
  div.appendChild(mathML)

  let p1 = document.createElement("p")
  p1.innerHTML = `f[${childIndex}][0]：${fc0}，f[${childIndex}][1]：${fc1}，f[${childIndex}][2]：${fc2} 中`;
  div.appendChild(p1)

  let p2 = document.createElement("p")
  let minValue = Math.min(fc0, fc1, fc2);
  p2.innerHTML = `最小值为：<span>${minValue}</span>`;
  div.appendChild(p2)

  parent.appendChild(div)
}

function initDoneF0Html(parent, index, fu0){
  let div = document.createElement("div")
  div.innerHTML = `f[${index}][0]=${fu0}`;
  parent.appendChild(div)
}

function initPreF01Html(parent, index, fu0, price){
  let div = document.createElement("div")
  div.classList.add("item")
  let p1 = document.createElement("p")
  p1.innerHTML = `准备计算f[${index}][0],公式为：`

  div.appendChild(p1)

  const mathElement = document.createElement('math');
  mathElement.setAttribute('xmlns', 'http://www.w3.org/1998/Math/MathML');
  
  const fElement1 = document.createElement('mi');
  fElement1.textContent = 'f';
  
  const fElement2 = document.createElement('mrow');
  const uElement = document.createElement('mi');
  uElement.textContent = index;
  fElement2.appendChild(document.createElement('mo')).textContent = '[';
  fElement2.appendChild(uElement);
  fElement2.appendChild(document.createElement('mo')).textContent = ']';
  
  const fElement3 = document.createElement('mrow');
  fElement3.appendChild(document.createElement('mo')).textContent = '[';
  fElement3.appendChild(document.createElement('mn')).textContent = '0';
  fElement3.appendChild(document.createElement('mo')).textContent = ']';
  
  const equalsElement = document.createElement('mo');
  equalsElement.textContent = '=';
  
  const fElement4 = document.createElement('mi');
  fElement4.textContent = 'f';
  
  const fElement5 = document.createElement('mrow');
  fElement5.appendChild(document.createElement('mo')).textContent = '[';
  fElement5.appendChild(uElement.cloneNode(true));
  fElement5.appendChild(document.createElement('mo')).textContent = ']';
  
  const fElement6 = document.createElement('mrow');
  fElement6.appendChild(document.createElement('mo')).textContent = '[';
  fElement6.appendChild(document.createElement('mn')).textContent = '0';
  fElement6.appendChild(document.createElement('mo')).textContent = ']';
  
  const plusElement = document.createElement('mo');
  plusElement.textContent = '+';
  
  const pElement = document.createElement('mi');
  pElement.textContent = 'p';
  
  const rElement = document.createElement('mi');
  rElement.textContent = 'r';
  
  const iElement = document.createElement('mi');
  iElement.textContent = 'i';

  const cElement = document.createElement('mi');
  cElement.textContent = 'c';
  
  const eElement = document.createElement('mi');
  eElement.textContent = 'e';
  
  mathElement.appendChild(fElement1);
  mathElement.appendChild(fElement2);
  mathElement.appendChild(fElement3);
  mathElement.appendChild(equalsElement);
  mathElement.appendChild(fElement4);
  mathElement.appendChild(fElement5);
  mathElement.appendChild(fElement6);
  mathElement.appendChild(plusElement);
  mathElement.appendChild(pElement);
  mathElement.appendChild(rElement);
  mathElement.appendChild(iElement);
  mathElement.appendChild(cElement);
  mathElement.appendChild(eElement);
 
  div.appendChild(mathElement);

  const p3 = document.createElement('p');
  p3.innerHTML = `f[${index}][0]的值为：<span>${fu0}</span>`;
  div.appendChild(p3);

  let p2 = document.createElement("p")
  p2.innerHTML = `节点${index}的price为：<span>${price}</span>`;
  div.appendChild(p2);

  parent.appendChild(div);
}

function initDoneF01Html(parent, index, fu0){
  let div = document.createElement("div");
  let p1 = document.createElement("p");
  p1.innerHTML = `子节点编号：<span>${index}</span>`;
  let p2 = document.createElement("p");
  p2.innerHTML = `f[${index}][0]已计算完成,值为：<span>${fu0}</span>`;
  div.appendChild(p1);
  div.appendChild(p2);
  parent.appendChild(div)
}

function initPreSumHtml(parent){
  let div = document.createElement('div');
  div.classList.add('item');
  let p1 = document.createElement('p');
  p1.innerHTML = '准备计算sum，公式为：';
  // 创建 MathML 标签
  const mathML = document.createElementNS('http://www.w3.org/1998/Math/MathML', 'math')

  // 创建子元素
  const summation = document.createElementNS('http://www.w3.org/1998/Math/MathML', 'mo')
  summation.textContent = '∑'
  const s = document.createElementNS('http://www.w3.org/1998/Math/MathML', 'mi')
  s.textContent = 's'
  const u = document.createElementNS('http://www.w3.org/1998/Math/MathML', 'mi')
  u.textContent = 'u'
  const m = document.createElementNS('http://www.w3.org/1998/Math/MathML', 'mi')
  m.textContent = 'm'
  const j = document.createElementNS('http://www.w3.org/1998/Math/MathML', 'mi')
  j.textContent = 'j'
  const mrow1 = document.createElementNS('http://www.w3.org/1998/Math/MathML', 'mrow')
  const left1 = document.createElementNS('http://www.w3.org/1998/Math/MathML', 'mo')
  left1.textContent = '('
  const min = document.createElementNS('http://www.w3.org/1998/Math/MathML', 'mi')
  min.textContent = 'min'
  const mrow2 = document.createElementNS('http://www.w3.org/1998/Math/MathML', 'mrow')
  const left2 = document.createElementNS('http://www.w3.org/1998/Math/MathML', 'mo')
  left2.textContent = '('
  const f1 = document.createElementNS('http://www.w3.org/1998/Math/MathML', 'mi')
  f1.textContent = 'f'
  const mrow3 = document.createElementNS('http://www.w3.org/1998/Math/MathML', 'mrow')
  const left3 = document.createElementNS('http://www.w3.org/1998/Math/MathML', 'mo')
  left3.textContent = '['
  const right3 = document.createElementNS('http://www.w3.org/1998/Math/MathML', 'mo')
  right3.textContent = ']'
  mrow3.appendChild(left3)
  mrow3.appendChild(j)
  mrow3.appendChild(right3)
  const mrow4 = document.createElementNS('http://www.w3.org/1998/Math/MathML', 'mrow')
  const left4 = document.createElementNS('http://www.w3.org/1998/Math/MathML', 'mo')
  left4.textContent = '['
  const zero1 = document.createElementNS('http://www.w3.org/1998/Math/MathML', 'mn')
  zero1.textContent = '0'
  const right4 = document.createElementNS('http://www.w3.org/1998/Math/MathML', 'mo')
  right4.textContent = ']'
  mrow4.appendChild(left4)
  mrow4.appendChild(zero1)
  mrow4.appendChild(right4)
  const coma = document.createElementNS('http://www.w3.org/1998/Math/MathML', 'mo')
  coma.textContent = ','
  const f2 = f1.cloneNode(true)
  const mrow5 = mrow3.cloneNode(true)
  const mrow7 = document.createElementNS('http://www.w3.org/1998/Math/MathML', 'mrow')
  const left7 = document.createElementNS('http://www.w3.org/1998/Math/MathML', 'mo')
  left7.textContent = '['
  const one = document.createElementNS('http://www.w3.org/1998/Math/MathML', 'mn')
  one.textContent = '1'
  const right7 = document.createElementNS('http://www.w3.org/1998/Math/MathML', 'mo')
  right7.textContent = ']'
  mrow7.appendChild(left7)
  mrow7.appendChild(one)
  mrow7.appendChild(right7)
  const right2 = document.createElementNS('http://www.w3.org/1998/Math/MathML', 'mo')
  right2.textContent = ')'
  mrow2.appendChild(left2)
  mrow2.appendChild(f1)
  mrow2.appendChild(mrow3)
  mrow2.appendChild(mrow4)
  mrow2.appendChild(coma)
  mrow2.appendChild(f2)
  mrow2.appendChild(mrow5)
  mrow2.appendChild(mrow7)
  mrow2.appendChild(right2)
  const right1 = document.createElementNS('http://www.w3.org/1998/Math/MathML', 'mo')
  right1.textContent = ')'
  mrow1.appendChild(left1)
  mrow1.appendChild(min)
  mrow1.appendChild(mrow2)
  mrow1.appendChild(right1)
  const right = document.createElementNS('http://www.w3.org/1998/Math/MathML', 'mo')
  right.textContent = ')'
  
  // 将公式插入到 HTML 页面中
  mathML.appendChild(summation)
  mathML.appendChild(s)
  mathML.appendChild(u)
  mathML.appendChild(m)
  mathML.appendChild(mrow1)
  mathML.appendChild(right)

  // 将公式插入到 HTML 页面中
  div.appendChild(p1);
  div.appendChild(mathML);

  parent.appendChild(div);
}

function initDoneSumHtml(parent, sum){
   let div = document.createElement('div');
   if(sum !== 0){
        div.innerHTML = `sum已完成计算，值为：<span>${sum}</span>`;
   }else{
        div.innerHTML = `sum已完成计算，不存在子元素`;
   }
   div.classList.add('item');
   parent.appendChild(div);
}

function initPreF1Html(parent, index, childIndex,fu1,fc0,fc1){
    let div = document.createElement('div');
    div.classList.add('item');
    let p1 = document.createElement('p'); 
    p1.innerHTML = `计算f[${index}][1]:`;
    div.appendChild(p1);
// 创建 MathML 标签
   let mathML = document.createElementNS("http://www.w3.org/1998/Math/MathML", "math");

    // 创建公式中的各个子元素
   const f1 = document.createElementNS("http://www.w3.org/1998/Math/MathML", "mi");
   f1.textContent = "f";
   const mrow1 = document.createElementNS("http://www.w3.org/1998/Math/MathML", "mrow");
   const left1 = document.createElementNS("http://www.w3.org/1998/Math/MathML", "mo");
   left1.textContent = "[";
   const u = document.createElementNS("http://www.w3.org/1998/Math/MathML", "mi");
   u.textContent = index;
   const right1 = document.createElementNS("http://www.w3.org/1998/Math/MathML", "mo");
   right1.textContent = "]";
   mrow1.appendChild(left1);
   mrow1.appendChild(u);
   mrow1.appendChild(right1);
   const mrow2 = document.createElementNS("http://www.w3.org/1998/Math/MathML", "mrow");
   const left2 = document.createElementNS("http://www.w3.org/1998/Math/MathML", "mo");
   left2.textContent = "[";
   const one = document.createElementNS("http://www.w3.org/1998/Math/MathML", "mn");
   one.textContent = "1";
   const right2 = document.createElementNS("http://www.w3.org/1998/Math/MathML", "mo");
   right2.textContent = "]";
   mrow2.appendChild(left2);
   mrow2.appendChild(one);
   mrow2.appendChild(right2);
   const equal = document.createElementNS("http://www.w3.org/1998/Math/MathML", "mo");
   equal.textContent = "=";
   const min = document.createElementNS("http://www.w3.org/1998/Math/MathML", "mi");
   min.textContent = "min";
   const mrow3 = document.createElementNS("http://www.w3.org/1998/Math/MathML", "mrow");
   const left3 = document.createElementNS("http://www.w3.org/1998/Math/MathML", "mo");
   left3.textContent = "(";
   const f2 = document.createElementNS("http://www.w3.org/1998/Math/MathML", "mi");
   f2.textContent = "f";
   const mrow4 = document.createElementNS("http://www.w3.org/1998/Math/MathML", "mrow");
   const left4 = document.createElementNS("http://www.w3.org/1998/Math/MathML", "mo");
   left4.textContent = "[";
   mrow4.appendChild(left4);
   mrow4.appendChild(u.cloneNode(true));
   mrow4.appendChild(right1.cloneNode(true));
   const mrow5 = document.createElementNS("http://www.w3.org/1998/Math/MathML", "mrow");
   const i = document.createElementNS("http://www.w3.org/1998/Math/MathML", "mi");
   i.textContent = childIndex;
   const right5 = document.createElementNS("http://www.w3.org/1998/Math/MathML", "mo");
   mrow5.appendChild(left1.cloneNode(true));
   mrow5.appendChild(one.cloneNode(true));
   mrow5.appendChild(right1.cloneNode(true));
   const comma1 = document.createElementNS("http://www.w3.org/1998/Math/MathML", "mo");
   comma1.textContent = ",";
   const s = document.createElementNS("http://www.w3.org/1998/Math/MathML", "mi");
   s.textContent = "s";
   const u1 = document.createElementNS("http://www.w3.org/1998/Math/MathML", "mi");
   u1.textContent = "u";
   const m = document.createElementNS("http://www.w3.org/1998/Math/MathML", "mi");
   m.textContent = "m";
   const minus = document.createElementNS("http://www.w3.org/1998/Math/MathML", "mo");
   minus.textContent = "-";
   const min1 = document.createElementNS("http://www.w3.org/1998/Math/MathML", "mi");
   min1.textContent = "min";
   const mrow6 = document.createElementNS("http://www.w3.org/1998/Math/MathML", "mrow");
   const left6 = document.createElementNS("http://www.w3.org/1998/Math/MathML", "mo");
   left6.textContent = "(";
   const f3 = document.createElementNS("http://www.w3.org/1998/Math/MathML", "mi");
   f3.textContent = "f";
   const mrow7 = document.createElementNS("http://www.w3.org/1998/Math/MathML", "mrow");
   const left7 = document.createElementNS("http://www.w3.org/1998/Math/MathML", "mo");
   left7.textContent = "[";
   mrow7.appendChild(left7);
   mrow7.appendChild(i.cloneNode(true));
   mrow7.appendChild(right1.cloneNode(true));
   const mrow8 = document.createElementNS("http://www.w3.org/1998/Math/MathML", "mrow");
   const left8 = document.createElementNS("http://www.w3.org/1998/Math/MathML", "mo");
   left8.textContent = "[";
   const zero = document.createElementNS("http://www.w3.org/1998/Math/MathML", "mn");
   zero.textContent = "0";
   const right8 = document.createElementNS("http://www.w3.org/1998/Math/MathML", "mo");
   right8.textContent = "]";
   mrow8.appendChild(left8);
   mrow8.appendChild(zero);
   mrow8.appendChild(right8);
   const comma2 = document.createElementNS("http://www.w3.org/1998/Math/MathML", "mo");
   comma2.textContent = ",";
   const f4 = document.createElementNS("http://www.w3.org/1998/Math/MathML", "mi");
   f4.textContent = "f";
   mrow6.appendChild(left6);
   mrow6.appendChild(f3);
   mrow6.appendChild(mrow7);
   mrow6.appendChild(mrow8);
   mrow6.appendChild(comma2);
   mrow6.appendChild(f4);
   mrow6.appendChild(mrow7.cloneNode(true));
   mrow6.appendChild(mrow2.cloneNode(true));
   mrow6.appendChild(right1.cloneNode(true));
   const right6 = document.createElementNS("http://www.w3.org/1998/Math/MathML", "mo");
   right6.textContent = ")";mrow3.appendChild(left3);
   mrow6.appendChild(right6);
   mrow3.appendChild(f2);
   mrow3.appendChild(mrow4);
   mrow3.appendChild(mrow5);
   mrow3.appendChild(comma1);
   mrow3.appendChild(s);
   mrow3.appendChild(u1);
   mrow3.appendChild(m);
   mrow3.appendChild(minus);
   mrow3.appendChild(min1);
   mrow3.appendChild(mrow6);
   mrow3.appendChild(right6.cloneNode(true));
   const plus = document.createElementNS("http://www.w3.org/1998/Math/MathML", "mo");
   plus.textContent = "+";
   const mrow9 = document.createElementNS("http://www.w3.org/1998/Math/MathML", "mrow");
   const f5 = document.createElementNS("http://www.w3.org/1998/Math/MathML", "mi");
   f5.textContent = "f";
   const mrow10 = document.createElementNS("http://www.w3.org/1998/Math/MathML", "mrow");
   const left10 = document.createElementNS("http://www.w3.org/1998/Math/MathML", "mo");
   left10.textContent = "[";
   mrow10.appendChild(left10);
   mrow10.appendChild(i);
   mrow10.appendChild(right1.cloneNode(true));
   const mrow11 = document.createElementNS("http://www.w3.org/1998/Math/MathML", "mrow");
   const left11 = document.createElementNS("http://www.w3.org/1998/Math/MathML", "mo");
   left11.textContent = "[";
   const zero1 = document.createElementNS("http://www.w3.org/1998/Math/MathML", "mn");
   zero1.textContent = "0";
   const right11 = document.createElementNS("http://www.w3.org/1998/Math/MathML", "mo");
   right11.textContent = "]";
   mrow11.appendChild(left11);
   mrow11.appendChild(zero1);
   mrow11.appendChild(right11);
   mrow9.appendChild(f5);
   mrow9.appendChild(mrow10);
   mrow9.appendChild(mrow11);
   mathML.appendChild(f1);
   mathML.appendChild(mrow1);
   mathML.appendChild(mrow2);
   mathML.appendChild(equal);
   mathML.appendChild(min.cloneNode(true));
   mathML.appendChild(mrow3);
   mathML.appendChild(plus);
   mathML.appendChild(f5.cloneNode(true));
   mathML.appendChild(mrow10.cloneNode(true));
   mathML.appendChild(mrow11.cloneNode(true));
   
   // 将公式插入到 HTML 页面中
   div.appendChild(mathML);

   let item5 = document.createElement('p');
   item5.innerHTML = `f[${index}][1]的值为：<span>${fu1}</span>`;
   div.appendChild(item5);

   let item6 = document.createElement('p');
   item6.innerHTML = `f[${childIndex}][0]的值为：<span>${fc0}</span>`;
   div.appendChild(item6);
   SetNodeClass(childIndex, "node_current_child")
  
   let item7 = document.createElement('p');
   item7.innerHTML = `f[${childIndex}][1]的值为：<span>${fc1}</span>`;
   div.appendChild(item7);

   parent.appendChild(div);
}

function initDoneF1Html(parent, index, fu1){
  let item5 = document.createElement('div');
  item5.innerHTML = `f[${index}][1]的值为：<span>${fu1}</span>`;
  item5.classList.add('item');
  parent.appendChild(item5);
}

function initPreF2Html(parent, index, childIndex, fc1, fu2){
    let div = document.createElement('div');
    div.classList.add('item');

      // 创建 MathML 标签
    const mathML = document.createElementNS("http://www.w3.org/1998/Math/MathML", "math");

    // 创建公式中的各个子元素
    const f1 = document.createElementNS("http://www.w3.org/1998/Math/MathML", "mi");
    f1.textContent = "f";
    const f2 = f1.cloneNode(true);
    const mrow1 = document.createElementNS("http://www.w3.org/1998/Math/MathML", "mrow");
    const left1 = document.createElementNS("http://www.w3.org/1998/Math/MathML", "mo");
    left1.textContent = "[";
    const u = document.createElementNS("http://www.w3.org/1998/Math/MathML", "mn");
    u.textContent = index;
    const right1 = document.createElementNS("http://www.w3.org/1998/Math/MathML", "mo");
    right1.textContent = "]";
    mrow1.appendChild(left1);
    mrow1.appendChild(u);
    mrow1.appendChild(right1);
    const mrow2 = document.createElementNS("http://www.w3.org/1998/Math/MathML", "mrow");
    const left2 = document.createElementNS("http://www.w3.org/1998/Math/MathML", "mo");
    left2.textContent = "[";
    const two = document.createElementNS("http://www.w3.org/1998/Math/MathML", "mn");
    two.textContent = "2";
    const right2 = document.createElementNS("http://www.w3.org/1998/Math/MathML", "mo");
    right2.textContent = "]";
    mrow2.appendChild(left2);
    mrow2.appendChild(two);
    mrow2.appendChild(right2);
    const equal = document.createElementNS("http://www.w3.org/1998/Math/MathML", "mo");
    equal.textContent = "=";
    const plus = document.createElementNS("http://www.w3.org/1998/Math/MathML", "mo");
    plus.textContent = "+";
    const mrow3 = mrow1.cloneNode(true);
    const mrow4 = mrow2.cloneNode(true);
    const f3 = f1.cloneNode(true);
    const mrow5 = document.createElementNS("http://www.w3.org/1998/Math/MathML", "mrow");
    const left5 = document.createElementNS("http://www.w3.org/1998/Math/MathML", "mo");
    left5.textContent = "[";
    const i = document.createElementNS("http://www.w3.org/1998/Math/MathML", "mi");
    i.textContent = childIndex;
    const right5 = document.createElementNS("http://www.w3.org/1998/Math/MathML", "mo");
    right5.textContent = "]";
    mrow5.appendChild(left5);
    mrow5.appendChild(i);
    mrow5.appendChild(right5);
    const mrow6 = document.createElementNS("http://www.w3.org/1998/Math/MathML", "mrow");
    const left6 = document.createElementNS("http://www.w3.org/1998/Math/MathML", "mo");
    left6.textContent = "[";
    const one = document.createElementNS("http://www.w3.org/1998/Math/MathML", "mn");
    one.textContent = "1";
    const right6 = document.createElementNS("http://www.w3.org/1998/Math/MathML", "mo");
    right6.textContent = "]";
    mrow6.appendChild(left6);
    mrow6.appendChild(one);
    mrow6.appendChild(right6);
  
    mathML.appendChild(f1);
    mathML.appendChild(mrow1);
    mathML.appendChild(mrow2);
    mathML.appendChild(equal);
    mathML.appendChild(f2);
    mathML.appendChild(mrow3);
    mathML.appendChild(mrow4);
    mathML.appendChild(plus);
    mathML.appendChild(f3);
    mathML.appendChild(mrow5);
    mathML.appendChild(mrow6);

    // 将公式插入到 HTML 页面中
    div.appendChild(mathML);

    let p1 = document.createElement('p');
    p1.innerHTML = `f[${index}][2]的值为：<span>${fu2}</span>`;
    div.appendChild(p1);

    let p2 = document.createElement('p');
    p2.innerHTML = `子节点值：f[${childIndex}][1]=<span>${fc1}</span>`;
    p2.classList.add('item');
    div.appendChild(p2);

    parent.appendChild(div);
}

function initDoneF2Html(parent, index, fu2){
  let item5 = document.createElement('div');
  item5.innerHTML = `f[${index}][2]的值为：<span>${fu2}</span>`;
  item5.classList.add('item');
  parent.appendChild(item5);
}

function genTreeSvg(o){
    let data = convertToTreeStructure(o.result, o.prices);
    let width = 500;
    let height = 500;

    let treeLayout = d3.tree()
        .size([height - 80, width - 80]);

    let root = d3.hierarchy(data);

    treeLayout(root);

    let svg = d3.select("svg g");

    let links = svg.selectAll(".link")
      .data(root.links())
      .enter()
      .append("path")
      .attr("class", "link")
      .attr("d", d3.linkVertical()
        .x(d => d.x)
        .y(d => d.y));

    let nodes = svg.selectAll(".node")
      .data(root.descendants())
      .enter()
      .append("g")
      .attr("class", "node")
      .attr("id", (d)=>{
        return "node" + d.data.index;
      })
      .attr("transform", d => `translate(${d.x}, ${d.y})`);

    nodes.append("circle")
      .attr("r", 40);

    nodes.append("text")
      .attr("dx", -15)
      .attr("dy", 5)
      .text(d => `${d.data.index}[${d.data.weight}]`);

}

function BuildCal(str){
  const html = '<div class="cal_container">' +
    '<div id="left" class="left">' +
    '<svg height="100%" width="100%">' +
    '<g transform="translate(60, 60)"></g>' +
    '</svg>' +
    '</div>' +
    '<div class="toolbox">' +
    '<div id="status-wrapper"></div>' +
    '<button id="next-button" class="next-button" style="position: absolute;bottom: 5%;">下一步</button>' +
    '</div>' +
    '</div>';
  document.body.innerHTML = html;
  Cal(str);
}



