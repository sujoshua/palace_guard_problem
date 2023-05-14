import {Graph, Line, Node} from "./nodeManager.js"

function BuildGraph(){
  ClearBody();
  var graph = new Graph();
  // html元素初始化
  initPopup(); // 最早初始化，后面的初始化可能依赖它
  var build_container = initBuildContainer(document.body);
  var canvas = initWrapper(build_container);
  var icon = initModelIcon(canvas);
  initEmperor(canvas, graph);
  initToolBox(build_container);

  var isDragging = false; // 标记是否在拖拽状态
  var clone = null;
  var offsetX = 0, offsetY = 0;
  var clones = 1;
  var line_index = 0;
  var dragIconOriginX = 0, dragIconOriginY = 0;
  icon.addEventListener('mousedown', onMouseDown);
  

  $(".next-button")[0].addEventListener("click", function(event){
      let str = graph.output();
      console.log(str);
      BuildCal(str);
  })

  function initBuildContainer(parent){
      let container = document.createElementNS("http://www.w3.org/1999/xhtml", "div");
      container.setAttribute("class", "build_container");
      parent.appendChild(container);
      return container;
  }

  function initWrapper(parent){
    let e = document.createElementNS("http://www.w3.org/1999/xhtml", "div");
    e.id = "wrapper";
    parent.appendChild(e);
    return e
  }

  function initModelIcon(parent){
    let div = document.createElement("div");
    div.setAttribute("id", "icon");
    div.setAttribute("class", "icon-tags");

    let divIcon = document.createElement("div");
    divIcon.setAttribute("class", "icon");

    let divTags = document.createElement("div");
    divTags.setAttribute("class", "tags");

    let span1 = document.createElement("span");
    span1.setAttribute("class", "tag");
    span1.innerText = "index:0";

    let span2 = document.createElement("span");
    span2.setAttribute("class", "tag");
    span2.innerText = "price:0";

    divTags.appendChild(span1);
    divTags.appendChild(span2);

    div.appendChild(divIcon);
    div.appendChild(divTags);

    parent.appendChild(div);

    return div
  } 

  // 插入弹窗所需要的html代码
  function initPopup(){
  // 创建蒙版元素
  const overlay = document.createElement('div');
  overlay.id = 'overlay';

  // 创建弹出框元素
  const popup = document.createElement('div');
  popup.id = 'popup';

  // 创建弹出框内容元素
  const popupContent = document.createElement('div');
  popupContent.id = 'popup-content';

  // 创建输入框及其对应标签元素
  const popupLabel = document.createElement('label');
  popupLabel.for = 'popup-input';
  popupLabel.innerText = '请输入:';

  const popupInput = document.createElement('input');
  popupInput.type = 'text';
  popupInput.id = 'popup-input';

  // 创建确定及取消按钮元素
  const popupOk = document.createElement('button');
  popupOk.id = 'popup-ok';
  popupOk.innerText = '确定';

  const popupCancel = document.createElement('button');
  popupCancel.id = 'popup-cancel';
  popupCancel.innerText = '取消';

  // 将所有元素添加到 DOM 中
  popupContent.appendChild(popupLabel);
  popupContent.appendChild(popupInput);
  popupContent.appendChild(popupOk);
  popupContent.appendChild(popupCancel);
  popup.appendChild(popupContent);
  document.body.appendChild(overlay);
  document.body.appendChild(popup);

  }

  // 初始化皇帝宫殿
  function initEmperor(parent,_graph){
    // 创建div元素
    let div = document.createElement('div');
    div.id = 'emperor-wrapper'; // 设置id属性

    // 创建img元素
    let img = document.createElement('img');
    img.id = 'emperor-img'; // 设置id属性
    img.src = 'emperor.png'; // 设置src属性
    div.appendChild(img); // 将img元素添加到div元素下面

    // 创建div元素
    let tagsDiv = document.createElement('div');
    tagsDiv.className = 'tags'; // 设置class属性

    // 创建两个span元素
    let span1 = document.createElement('span');
    span1.className = 'tag';
    span1.innerHTML = 'index:0'; // 设置span元素的文字内容

    let span2 = document.createElement('span');
    span2.className = 'tag';
    span2.innerHTML = 'price:0'; // 设置span元素的文字内容

    // 将两个span元素添加到div元素下面
    tagsDiv.appendChild(span1);
    tagsDiv.appendChild(span2);

    // 将tagsDiv元素添加到div元素下面
    div.appendChild(tagsDiv);
    
    div.addEventListener("click", handleIconClick(div));
    openPopup((price)=>{
      span1.innerHTML = 'index:1';
      span2.innerHTML = 'price:' + price;
      _graph.addNode(new Node(clones++, div, price));
    });
    parent.appendChild(div);
    return div;
  }

  function initToolBox(parent){
    let div = document.createElement("div");
    div.setAttribute("class", "toolbox");

    let h1 = document.createElement("h1");
    h1.innerText = "皇宫看守问题";

    let img = document.createElement("img");
    img.setAttribute("id", "lu-img");
    img.setAttribute("src", "https://th.bing.com/th/id/R.5ad05deb1cb7bf26a41a3b1a170e0f2a?rik=NNq60N1L%2f3Rg8Q&riu=http%3a%2f%2fpic.baike.soso.com%2fp%2f20140410%2f20140410153410-1525761783.jpg&ehk=%2bLXVL4PX0QhnghluEkKKhdpCtohszT%2bij%2bFryNz9fwM%3d&risl=&pid=ImgRaw&r=0");
    img.setAttribute("alt", "陆小凤");

    let button = document.createElement("button");
    button.setAttribute("class", "next-button");
    button.innerText = "下一步";

    div.appendChild(h1);
    div.appendChild(img);
    div.appendChild(button);
    parent.appendChild(div);
    return div;
  }

  function calWrapCoordinate() {
     const wrapperRect = wrapper.getBoundingClientRect();
     return {
        x: wrapperRect.left + window.scrollX,
        y: wrapperRect.top + window.scrollY
     }
  }

  calWrapCoordinate();

  function onMouseDown(event) { 
    // 
    clone = icon.cloneNode(true);
    clone.setAttribute('id', 'clones' + String(clones));
    clone.style.position = 'absolute';
    clone.style.left = event.pageX + 'px';
    clone.style.top = event.pageY + 'px';
    clone.style.cursor = 'move';
    canvas.appendChild(clone);
    var _clone = clone;

    let iconRect = clone.getBoundingClientRect();
    dragIconOriginX = iconRect.left;
    dragIconOriginY = iconRect.top;
    // 记录鼠标指针位置与初始图标位置的位移
    offsetX = event.offsetX;
    offsetY = event.offsetY;

    // 开始拖拽
    isDragging = true;

    // 监听拖拽事件和鼠标抬起事件
    document.addEventListener('mousemove', onDrag);
    document.addEventListener('mouseup', onMouseUp);
    clone.addEventListener('dblclick', handleDoubleClick)
    clone.addEventListener('click', handleIconClick(_clone));
  }

  function handleIconClick(obj){
    return ()=>{
      if (obj.classList.contains('icon_selected')) {
        obj.classList.remove('icon_selected');
        selectedIcons.splice(selectedIcons.indexOf(obj), 1);
        return;
      }
      obj.classList.add('icon_selected');
      selectedIcons.push(obj);
      if (selectedIcons.length === 2 && selectedIcons[0] !== obj) {
      // 如果已有一个选中的图标，并且当前选中的图标不是已选的图标
        connectIcons(selectedIcons[0], obj);
        clearSelectedIcons();
    }
  }
  }

  function onDrag(event) {
      if (!isDragging) {
        return;
      }

      // 计算克隆元素新的位置，减去位移值，使鼠标指针对准克隆元素中心
      var x = event.pageX - offsetX;
      var y = event.pageY - offsetY;

      clone.style.transform = 'translate(' + x + 'px, ' + y + 'px)';
    }

  function onMouseUp(event) {
      if (!isDragging) {
        return;
      }



      // 取消拖拽事件监听器，使克隆元素固定在指定位置
      document.removeEventListener('mousemove', onDrag);
      document.removeEventListener('mouseup', onMouseUp);
      // 检测是否和别的图标重叠
      var overlap = false;
      for (var i = 0; i < canvas.children.length; i++) {
        var child = canvas.children[i];
        if (child !== clone && checkOverlap(clone, child)) {
          overlap = true;
          break;
        }
      }
      if (overlap) {
        event.target.animate(
          { "left": event.target.getBoundingClientRect.left + "px", "top": event.target.getBoundingClientRect.top + "px" }
        ).onfinish = function () { event.target.remove(); };
      }
      else {
        isDragging = false;
        openPopup((price)=>{
          console.log(price)
          let e = document.getElementById("clones"+String(clones))
          if(price !== 0){
            graph.addNode(new Node(clones, event.target, price));
            e.childNodes[1].childNodes[0].innerHTML = 'index:'+clones;
            e.childNodes[1].childNodes[1].innerHTML = 'price:'+price;
            clones++;
          }else{
            e.target.remove();
          }
        })
      }

  }

  function parseLineIndex(element){
    return Number(element.id.replace('line', ''));
  }

  function parseNodeIndex(element){
    if (element.id === 'emperor-wrapper') {
      return 1;
    }
    return Number(element.id.replace('clones', ''));
  }

  function handleDoubleClick(event) {
      event.target.remove();
      selectedIcons = [];
      graph.delNode(parseNodeIndex(event.target));
  }

  // 记录已选的图标
  let selectedIcons = [];

  function tripPx(str) {
    return Number(str.replace('px', ''));
  }

  // 连接两个图标
  function connectIcons(startObj, endObj) {

      var pos1 = getWrapCoordinate(startObj)
      var pos2 = getWrapCoordinate(endObj)
      //var start = getPos(pos1, pos2).start
      //var end = getPos(pos1, pos2).end

      const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      svg.setAttribute("class", "lineWrap");

      const line_obj = document.createElementNS("http://www.w3.org/2000/svg", "line");
      line_obj.setAttribute("id", "line"+String(line_index));  
      line_obj.setAttribute("x1", pos1.x)
      line_obj.setAttribute("y1", pos1.y)
      line_obj.setAttribute("x2",pos2.x)
      line_obj.setAttribute("y2", pos2.y)
      line_obj.setAttribute("stroke", "#000");
      line_obj.setAttribute("stroke-width", "2");
      line_obj.setAttribute("stroke-dasharray", "10,10");

      svg.appendChild(line_obj);
      let line= new Line(line_index, parseNodeIndex(startObj), parseNodeIndex(endObj), svg);
      line_index++;

      line_obj.addEventListener('dblclick', (event) => {
        console.log("1");
        graph.delLine(parseLineIndex(event.target));  
      });

      if(graph.addLine(line)){
        canvas.appendChild(svg);
      }
  }


  function clearSelectedIcons() {
    selectedIcons.forEach(icon => {
      icon.classList.remove('icon_selected');
    });
    selectedIcons = [];
  }

  //获取元素左上角相对于某一元素的的位置
  function getWrapCoordinate(element){
    parent = document.getElementById('wrapper');
    return {
      x: element.getBoundingClientRect().left - parent.getBoundingClientRect().left + element.offsetWidth/2 ,
      y: element.getBoundingClientRect().top - parent.getBoundingClientRect().top + element.offsetHeight/2
    }
  }



    function checkOverlap(element1, element2) {
      var rect1 = element1.getBoundingClientRect();
      var rect2 = element2.getBoundingClientRect();
      return !(
      rect1.right < rect2.left ||
      rect1.left > rect2.right ||
      rect1.bottom < rect2.top ||
      rect1.top > rect2.bottom
      );
      }

  function openPopup(callback) {
    document.getElementById('overlay').style.display = 'block';
    document.getElementById('popup').style.display = 'block';
    let popokHandler = function() {
      var value = document.getElementById('popup-input').value;
      callback(value);
      closePopup();
    }

    let popcancelHandler = function() {
      callback(0);
      closePopup();
    }

    document.getElementById('popup-ok').addEventListener('click', popokHandler);

    document.getElementById('popup-cancel').addEventListener('click', popcancelHandler);

    function closePopup() {
      document.getElementById('overlay').style.display = 'none';
      document.getElementById('popup').style.display = 'none';
      document.getElementById('popup-ok').removeEventListener('click', popokHandler);
      document.getElementById('popup-cancel').removeEventListener('click', popcancelHandler);
    }
  }
}

// 清除body内所有内容
function ClearBody(){
  document.body.innerHTML=""
}

function BuildStart(){
  ClearBody();
  let startContainer = document.createElement('div');
  startContainer.classList.add('start_container');

  let header = document.createElement('h1');
  header.textContent = '皇宫看守问题';

  let button = document.createElement('button');
  button.textContent = '开始';
  button.onclick = BuildGraph;

  startContainer.appendChild(header);
  startContainer.appendChild(button);
  document.body.appendChild(startContainer);

}

BuildStart();