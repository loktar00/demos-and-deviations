function PathFinder(data){
    this.data = data;
    this.nodeList = [];
    this.init();
}

PathFinder.prototype.init = function(){
    // build and reset data structure that pathfinder will use
    for(var y = 0; y < this.data.length; y++){
        this.nodeList[y] = [];
    }

    for(var x = 0; x < this.data[0].length; x++){
        for(y = 0; y < this.data.length; y++){
            this.nodeList[y][x] ={
                g : 0,
                h : 0,
                f : 0,
                open : false,
                checked : false,
                parent : null,
                value : this.data[y][x],
                x : x,
                y : y
            };
        }
    }
};

PathFinder.prototype.getPath = function(start,end){
    // reset pathfinder data
    this.init();

    // for debugging
    var startTime = new Date().getTime();

    var openList = [],
        closedList = [],
        startNode = {},
        nodeList = [];
   
    startNode.parent = null;
    startNode.g = 0;
    startNode.h = this.getHeuristic(startNode, end);
    startNode.f = startNode.g + startNode.h;
    startNode.open = true;
    startNode.x = start.x;
    startNode.y = start.y;
    openList.push(startNode);

    var i = 0,
        neighbors = [],
        neighbor = null;

    while(openList.length > 0){
        var curNode = openList.pop();

        if(curNode.x === end.x && curNode.y === end.y){
            // build path 
            var cur = curNode,
                path = [];
            
            while(cur.parent) {
                path.push(cur);
                cur = cur.parent;
            }
            path.push(cur);
            
            // for debugging
            totalTime = new Date().getTime() - startTime;
            //console.log(totalTime);

            return path;
        }else{
            curNode.checked = true;
            curNode.open = false;
            neighbors = this.getNeighbors(curNode);   
            for(i = 0; i < neighbors.length; i++){
                var neighbor = neighbors[i];
                if(neighbor.checked || neighbor.value > 0){
                    continue;   
                }
                
                var gScore = curNode.g + 1,
                    betterGScore = false;
                
                if(!neighbor.open){
                    betterGScore = true;
                    neighbor.h = this.getHeuristic(neighbor, end);
                    neighbor.open = true;
                    openList.push(neighbor);
                    openList.sort(this.sortByF);
                }else if(gScore < neighbor.g){
                    betterGScore = true;
                }
                
                if(betterGScore){
                    neighbor.parent = curNode;
                    neighbor.g = gScore;
                    neighbor.f = neighbor.g + neighbor.h;
                    openList.sort(this.sortByF);
                }
            }
        }
    }
};

PathFinder.prototype.getHeuristic = function(node1, node2){
        // This is the Manhattan distance
        var d1 = Math.abs (node2.x - node1.x);
        var d2 = Math.abs (node2.y - node1.y);
        return d1 + d2;
};

PathFinder.prototype.getNeighbors = function(node) {
    var ret = [],
        x = node.y,
        y = node.x;
    
    if(this.nodeList[x-1] && this.nodeList[x-1][y]) {
        ret.push(this.nodeList[x-1][y]);
    }
    if(this.nodeList[x+1] && this.nodeList[x+1][y]) {
        ret.push(this.nodeList[x+1][y]);
    }
    if(this.nodeList[x][y-1] && this.nodeList[x][y-1]) {
        ret.push(this.nodeList[x][y-1]);
    }
    if(this.nodeList[x][y+1] && this.nodeList[x][y+1]) {
        ret.push(this.nodeList[x][y+1]);
    }

    // check angles
    /*if(this.nodeList[x-1] && this.nodeList[x-1][y-1]) {
        ret.push(this.nodeList[x-1][y-1]);
    }
    if(this.nodeList[x+1] && this.nodeList[x+1][y+1]) {
        ret.push(this.nodeList[x+1][y+1]);
    }
    if(this.nodeList[x+1] && this.nodeList[x+1][y-1]) {
        ret.push(this.nodeList[x+1][y-1]);
    }
    if(this.nodeList[x-1][y] && this.nodeList[x-1][y+1]) {
        ret.push(this.nodeList[x-1][y+1]);
    }*/
    return ret;
};

PathFinder.prototype.sortByF = function(a, b){
    var aa = a.f,
        bb = b.f;
    
    return ((aa < bb) ? 1 : ((aa > bb) ? -1 : 0));
};
